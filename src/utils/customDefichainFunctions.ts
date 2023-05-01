import { env } from "./customEnvironmentVariablesDefichain";
import fetch from "node-fetch";
import * as bitcoin from "bitcoinjs-lib";
import * as sts from "satoshi-bitcoin-ts";
import { loadContract } from "../hooks/customContractLoader";
import { useWeb3Context } from "../providers/Web3ContextProvider";
import { BigNumber, ethers, Bytes } from "ethers";
import { IDefichainMinter__factory } from "../typechain/typechain/factories/IDefichainMinter__factory";
export class Blame {
  fail_reason?: string;
}

export class DepositMessage {
  status?: number;
  result?: string;
  extra?: string;
  blame?: Blame;
}

export class Vout {
  txid?: string;
  n?: number;
  value?: string;
  value_satoshi?: number;
}

export class TxOutWhaleScript {
  type?: string;
  hex?: string;
}
export class TxOutWhale {
  id?: string;
  txid?: string;
  n?: number;
  value?: string;
  tokenId?: number;
  script?: TxOutWhaleScript;
}

export class TxOutsWhale {
  data?: TxOutWhale[];
}

export class DepositEntry {
  vout?: Vout;
  current_height?: number;
  tx_height?: number;
  confirmations?: number;
  good?: boolean;
  good_buffer?: boolean;
  destTxHash?: string;
}

export class Data {
  data?: DepositEntry[];
}

export class DepositsMessage {
  status?: number;
  result?: Data;
  extra?: string;
  blame?: Blame;
}
export class Log {
  From?: string;
  To?: string;
  Bridge?: string;
  Value?: number;
  Extradata?: number;
}
export class LogsMessage {
  Confirmations?: number;
  Executed?: boolean;
  Log?: Log;
  DefiTx?: string;
  status?: number;
  blame?: Blame;
}

export class Signature {
  signed_msg?: string;
  r?: string;
  s?: string;
  recovery_id?: string;
}

export class SignatureMessage {
  status?: number;
  signatures?: Signature[];
  blame?: Blame;
}

var defichain = {
  bip32: {
    public: 0x0488b21e,
    private: 0x0488ade4,
  },
  messagePrefix: "Defichain Signed Message:\n",
  pubKeyHash: 0x12,
  scriptHash: 0x51,
  wif: 0x80,
} as bitcoin.networks.Network;

export const pkshToAddress = (scriptPubKey: string) => {
  var address = bitcoin.address.fromOutputScript(
    Buffer.from(scriptPubKey, "hex"),
    defichain
  );
  return address;
};

export const strToSatoshi = (val: string) => {
  return sts.toSatoshi(val);
};

export const getTransactionN = (address: string, txid: string) => {
  return new Promise(async (resolve, reject) => {
    const objTx = await getTxOutsWhale(txid);
    console.log(objTx);
    if ((objTx?.data?.length || 0) === 0) {
      reject("This TxID is not known on the Defichain blockchain");
    }
    objTx?.data?.forEach((element) => {
      if ((element?.script?.type || "") === "pubkeyhash") {
        let recoveredAddress = pkshToAddress(element?.script?.hex || "");
        console.log(
          recoveredAddress.toLowerCase(),
          "==",
          address.toLowerCase()
        );
        if (recoveredAddress.toLowerCase() === address.toLowerCase()) {
          var vt: VoutViktor = { n: element?.n, satoshi: element?.value };
          resolve(vt);
        }
      }
    });

    reject("This transaction does not pay into your deposit address");
  });
};

export const buildUrl = (destChain: string) => {
  if (destChain === "ethereum") return env.ETHEREUM_BACKEND_ENDPOINT;
  else return env.BSC_BACKEND_ENDPOINT;
};
export const getDepositAddress = async (
  userAddress: string,
  destChain: string
) => {
  let url = buildUrl(destChain) + "/deposit/" + userAddress;
  let settings = { method: "Get" };

  return fetch(url, settings).then((res) => res.json() as DepositMessage);
};

export type VoutViktor = {
  n?: number;
  satoshi?: string;
};

export const getTxOutsWhale = async (txid: string) => {
  let url =
    "https://ocean.defichain.com/v0/mainnet/transactions/" + txid + "/vouts";
  let settings = { method: "Get" };

  return fetch(url, settings).then((res) => res.json() as TxOutsWhale);
};

export const getDeposits = async (userAddress: string, destChain: string) => {
  let url = buildUrl(destChain) + "/eligible/" + userAddress;
  let settings = { method: "Get" };
  return fetch(url, settings).then((res) => res.json() as DepositsMessage);
};

export const getKeySignatures = async (
  userAddress: string,
  txid: string,
  n: number,
  destChain: string
) => {
  let url = buildUrl(destChain) + "/mint/" + userAddress + "/" + txid + "/" + n;
  console.log(url);
  let settings = { method: "Get" };
  return fetch(url, settings).then((res) => res.json() as SignatureMessage);
};

export const getLogs = async (txid: string, destChain: string) => {
  let url = buildUrl(destChain) + "/logs/" + txid;
  let settings = { method: "Get" };
  return fetch(url, settings).then((res) => res.json() as LogsMessage);
};

export const getSignatures = async (
  provider: ethers.providers.JsonRpcProvider | undefined,
  targetAddress: string,
  txid: string,
  n: number,
  amount: number,
  bridge: string,
  r: string,
  s: string,
  v: number
) => {
  if (provider === undefined) return;

  try {
    console.log(targetAddress, txid, n, amount, bridge.toUpperCase(), r, s, v);
    const miningInterface = IDefichainMinter__factory.connect(
      env.BSC_CONTRACT_ADDRESS,
      provider.getSigner()
    );
    const res = await miningInterface
      .mintToken(
        targetAddress,
        BigNumber.from("0x" + txid),
        BigNumber.from(n),
        BigNumber.from(amount),
        bridge,
        ethers.utils.hexZeroPad(BigNumber.from(r).toHexString(), 32),
        ethers.utils.hexZeroPad(BigNumber.from(s).toHexString(), 32),
        v
      )
      .then(async (x: ethers.ContractTransaction) => {
        return {
          err: null,
          result: null,
        };
      })
      .catch((err) => {
        return {
          err: {
            code: 2,
            message:
              "Transaction was either cancelled, rejected or already minted",
          },
          result: null,
        };
      });

    /*const signatures = await sendRedeemTxHook(
      account,
      web3,
      chain,
      targetAddress,
      txid,
      n,
      amount,
      bridge.toUpperCase(),
      r,
      s,
      v
    );*/
    return res;
  } catch (error) {
    return { err: { code: 3, message: error }, result: null };
  }

  return {
    err: { code: -1, message: "Something wrong went wrong :-(" },
    result: null,
  };
};
