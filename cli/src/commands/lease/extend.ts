import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import {
  AggregatorAccount,
  LeaseAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import { chalkString } from "../../accounts/utils";
import BaseCommand from "../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../utils";

export default class LeaseExtend extends BaseCommand {
  static description = "fund and re-enable an aggregator lease";

  static aliases = ["aggregator:lease:extend"];

  static flags = {
    ...BaseCommand.flags,
    amount: flags.string({
      required: true,
      description:
        "token amount to load into the lease escrow. If decimals provided, amount will be normalized to raw tokenAmount",
    }),
  };

  static args = [
    {
      name: "aggregatorKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the aggregator to extend a lease for",
    },
  ];

  static examples = [
    "$ sbv2 aggregator:lease:extend GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.1 --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(LeaseExtend);
    verifyProgramHasPayer(this.program);

    const payerKeypair = programWallet(this.program);

    let amount = this.getTokenAmount(flags.amount);
    if (amount.lte(new anchor.BN(0))) {
      throw new Error("amount to deposit must be greater than 0");
    }

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });
    const mint = await queueAccount.loadMint();

    const [leaseAccount] = LeaseAccount.fromSeed(
      this.program,
      queueAccount,
      aggregatorAccount
    );
    try {
      const lease = await leaseAccount.loadData();
    } catch {
      throw new Error(`Failed to load lease account. Has it been created yet?`);
    }
    const lease = await leaseAccount.loadData();
    const escrow: PublicKey = lease.escrow;

    const initialLeaseBalance =
      await this.program.provider.connection.getTokenAccountBalance(escrow);

    const funderTokenAccount = (
      await mint.getOrCreateAssociatedAccountInfo(payerKeypair.publicKey)
    ).address;
    const initialFunderBalance =
      await this.program.provider.connection.getTokenAccountBalance(
        funderTokenAccount
      );

    if (!this.silent) {
      this.logger.log(
        chalkString(
          "Initial Lease Balance",
          initialLeaseBalance.value.uiAmountString,
          24
        )
      );
      this.logger.log(
        chalkString(
          "Initial Funder Balance",
          initialFunderBalance.value.uiAmountString,
          24
        )
      );
    }

    const txn = await leaseAccount.extend({
      loadAmount: amount,
      funder: funderTokenAccount,
      funderAuthority: payerKeypair,
    });

    if (!this.silent) {
      const newBalance =
        await this.program.provider.connection.getTokenAccountBalance(escrow);
      this.logger.log(
        chalkString("Final Lease Balance", newBalance.value.uiAmountString, 24)
      );
    }

    if (this.silent) {
      console.log(txn);
    } else {
      this.logger.log(
        `${chalk.green(
          `${CHECK_ICON} Deposited ${amount} tokens into aggregator lease`
        )}`
      );
      this.logger.log(
        `https://explorer.solana.com/tx/${txn}?cluster=${this.cluster}`
      );
    }
  }

  async catch(error) {
    super.catch(error, "failed to deposit into aggregator lease account");
  }
}
