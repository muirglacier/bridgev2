import { env } from "./customEnvironmentVariablesDefichain";
import fetch from "node-fetch";
import * as bitcoin from "bitcoinjs-lib";
import * as sts from "satoshi-bitcoin-ts";

import { BigNumber, BigNumberish, ethers } from "ethers";
import { IDefichainMinter__factory } from "../typechain/typechain/factories/IDefichainMinter__factory";
import { bech32 } from "bech32";
import base58_to_binary from "./base58_to_binary";

import { createHash } from "sha256-uint8array";

const sha256 = (payload: Uint8Array) => createHash().update(payload).digest();

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

export enum Network {
  mainnet = "mainnet",
  testnet = "testnet",
  regtest = "regtest",
}

enum AddressType {
  p2pkh = "p2pkh",
  p2sh = "p2sh",
  p2wpkh = "p2wpkh",
  p2wsh = "p2wsh",
  p2tr = "p2tr",
}

type AddressInfo = {
  bech32: boolean;
  network: Network;
  address: string;
  type: AddressType;
};

const addressTypes: { [key: number]: { type: AddressType; network: Network } } =
  {
    0x12: {
      type: AddressType.p2pkh,
      network: Network.mainnet,
    },

    0x5a: {
      type: AddressType.p2sh,
      network: Network.mainnet,
    },
  };

const parseBech32 = (address: string): AddressInfo => {
  let decoded;

  try {
    //if (address.startsWith('bc1p') || address.startsWith('tb1p') || address.startsWith('bcrt1p')) {
    //  decoded = bech32m.decode(address);
    //} else {
    decoded = bech32.decode(address);
    //}
  } catch (error) {
    throw new Error("Invalid address");
  }

  const mapPrefixToNetwork: { [key: string]: Network } = {
    df: Network.mainnet,
    tb: Network.testnet,
    bcrt: Network.regtest,
  };

  const network: Network = mapPrefixToNetwork[decoded.prefix];

  if (network === undefined) {
    throw new Error("Invalid address");
  }

  const witnessVersion = decoded.words[0];

  if (witnessVersion < 0 || witnessVersion > 16) {
    throw new Error("Invalid address");
  }
  const data = bech32.fromWords(decoded.words.slice(1));

  let type;

  if (data.length === 20) {
    type = AddressType.p2wpkh;
  } else if (witnessVersion === 1) {
    type = AddressType.p2tr;
  } else {
    type = AddressType.p2wsh;
  }

  return {
    bech32: true,
    network,
    address,
    type,
  };
};
const getAddressInfo = (address: string): AddressInfo => {
  let decoded: Uint8Array;
  const prefix = address.substr(0, 2).toLowerCase();

  if (prefix === "df" || prefix === "tb") {
    return parseBech32(address);
  }

  try {
    decoded = base58_to_binary(address);
  } catch (error) {
    throw new Error("Invalid address");
  }

  const { length } = decoded;

  if (length !== 25) {
    throw new Error("Invalid address");
  }

  const version = decoded[0];

  const checksum = decoded.slice(length - 4, length);
  const body = decoded.slice(0, length - 4);

  const expectedChecksum = sha256(sha256(body)).slice(0, 4);

  if (
    checksum.some(
      (value: number, index: number) => value !== expectedChecksum[index]
    )
  ) {
    throw new Error("Invalid address");
  }

  const validVersions = Object.keys(addressTypes).map(Number);

  if (!validVersions.includes(version)) {
    throw new Error("Invalid address");
  }

  const addressType = addressTypes[version];

  return {
    ...addressType,
    address,
    bech32: false,
  };
};

export const validateDefiAddress = (address: string, network?: Network) => {
  try {
    const addressInfo = getAddressInfo(address);
    console.log(addressInfo);
    if (network) {
      return network === addressInfo.network;
    }

    return true;
  } catch (error) {
    return false;
  }
};
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
  let url =
    buildUrl(destChain) + "/v2mint/" + userAddress + "/" + txid + "/" + n;
  console.log(url);
  let settings = { method: "Get" };
  return fetch(url, settings).then((res) => res.json() as SignatureMessage);
};

export const getLogs = async (txid: string, destChain: string) => {
  let url = buildUrl(destChain) + "/v2logs/" + txid;
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
};

export const burnToken = async (
  provider: ethers.providers.JsonRpcProvider | undefined,
  targetAddress: string,
  amount: BigNumberish,
  bridge: string
) => {
  if (provider === undefined) return;

  try {
    console.log(targetAddress, amount, bridge.toUpperCase());
    const miningInterface = IDefichainMinter__factory.connect(
      env.BSC_CONTRACT_ADDRESS,
      provider.getSigner()
    );
    const res = await miningInterface
      .burnToken(targetAddress, bridge, amount)
      .then(async (x: ethers.ContractTransaction) => {
        if (x == null) {
          return {
            err: {
              code: 4,
              message: "This transaction is unknown",
            },
            result: null,
          };
        } else
          return {
            err: null,
            result: x,
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

    return res;
  } catch (error) {
    return { err: { code: 3, message: error }, result: null };
  }
};
