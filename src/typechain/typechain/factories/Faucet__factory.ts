/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Faucet, FaucetInterface } from "../Faucet";

const _abi = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_asset",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "drainToken",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "tokens",
        type: "address[]",
      },
    ],
    name: "drip",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "lastDripBlk",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minDripBlkInterval",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_interval",
        type: "uint256",
      },
    ],
    name: "setMinDripBlkInterval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061001a3361001f565b61006f565b600080546001600160a01b038381166001600160a01b0319831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b610ac58061007e6000396000f3fe608060405234801561001057600080fd5b50600436106100885760003560e01c8063715018a61161005b578063715018a6146100f15780638da5cb5b146100f95780639d4323be14610114578063f2fde38b1461012757600080fd5b80631e53f2881461008d578063428dc451146100a25780634f1aa211146100b55780635553e679146100d1575b600080fd5b6100a061009b366004610866565b61013a565b005b6100a06100b036600461087f565b61019e565b6100be60015481565b6040519081526020015b60405180910390f35b6100be6100df366004610910565b60026020526000908152604090205481565b6100a0610359565b6000546040516001600160a01b0390911681526020016100c8565b6100a061012236600461092b565b6103bf565b6100a0610135366004610910565b610431565b6000546001600160a01b031633146101995760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e657260448201526064015b60405180910390fd5b600155565b600154336000908152600260205260409020546101bb904361096b565b10156102095760405162461bcd60e51b815260206004820152600c60248201527f746f6f206672657175656e7400000000000000000000000000000000000000006044820152606401610190565b60005b8181101561034257600083838381811061022857610228610982565b905060200201602081019061023d9190610910565b6040516370a0823160e01b81523060048201529091506000906001600160a01b038316906370a082319060240160206040518083038186803b15801561028257600080fd5b505afa158015610296573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906102ba9190610998565b90506000811161030c5760405162461bcd60e51b815260206004820152600f60248201527f46617563657420697320656d70747900000000000000000000000000000000006044820152606401610190565b61032d3361031c612710846109b1565b6001600160a01b0385169190610513565b5050808061033a906109d3565b91505061020c565b505033600090815260026020526040902043905550565b6000546001600160a01b031633146103b35760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610190565b6103bd600061057f565b565b6000546001600160a01b031633146104195760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610190565b61042d6001600160a01b0383163383610513565b5050565b6000546001600160a01b0316331461048b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e65726044820152606401610190565b6001600160a01b0381166105075760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f64647265737300000000000000000000000000000000000000000000000000006064820152608401610190565b6105108161057f565b50565b604080516001600160a01b038416602482015260448082018490528251808303909101815260649091019091526020810180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff1663a9059cbb60e01b17905261057a9084906105e7565b505050565b600080546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681178455604051919092169283917f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e09190a35050565b600061063c826040518060400160405280602081526020017f5361666545524332303a206c6f772d6c6576656c2063616c6c206661696c6564815250856001600160a01b03166106cc9092919063ffffffff16565b80519091501561057a578080602001905181019061065a91906109ee565b61057a5760405162461bcd60e51b815260206004820152602a60248201527f5361666545524332303a204552433230206f7065726174696f6e20646964206e60448201527f6f742073756363656564000000000000000000000000000000000000000000006064820152608401610190565b60606106db84846000856106e5565b90505b9392505050565b60608247101561075d5760405162461bcd60e51b815260206004820152602660248201527f416464726573733a20696e73756666696369656e742062616c616e636520666f60448201527f722063616c6c00000000000000000000000000000000000000000000000000006064820152608401610190565b6001600160a01b0385163b6107b45760405162461bcd60e51b815260206004820152601d60248201527f416464726573733a2063616c6c20746f206e6f6e2d636f6e74726163740000006044820152606401610190565b600080866001600160a01b031685876040516107d09190610a40565b60006040518083038185875af1925050503d806000811461080d576040519150601f19603f3d011682016040523d82523d6000602084013e610812565b606091505b509150915061082282828661082d565b979650505050505050565b6060831561083c5750816106de565b82511561084c5782518084602001fd5b8160405162461bcd60e51b81526004016101909190610a5c565b60006020828403121561087857600080fd5b5035919050565b6000806020838503121561089257600080fd5b823567ffffffffffffffff808211156108aa57600080fd5b818501915085601f8301126108be57600080fd5b8135818111156108cd57600080fd5b8660208260051b85010111156108e257600080fd5b60209290920196919550909350505050565b80356001600160a01b038116811461090b57600080fd5b919050565b60006020828403121561092257600080fd5b6106de826108f4565b6000806040838503121561093e57600080fd5b610947836108f4565b946020939093013593505050565b634e487b7160e01b600052601160045260246000fd5b60008282101561097d5761097d610955565b500390565b634e487b7160e01b600052603260045260246000fd5b6000602082840312156109aa57600080fd5b5051919050565b6000826109ce57634e487b7160e01b600052601260045260246000fd5b500490565b60006000198214156109e7576109e7610955565b5060010190565b600060208284031215610a0057600080fd5b815180151581146106de57600080fd5b60005b83811015610a2b578181015183820152602001610a13565b83811115610a3a576000848401525b50505050565b60008251610a52818460208701610a10565b9190910192915050565b6020815260008251806020840152610a7b816040850160208701610a10565b601f01601f1916919091016040019291505056fea2646970667358221220961e434a8d4df5bef10c0d4d0cb7ca18623ac215d4ee4c786055287f1b01582764736f6c63430008090033";

type FaucetConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (xs: FaucetConstructorParams): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Faucet__factory extends ContractFactory {
  constructor(...args: FaucetConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Faucet";
  }

  deploy(overrides?: Overrides & { from?: string | Promise<string> }): Promise<Faucet> {
    return super.deploy(overrides || {}) as Promise<Faucet>;
  }
  getDeployTransaction(overrides?: Overrides & { from?: string | Promise<string> }): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Faucet {
    return super.attach(address) as Faucet;
  }
  connect(signer: Signer): Faucet__factory {
    return super.connect(signer) as Faucet__factory;
  }
  static readonly contractName: "Faucet";
  public readonly contractName: "Faucet";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FaucetInterface {
    return new utils.Interface(_abi) as FaucetInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): Faucet {
    return new Contract(address, _abi, signerOrProvider) as Faucet;
  }
}