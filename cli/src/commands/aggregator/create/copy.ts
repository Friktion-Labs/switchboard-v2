import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import {
  AccountInfo,
  Keypair,
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionSignature,
} from "@solana/web3.js";
import {
  prettyPrintAggregator,
  promiseWithTimeout,
} from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  CrankAccount,
  JobAccount,
  LeaseAccount,
  OracleJob,
  OracleQueueAccount,
  packInstructions,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  signTransactions,
  SwitchboardDecimal,
} from "@switchboard-xyz/switchboard-v2";
import Big from "big.js";
import BaseCommand from "../../../BaseCommand";
import { sleep, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorCreateCopy extends BaseCommand {
  static description = "copy an aggregator account to a new oracle queue";

  static flags = {
    ...BaseCommand.flags,
    force: flags.boolean({ description: "skip job confirmation" }),
    outputFile: flags.string({
      char: "f",
      description: "output file to save aggregator definition to",
    }),
    authority: flags.string({
      char: "a",
      description: "alternate keypair that will be the aggregator authority",
    }),
    minOracles: flags.integer({
      description: "override source aggregator's minOracleResults",
    }),
    batchSize: flags.integer({
      description: "override source aggregator's oracleRequestBatchSize",
    }),
    minJobs: flags.integer({
      description: "override source aggregator's minJobResults",
    }),
    minUpdateDelay: flags.integer({
      description: "override source aggregator's minUpdateDelaySeconds",
    }),
    forceReportPeriod: flags.integer({
      description: "override source aggregator's forceReportPeriod",
    }),
    varianceThreshold: flags.string({
      description: "override source aggregator's varianceThreshold",
    }),
    queueKey: flags.string({
      description: "public key of the queue to create aggregator for",
      required: true,
    }),
    crankKey: flags.string({
      description: "public key of the crank to push aggregator to",
      required: false,
    }),
  };

  static args = [
    {
      name: "aggregatorSource",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator account to copy",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:create:copy 8SXvChNYFhRq4EZuZvnhjrB3jJRQCv4k3P4W6hesH3Ee AY3vpUu6v49shWajeFjHjgikYfaBWNJgax8zoEouUDTs --keypair ../payer-keypair.json",
  ];

  async run() {
    verifyProgramHasPayer(this.program);
    const { args, flags } = this.parse(AggregatorCreateCopy);

    const payerKeypair = programWallet(this.program);

    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const programState = await programStateAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: new PublicKey(flags.queueKey),
    });
    const queue = await queueAccount.loadData();
    const tokenMint = await queueAccount.loadMint();
    const tokenWallet = (
      await tokenMint.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey)
    ).address;

    const sourceAggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorSource,
    });
    const sourceAggregator = await sourceAggregatorAccount.loadData();
    const sourceJobPubkeys: PublicKey[] = sourceAggregator.jobPubkeysData.slice(
      0,
      sourceAggregator.jobPubkeysSize
    );

    const sourceJobAccounts = sourceJobPubkeys.map((publicKey) => {
      return new JobAccount({ program: this.program, publicKey: publicKey });
    });

    const sourceJobs = await Promise.all(
      sourceJobAccounts.map(async (jobAccount) => {
        const data = await jobAccount.loadData();
        const job = OracleJob.decodeDelimited(data.data);
        return { job, data };
      })
    );

    const createAccountInstructions: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];
    const createAccountSigners: Keypair[] = [payerKeypair];

    const jobAccounts = await Promise.all(
      sourceJobs.map(async ({ job, data }) => {
        const jobKeypair = Keypair.generate();
        createAccountSigners.push(jobKeypair);

        const jobData = Buffer.from(
          OracleJob.encodeDelimited(
            OracleJob.create({
              tasks: job.tasks,
            })
          ).finish()
        );
        const size =
          280 + jobData.length + (data.variables?.join("")?.length ?? 0);

        createAccountInstructions.push([
          SystemProgram.createAccount({
            fromPubkey: payerKeypair.publicKey,
            newAccountPubkey: jobKeypair.publicKey,
            space: size,
            lamports:
              await this.program.provider.connection.getMinimumBalanceForRentExemption(
                size
              ),
            programId: this.program.programId,
          }),
          await this.program.methods
            .jobInit({
              name: Buffer.from(data.name),
              data: jobData,
              variables:
                data.variables?.map((item) => Buffer.from("")) ??
                new Array<Buffer>(),
              authorWallet: payerKeypair.publicKey,
              stateBump,
            })
            .accounts({
              job: jobKeypair.publicKey,
              authorWallet: tokenWallet,
              authority: payerKeypair.publicKey,
              programState: programStateAccount.publicKey,
            })
            // .signers([jobKeypair])
            .instruction(),
        ]);

        return new JobAccount({
          program: this.program,
          publicKey: jobKeypair.publicKey,
        });
      })
    );

    const aggregatorKeypair = Keypair.generate();
    this.logger.debug(`Aggregator: ${aggregatorKeypair.publicKey}`);
    createAccountSigners.push(aggregatorKeypair);
    const aggregatorSize = this.program.account.aggregatorAccountData.size;
    const permissionAccountSize =
      this.program.account.permissionAccountData.size;
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      aggregatorKeypair.publicKey
    );

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: aggregatorKeypair.publicKey,
    });

    // Create lease and push to crank
    const [leaseAccount, leaseBump] = LeaseAccount.fromSeed(
      this.program,
      queueAccount,
      aggregatorAccount
    );
    const leaseEscrow = await spl.Token.getAssociatedTokenAddress(
      spl.ASSOCIATED_TOKEN_PROGRAM_ID,
      spl.TOKEN_PROGRAM_ID,
      tokenMint.publicKey,
      leaseAccount.publicKey,
      true
    );

    const jobPubkeys: Array<PublicKey> = [];
    const jobWallets: Array<PublicKey> = [];
    const walletBumps: Array<number> = [];
    for (let idx in jobAccounts) {
      const [jobWallet, bump] = anchor.utils.publicKey.findProgramAddressSync(
        [
          payerKeypair.publicKey.toBuffer(),
          spl.TOKEN_PROGRAM_ID.toBuffer(),
          tokenMint.publicKey.toBuffer(),
        ],
        spl.ASSOCIATED_TOKEN_PROGRAM_ID
      );
      jobPubkeys.push(jobAccounts[idx].publicKey);
      jobWallets.push(jobWallet);
      walletBumps.push(bump);
    }

    createAccountInstructions.push(
      [
        // allocate aggregator space
        SystemProgram.createAccount({
          fromPubkey: payerKeypair.publicKey,
          newAccountPubkey: aggregatorKeypair.publicKey,
          space: aggregatorSize,
          lamports:
            await this.program.provider.connection.getMinimumBalanceForRentExemption(
              aggregatorSize
            ),
          programId: this.program.programId,
        }),
        // create aggregator
        await this.program.methods
          .aggregatorInit({
            name: sourceAggregator.name,
            metadata: sourceAggregator.metadata,
            batchSize:
              flags.batchSize ?? sourceAggregator.oracleRequestBatchSize,
            minOracleResults:
              flags.minOracles ?? sourceAggregator.minOracleResults,
            minJobResults: flags.minJobs ?? sourceAggregator.minJobResults,
            minUpdateDelaySeconds:
              flags.minUpdateDelay ?? sourceAggregator.minUpdateDelaySeconds,
            varianceThreshold: flags.varianceThreshold
              ? SwitchboardDecimal.fromBig(new Big(flags.varianceThreshold))
              : sourceAggregator.varianceThreshold,
            forceReportPeriod:
              flags.forceReportPeriod ?? sourceAggregator.forceReportPeriod,
            stateBump,
          })
          .accounts({
            aggregator: aggregatorKeypair.publicKey,
            authority: payerKeypair.publicKey,
            queue: queueAccount.publicKey,
            authorWallet: tokenWallet,
            programState: programStateAccount.publicKey,
          })
          .instruction(),
        // create permissions
        await this.program.methods
          .permissionInit({})
          .accounts({
            permission: permissionAccount.publicKey,
            authority: queue.authority,
            granter: queueAccount.publicKey,
            grantee: aggregatorKeypair.publicKey,
            payer: payerKeypair.publicKey,
            systemProgram: SystemProgram.programId,
          })
          .instruction(),
        payerKeypair.publicKey.equals(queue.authority)
          ? await this.program.methods
              .permissionSet({
                permission: { permitOracleQueueUsage: null },
                enable: true,
              })
              .accounts({
                permission: permissionAccount.publicKey,
                authority: queue.authority,
              })
              .instruction()
          : undefined,
        spl.Token.createAssociatedTokenAccountInstruction(
          spl.ASSOCIATED_TOKEN_PROGRAM_ID,
          spl.TOKEN_PROGRAM_ID,
          tokenMint.publicKey,
          leaseEscrow,
          leaseAccount.publicKey,
          payerKeypair.publicKey
        ),
        await this.program.methods
          .leaseInit({
            loadAmount: new anchor.BN(0),
            stateBump,
            leaseBump,
            withdrawAuthority: payerKeypair.publicKey,
            walletBumps: Buffer.from([]),
          })
          .accounts({
            programState: programStateAccount.publicKey,
            lease: leaseAccount.publicKey,
            queue: queueAccount.publicKey,
            aggregator: aggregatorAccount.publicKey,
            systemProgram: SystemProgram.programId,
            funder: tokenWallet,
            payer: payerKeypair.publicKey,
            tokenProgram: spl.TOKEN_PROGRAM_ID,
            escrow: leaseEscrow,
            owner: payerKeypair.publicKey,
            mint: tokenMint.publicKey,
          })
          // .remainingAccounts(
          //   jobPubkeys.concat(jobWallets).map((pubkey: PublicKey) => {
          //     return { isSigner: false, isWritable: true, pubkey };
          //   })
          // )
          .instruction(),
        flags.crankKey
          ? await this.program.methods
              .crankPush({
                stateBump,
                permissionBump,
              })
              .accounts({
                crank: new PublicKey(flags.crankKey),
                aggregator: aggregatorAccount.publicKey,
                oracleQueue: queueAccount.publicKey,
                queueAuthority: queue.authority,
                permission: permissionAccount.publicKey,
                lease: leaseAccount.publicKey,
                escrow: leaseEscrow,
                programState: programStateAccount.publicKey,
                dataBuffer: (
                  await new CrankAccount({
                    program: this.program,
                    publicKey: new PublicKey(flags.crankKey),
                  }).loadData()
                ).dataBuffer,
              })
              .instruction()
          : undefined,
      ].filter((item) => item)
    );

    const finalInstructions: (
      | TransactionInstruction
      | TransactionInstruction[]
    )[] = [];

    finalInstructions.push(
      ...(await Promise.all(
        jobAccounts.map(async (jobAccount) => {
          return this.program.methods
            .aggregatorAddJob({
              weight: 1,
            })
            .accounts({
              aggregator: aggregatorKeypair.publicKey,
              authority: payerKeypair.publicKey,
              job: jobAccount.publicKey,
            })
            .instruction();
        })
      ))
    );

    const createAccountSignatures = packAndSend(
      this.program,
      createAccountInstructions,
      finalInstructions,
      createAccountSigners,
      payerKeypair.publicKey
    );

    let aggInitWs: number;
    const aggInitPromise = new Promise((resolve: (result: boolean) => void) => {
      aggInitWs = this.program.provider.connection.onAccountChange(
        aggregatorAccount.publicKey,
        (accountInfo: AccountInfo<Buffer>, slot) => {
          try {
            if (aggInitWs) {
              this.program.provider.connection.removeAccountChangeListener(
                aggInitWs
              );
            }
          } catch {}
          resolve(true);
        }
      );
    });

    const awaitResult = await promiseWithTimeout(20_000, aggInitPromise).catch(
      (error) => {
        try {
          if (aggInitWs) {
            this.program.provider.connection.removeAccountChangeListener(
              aggInitWs
            );
          }
        } catch {}
        throw error;
      }
    );

    if (this.silent) {
      console.log(aggregatorAccount.publicKey.toString());
      return;
    }

    await sleep(1000); // give lease time to finish
    this.logger.info(
      await prettyPrintAggregator(
        aggregatorAccount,
        undefined,
        true,
        true,
        true
      )
    );
  }

  async catch(error) {
    super.catch(error, "Failed to copy aggregator account to new queue");
  }
}

async function packAndSend(
  program: anchor.Program,
  ixnsBatch: (TransactionInstruction | TransactionInstruction[])[],
  ixnsBatch2: (TransactionInstruction | TransactionInstruction[])[],
  signers: Keypair[],
  feePayer: PublicKey
): Promise<TransactionSignature[]> {
  const signatures: Promise<TransactionSignature>[] = [];
  const { blockhash } = await program.provider.connection.getLatestBlockhash();

  const packedTransactions = packInstructions(ixnsBatch, feePayer, blockhash);
  const signedTransactions = signTransactions(packedTransactions, signers);
  const signedTxs = await (
    program.provider as anchor.AnchorProvider
  ).wallet.signAllTransactions(signedTransactions);

  for (let k = 0; k < packedTransactions.length; k += 1) {
    const tx = signedTxs[k];
    const rawTx = tx.serialize();
    signatures.push(
      program.provider.connection.sendRawTransaction(rawTx, {
        skipPreflight: true,
        maxRetries: 10,
      })
    );
  }

  await Promise.all(signatures);

  const packedTransactions2 = packInstructions(ixnsBatch2, feePayer, blockhash);
  const signedTransactions2 = signTransactions(packedTransactions2, signers);
  const signedTxs2 = await (
    program.provider as anchor.AnchorProvider
  ).wallet.signAllTransactions(signedTransactions2);

  for (let k = 0; k < packedTransactions2.length; k += 1) {
    const tx = signedTxs2[k];
    const rawTx = tx.serialize();
    signatures.push(
      program.provider.connection.sendRawTransaction(rawTx, {
        skipPreflight: true,
        maxRetries: 10,
      })
    );
  }

  return Promise.all(signatures);
}
