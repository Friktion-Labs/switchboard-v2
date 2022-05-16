import {
  LAMPORTS_PER_SOL,
  NONCE_ACCOUNT_LENGTH,
  PublicKey,
} from "@solana/web3.js";
import {
  chalkString,
  getOracleNonceAccounts,
} from "@switchboard-xyz/sbv2-utils";
import { OracleAccount } from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../../BaseCommand";

export default class OracleNonce extends BaseCommand {
  static description = "view an oracles nonce accounts";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "oracleKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the oracle to check token balance",
    },
  ];

  async run() {
    const { args } = this.parse(OracleNonce);

    const oracleAccount = new OracleAccount({
      program: this.program,
      publicKey: args.oracleKey,
    });
    const oracleNonceAccounts = await getOracleNonceAccounts(oracleAccount);
    console.log(
      chalkString(
        "Heartbeat Nonce",
        oracleNonceAccounts?.heartbeatNonce ?? "",
        20
      )
    );
    console.log(
      chalkString(
        "Unwrap Stake Nonce",
        oracleNonceAccounts?.unwrapStakeNonce ?? "",
        20
      )
    );
    console.log(
      chalkString(
        "Nonce Queue Size",
        oracleNonceAccounts.queueNonces.length,
        20
      )
    );

    let numNonces = 0;
    if (oracleNonceAccounts?.heartbeatNonce) {
      numNonces++;
    }
    if (oracleNonceAccounts?.unwrapStakeNonce) {
      numNonces++;
    }
    numNonces += oracleNonceAccounts.queueNonces.length;

    const nonceRentExemption =
      await this.program.provider.connection.getMinimumBalanceForRentExemption(
        NONCE_ACCOUNT_LENGTH
      );

    const totalCost = (numNonces * nonceRentExemption) / LAMPORTS_PER_SOL;

    console.log(chalkString("Total Cost (SOL)", totalCost, 20));
    // if (this.silent) {
    //   console.log(balance.value.amount);
    // } else {
    //   this.logger.log(
    //     chalkString(
    //       "Oracle Balance:",
    //       `${balance.value.uiAmountString} (${balance.value.amount})`,
    //       12
    //     )
    //   );
    // }
  }

  async catch(error) {
    super.catch(error, "failed to get oracle token balance");
  }
}
