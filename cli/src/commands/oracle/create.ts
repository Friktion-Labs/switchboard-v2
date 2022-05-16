import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import * as spl from "@solana/spl-token";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import {
  chalkString,
  prettyPrintOracle,
  programWallet,
} from "@switchboard-xyz/sbv2-utils";
import {
  OracleAccount,
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, loadKeypair, verifyProgramHasPayer } from "../../utils";

export default class OracleCreate extends BaseCommand {
  static description = "create a new oracle account for a given queue";

  static flags = {
    ...BaseCommand.flags,
    name: flags.string({
      char: "n",
      description: "name of the oracle for easier identification",
      default: "",
    }),
    authority: flags.string({
      char: "a",
      description:
        "keypair to delegate authority to for managing the oracle account",
    }),
    enable: flags.boolean({
      description: "enable oracle heartbeat permissions",
    }),
    queueAuthority: flags.string({
      description: "alternative keypair to use for queue authority",
    }),
  };

  static args = [
    {
      name: "queueKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle queue to join",
    },
  ];

  static examples = [
    "$ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-and-authority-keypair.json",
    "$ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --name=oracle-1  --keypair ../payer-and-authority-keypair.json",
    "$ sbv2 oracle:create GhYg3R1V6DmJbwuc57qZeoYG6gUuvCotUF1zU3WCj98U --keypair ../payer-keypair.json --authority ../oracle-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(OracleCreate);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);

    const authorityKeypair = await this.loadAuthority(flags.authority);
    const queueAuthority: Keypair = flags.queueAuthority
      ? await loadKeypair(flags.queueAuthority)
      : payerKeypair;

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: args.queueKey,
    });
    const queue = await queueAccount.loadData();
    const tokenMint = await queueAccount.loadMint();

    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );

    const tokenWalletKeypair = anchor.web3.Keypair.generate();
    const [oracleAccount, oracleBump] = OracleAccount.fromSeed(
      this.program,
      queueAccount,
      tokenWalletKeypair.publicKey
    );

    this.logger.debug(chalkString("Oracle", oracleAccount.publicKey));

    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      authorityKeypair.publicKey,
      queueAccount.publicKey,
      oracleAccount.publicKey
    );
    this.logger.debug(chalkString(`Permission`, permissionAccount.publicKey));

    const createOracleTxn = new Transaction();
    createOracleTxn.add(
      SystemProgram.createAccount({
        fromPubkey: payerKeypair.publicKey,
        newAccountPubkey: tokenWalletKeypair.publicKey,
        lamports:
          await this.program.provider.connection.getMinimumBalanceForRentExemption(
            spl.AccountLayout.span
          ),
        space: spl.AccountLayout.span,
        programId: spl.TOKEN_PROGRAM_ID,
      }),
      spl.Token.createInitAccountInstruction(
        spl.TOKEN_PROGRAM_ID,
        tokenMint.publicKey,
        tokenWalletKeypair.publicKey,
        programStateAccount.publicKey
      ),
      await this.program.methods
        .oracleInit({
          name: Buffer.from(flags.name ?? "").slice(0, 32),
          metadata: Buffer.from("").slice(0, 128),
          stateBump,
          oracleBump,
        })
        .accounts({
          oracle: oracleAccount.publicKey,
          oracleAuthority: authorityKeypair.publicKey,
          queue: queueAccount.publicKey,
          wallet: tokenWalletKeypair.publicKey,
          programState: programStateAccount.publicKey,
          systemProgram: SystemProgram.programId,
          payer: payerKeypair.publicKey,
        })
        .instruction(),
      await this.program.methods
        .permissionInit({})
        .accounts({
          permission: permissionAccount.publicKey,
          authority: authorityKeypair.publicKey,
          granter: queueAccount.publicKey,
          grantee: oracleAccount.publicKey,
          payer: payerKeypair.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
    );

    if (flags.enable) {
      if (!queueAuthority.publicKey.equals(queue.authority)) {
        throw new Error(
          `Invalid queue authority, received ${queueAuthority.publicKey}, expected ${queue.authority}`
        );
      }
      createOracleTxn.add(
        await this.program.methods
          .permissionSet({
            permission: { permitOracleHeartbeat: null },
            enable: true,
          })
          .accounts({
            permission: permissionAccount.publicKey,
            authority: queue.authority,
          })
          .instruction()
      );
    }

    const signature = await this.program.provider.sendAndConfirm(
      createOracleTxn,
      [payerKeypair, authorityKeypair, tokenWalletKeypair]
    );
    const oracleData = await oracleAccount.loadData();

    if (this.silent) {
      console.log(oracleAccount.publicKey.toString());
      return;
    }
    this.logger.log(
      `${chalk.green(`${CHECK_ICON}Oracle account created successfully`)}`
    );
    this.logger.info(await prettyPrintOracle(oracleAccount, oracleData, true));
  }

  async catch(error) {
    super.catch(error, "failed to create oracle account");
  }
}
