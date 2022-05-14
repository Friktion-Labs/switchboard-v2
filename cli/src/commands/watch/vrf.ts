import * as anchor from "@project-serum/anchor";
import { AccountInfo, Context, PublicKey } from "@solana/web3.js";
import { chalkString } from "@switchboard-xyz/sbv2-utils";
import { VrfAccount } from "@switchboard-xyz/switchboard-v2";
import chalk from "chalk";
import BaseCommand from "../../BaseCommand";

export default class WatchVrf extends BaseCommand {
  static description = "watch a vrf for a new value";

  static flags = {
    ...BaseCommand.flags,
  };

  static args = [
    {
      name: "vrfKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the vrf account to deserialize",
    },
  ];

  static aliases = ["vrf:watch"];

  static examples = [
    "$ sbv2 vrf:aggregator J7j9xX8JP2B2ErvUzuqGAKBGeggsxPyFXj5MqZcYDxfa",
  ];

  async run() {
    const { args } = this.parse(WatchVrf);

    const vrfAccount = new VrfAccount({
      program: this.program,
      publicKey: args.vrfKey,
    });
    const vrfData = await vrfAccount.loadData();

    this.logger.log(
      chalk.underline(chalkString(`## VRF`, vrfAccount.publicKey, 24) + "\r\n")
    );
    printVrf(vrfData);

    const accountCoder = new anchor.BorshAccountsCoder(this.program.idl);

    const watchWs = this.program.provider.connection.onAccountChange(
      vrfAccount.publicKey,
      (accountInfo: AccountInfo<Buffer>, context: Context) => {
        const vrf = accountCoder.decode("VrfAccountData", accountInfo.data);
        printVrf(vrf);
      }
    );
  }

  async catch(error) {
    super.catch(error, "failed to watch aggregator");
  }
}

function printVrf(vrf: any) {
  const counter: anchor.BN = vrf.counter;
  const result: Uint8Array = Uint8Array.from(vrf.currentRound.result);
  process.stdout.moveCursor(0, -1); // up one line
  process.stdout.clearLine(1); // from cursor to end
  process.stdout.write(
    `${chalk.green("#", counter.toString().padEnd(3, " "))}: ${chalk.blue(
      "["
    )}${chalk.yellow(result.toString())}${chalk.blue("]")}\n`
  );
}
