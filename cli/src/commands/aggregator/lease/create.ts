import { flags } from "@oclif/command";
import * as anchor from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { prettyPrintLease } from "@switchboard-xyz/sbv2-utils";
import {
  AggregatorAccount,
  LeaseAccount,
  OracleQueueAccount,
  programWallet,
} from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../../BaseCommand";
import { CHECK_ICON, verifyProgramHasPayer } from "../../../utils";

export default class AggregatorLeaseCreate extends BaseCommand {
  static description = "fund and re-enable an aggregator lease";

  static flags = {
    ...BaseCommand.flags,
    amount: flags.string({
      required: false,
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
    "$ sbv2 aggregator:lease:create GvDMxPzN1sCj7L26YDK2HnMRXEQmQ2aemov8YBtPS7vR --amount 1.5 --keypair ../payer-keypair.json",
  ];

  async run() {
    const { args, flags } = this.parse(AggregatorLeaseCreate);
    verifyProgramHasPayer(this.program);

    const payer = programWallet(this.program);

    // verify and normalize load amount
    let loadAmount = new anchor.BN(0);
    if (flags.amount) {
      loadAmount = this.getTokenAmount(flags.amount);
    }
    if (loadAmount.lt(new anchor.BN(0))) {
      throw new Error("amount to deposit must be greater than or equal to 0");
    }

    const aggregatorAccount = new AggregatorAccount({
      program: this.program,
      publicKey: args.aggregatorKey,
    });
    const aggregator = await aggregatorAccount.loadData();

    const oracleQueueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: aggregator.queuePubkey,
    });
    const mint = await oracleQueueAccount.loadMint();

    // check funder has enough balance for the request
    const funder = (
      await mint.getOrCreateAssociatedAccountInfo(payer.publicKey)
    ).address;
    const funderBalanceResponse =
      await this.program.provider.connection.getTokenAccountBalance(funder);
    const funderBalance = new anchor.BN(funderBalanceResponse.value.amount);
    if (loadAmount.gt(funderBalance)) {
      throw new Error(
        `not enough token balance to load lease\nLoadAmount: ${loadAmount.toString()}\nBalance: ${funderBalance.toString()}`
      );
    }

    // verify lease account doesnt already exist
    let [leaseAccount] = LeaseAccount.fromSeed(
      this.program,
      oracleQueueAccount,
      aggregatorAccount
    );
    try {
      const least = await leaseAccount.loadData();
      throw new Error("lease account already exists");
    } catch (error) {
      if (error.message === "lease account already exists") {
        throw error;
      }
    }

    // create lease account
    leaseAccount = await LeaseAccount.create(this.program, {
      aggregatorAccount,
      oracleQueueAccount,
      funderAuthority: payer,
      withdrawAuthority: payer.publicKey,
      funder,
      loadAmount,
    });

    if (this.silent) {
      console.log(leaseAccount.publicKey.toString());
    } else {
      this.logger.log(
        `${chalk.green(`${CHECK_ICON}Lease Account created successfully`)}`
      );
      this.logger.log(await prettyPrintLease(leaseAccount));
    }
  }

  async catch(error) {
    super.catch(error, "failed to create a lease account");
  }
}
