import { flags } from "@oclif/command";
import * as spl from "@solana/spl-token";
import { PublicKey, SYSVAR_RECENT_BLOCKHASHES_PUBKEY } from "@solana/web3.js";
import {
  OracleQueueAccount,
  PermissionAccount,
  ProgramStateAccount,
  programWallet,
  VrfAccount,
} from "@switchboard-xyz/switchboard-v2";
import BaseCommand from "../../BaseCommand";
import { loadKeypair, sleep, verifyProgramHasPayer } from "../../utils";

export default class VrfRequest extends BaseCommand {
  static description = "request a new value for a VRF";

  static examples = [
    'sbv2 vrf:create 9WZ59yz95bd3XwJxDPVE2PjvVWmSy9WM1NgGD2Hqsohw --keypair ../payer-keypair.json -v --enable --queueAuthority queue-authority-keypair.json --callbackPid 6MLk7G54uHZ7JuzNxpBAVENANrgM9BZ51pKkzGwPYBCE --ixData "[145,72,9,94,61,97,126,106]" -a "{"pubkey": "HpQoFL5kxPp2JCFvjsVTvBd7navx4THLefUU68SXAyd6","isSigner": false,"isWritable": true}" -a "{"pubkey": "8VdBtS8ufkXMCa6Yr9E4KVCfX2inVZVwU4KGg2CL1q7P","isSigner": false,"isWritable": false}"',
  ];

  static flags = {
    ...BaseCommand.flags,
    funderAuthority: flags.string({
      description: "alternative keypair to pay for VRF request",
    }),
    authority: flags.string({
      description: "alternative keypair that is the VRF authority",
    }),
  };

  static args = [
    {
      name: "vrfKey",
      required: true,
      parse: (pubkey: string) => new PublicKey(pubkey),
      description: "public key of the VRF account to request randomness for",
    },
  ];

  async run() {
    const { args, flags } = this.parse(VrfRequest);
    verifyProgramHasPayer(this.program);
    const payerKeypair = programWallet(this.program);

    const vrfAccount = new VrfAccount({
      program: this.program,
      publicKey: args.vrfKey,
    });
    const vrf = await vrfAccount.loadData();
    const queueAccount = new OracleQueueAccount({
      program: this.program,
      publicKey: vrf.oracleQueue,
    });
    const queue = await queueAccount.loadData();
    const tokenMint = await queueAccount.loadMint();
    const [programStateAccount, stateBump] = ProgramStateAccount.fromSeed(
      this.program
    );
    const [permissionAccount, permissionBump] = PermissionAccount.fromSeed(
      this.program,
      queue.authority,
      queueAccount.publicKey,
      vrfAccount.publicKey
    );

    const authority = await this.loadAuthority(flags.authority, vrf.authority);
    const funderAuthority = flags.funderAuthority
      ? await loadKeypair(flags.funderAuthority)
      : payerKeypair;

    const funderTokenWallet = (
      await tokenMint.getOrCreateAssociatedAccountInfo(
        funderAuthority.publicKey
      )
    ).address;

    // const signature = await vrfAccount.requestRandomness({
    //   authority,
    //   payerAuthority: funderAuthority,
    //   payer: funderTokenWallet,
    // });

    const signature = await this.program.methods
      .vrfRequestRandomness({
        stateBump,
        permissionBump,
      })
      .accounts({
        authority: authority.publicKey,
        vrf: vrfAccount.publicKey,
        oracleQueue: queueAccount.publicKey,
        queueAuthority: queue.authority,
        dataBuffer: queue.dataBuffer,
        permission: permissionAccount.publicKey,
        escrow: vrf.escrow,
        payerWallet: funderTokenWallet,
        payerAuthority: funderAuthority.publicKey,
        recentBlockhashes: SYSVAR_RECENT_BLOCKHASHES_PUBKEY,
        programState: programStateAccount.publicKey,
        tokenProgram: spl.TOKEN_PROGRAM_ID,
      })
      .signers([authority, funderAuthority])
      .rpc();

    if (this.silent) {
      console.log(signature);
      return;
    }

    await sleep(1000);

    this.logger.log(
      `https://explorer.solana.com/tx/${signature}?cluster=${this.cluster}`
    );
  }
}
