import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { prettyPrintVrf } from "@switchboard-xyz/sbv2-utils";
import {
  Callback,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../../BaseCommand";
import { loadKeypair, sleep, verifyProgramHasPayer } from "../../../utils";

export default class VrfCreateExample extends BaseCommand {
  static description = "rand";

  static flags = {
    ...BaseCommand.flags,
    vrfPid: flags.string({
      description: "program ID for the VRF example program",
      required: true,
    }),
    vrfKeypair: flags.string({
      description: "filesystem path of existing keypair to use for VRF Account",
    }),
    enable: flags.boolean({
      description: "enable vrf permissions",
    }),
    queueAuthority: flags.string({
      description: "alternative keypair to use for queue authority",
    }),
    maxResult: flags.string({
      description: "the maximum VRF result",
      default: "256000",
    }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue to create VRF account for",
    },
  ];

  async run() {
    const { args, flags } = this.parse(VrfCreateExample);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);
    this.mainnetCheck();

    // load VRF params
    const vrfSecret = flags.vrfKeypair
      ? await loadKeypair(flags.vrfKeypair)
      : anchor.web3.Keypair.generate();
    const queueAuthority: Keypair = flags.queueAuthority
      ? await loadKeypair(flags.queueAuthority)
      : payerKeypair;

    // load VRF client program
    const vrfProgramId = new PublicKey(flags.vrfPid);
    const vrfExampleIdl = await anchor.Program.fetchIdl(
      vrfProgramId,
      this.program.provider
    );
    if (!vrfExampleIdl) {
      throw new Error(
        `failed to read VRF Example program idl for ${this.cluster} ${vrfProgramId}`
      );
    }
    const vrfclientProgram = new anchor.Program(
      vrfExampleIdl,
      vrfProgramId,
      this.program.provider
    );

    // load client for callback
    const ixCoder = new anchor.BorshInstructionCoder(vrfclientProgram.idl);
    const [clientPubkey, clientBump] =
      anchor.utils.publicKey.findProgramAddressSync(
        [
          Buffer.from("STATE"),
          vrfSecret.publicKey.toBytes(),
          payerKeypair.publicKey.toBytes(),
        ],
        vrfclientProgram.programId
      );
    const callback: Callback = {
      programId: vrfclientProgram.programId,
      accounts: [
        // ensure all accounts in updateResult are populated
        { pubkey: clientPubkey, isSigner: false, isWritable: true },
        { pubkey: vrfSecret.publicKey, isSigner: false, isWritable: false },
      ],
      ixData: ixCoder.encode("updateResult", ""), // pass any params for instruction here
    };

    // load Switchboard accounts
    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });
    const queue = await queueAccount.loadData();
    const tokenMint = await queueAccount.loadMint();
    const vrfEscrowPubkey = await spl.Token.getAssociatedTokenAddress(
      tokenMint.associatedProgramId,
      tokenMint.programId,
      tokenMint.publicKey,
      vrfSecret.publicKey,
      true
    );
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      vrfSecret.publicKey
    );

    // create account txns
    const createTxn = new Transaction();
    createTxn.add(
      spl.Token.createAssociatedTokenAccountInstruction(
        spl.ASSOCIATED_TOKEN_PROGRAM_ID,
        spl.TOKEN_PROGRAM_ID,
        tokenMint.publicKey,
        vrfEscrowPubkey,
        vrfSecret.publicKey,
        payerKeypair.publicKey
      ),
      spl.Token.createSetAuthorityInstruction(
        spl.TOKEN_PROGRAM_ID,
        vrfEscrowPubkey,
        programStateAccount.publicKey,
        "AccountOwner",
        vrfSecret.publicKey,
        [payerKeypair, vrfSecret]
      ),
      SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: vrfSecret.publicKey,
        space: this.program.account.vrfAccountData.size,
        lamports:
          await this.program.provider.connection.getMinimumBalanceForRentExemption(
            this.program.account.vrfAccountData.size
          ),
        programId: this.program.programId,
      }),
      await this.program.methods
        .vrfInit({
          stateBump,
          callback,
        })
        .accounts({
          vrf: vrfSecret.publicKey,
          escrow: vrfEscrowPubkey,
          authority: clientPubkey,
          oracleQueue: queueAccount.publicKey,
          programState: programStateAccount.publicKey,
          tokenProgram: spl.TOKEN_PROGRAM_ID,
        })
        .instruction(),
      await this.program.methods
        .permissionInit({})
        .accounts({
          permission: permissionAccount.publicKey,
          authority: queue.authority,
          granter: queueAccount.publicKey,
          grantee: vrfSecret.publicKey,
          payer: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );

    // if flag, enable permissions
    if (flags.enable) {
      if (!queueAuthority.publicKey.equals(queue.authority)) {
        throw new Error(
          `Invalid queue authority, received ${queueAuthority.publicKey}, expected ${queue.authority}`
        );
      }
      createTxn.add(
        await this.program.methods
          .permissionSet({
            permission: { permitVrfRequests: null },
            enable: true,
          })
          .accounts({
            permission: permissionAccount.publicKey,
            authority: queue.authority,
          })
          .instruction()
      );
    }

    // create client program account
    createTxn.add(
      await vrfclientProgram.methods
        .initState({
          maxResult: new anchor.BN(flags.maxResult),
        })
        .accounts({
          state: clientPubkey,
          vrf: vrfSecret.publicKey,
          payer: payerKeypair.publicKey,
          authority: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );

    // send transaction
    const signature = await this.program.provider.sendAndConfirm(
      createTxn,
      [payerKeypair, vrfSecret, queueAuthority],
      { commitment: "finalized" }
    );

    if (this.silent) {
      console.log(vrfSecret.publicKey.toString());
      return;
    }

    await sleep(2000);

    this.logger.log(
      `https://explorer.solana.com/tx/${signature}?cluster=${this.cluster}`
    );
    this.logger.log(
      await prettyPrintVrf(
        new VrfAccount({
          program: this.program,
          publicKey: vrfSecret.publicKey,
        }),
        undefined,
        true
      )
    );
  }
}
