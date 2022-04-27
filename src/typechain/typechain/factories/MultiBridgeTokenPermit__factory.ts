/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { MultiBridgeTokenPermit, MultiBridgeTokenPermitInterface } from "../MultiBridgeTokenPermit";

const _abi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol_",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "decimals_",
        type: "uint8",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "address",
        name: "bridge",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "supplyCap",
        type: "uint256",
      },
    ],
    name: "BridgeSupplyCapUpdated",
    type: "event",
  },
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
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [],
    name: "DOMAIN_SEPARATOR",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
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
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "bridges",
    outputs: [
      {
        internalType: "uint256",
        name: "cap",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "total",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burn",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_from",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "burnFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "subtractedValue",
        type: "uint256",
      },
    ],
    name: "decreaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getOwner",
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
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "addedValue",
        type: "uint256",
      },
    ],
    name: "increaseAllowance",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "mint",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "nonces",
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
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "uint8",
        name: "v",
        type: "uint8",
      },
      {
        internalType: "bytes32",
        name: "r",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "s",
        type: "bytes32",
      },
    ],
    name: "permit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
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
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
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
  {
    inputs: [
      {
        internalType: "address",
        name: "_bridge",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_cap",
        type: "uint256",
      },
    ],
    name: "updateBridgeSupplyCap",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const _bytecode =
  "0x6101a06040527f6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9610140523480156200003757600080fd5b5060405162001c1238038062001c128339810160408190526200005a9162000329565b8282828580604051806040016040528060018152602001603160f81b8152508585816003908051906020019062000093929190620001b6565b508051620000a9906004906020840190620001b6565b5050825160209384012082519284019290922060e08390526101008190524660a0818152604080517f8b73c3c69bb8fe3d512ecc4cf759cc79239f7b179b0ffacaa9a75d522b39400f818901819052818301979097526060810194909452608080850193909352308483018190528151808603909301835260c09485019091528151919096012090529290925261012052506200014890503362000164565b60ff90811661016052929092166101805250620003eb92505050565b600680546001600160a01b038381166001600160a01b0319831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b828054620001c490620003ae565b90600052602060002090601f016020900481019282620001e8576000855562000233565b82601f106200020357805160ff191683800117855562000233565b8280016001018555821562000233579182015b828111156200023357825182559160200191906001019062000216565b506200024192915062000245565b5090565b5b8082111562000241576000815560010162000246565b634e487b7160e01b600052604160045260246000fd5b600082601f8301126200028457600080fd5b81516001600160401b0380821115620002a157620002a16200025c565b604051601f8301601f19908116603f01168101908282118183101715620002cc57620002cc6200025c565b81604052838152602092508683858801011115620002e957600080fd5b600091505b838210156200030d5785820183015181830184015290820190620002ee565b838211156200031f5760008385830101525b9695505050505050565b6000806000606084860312156200033f57600080fd5b83516001600160401b03808211156200035757600080fd5b620003658783880162000272565b945060208601519150808211156200037c57600080fd5b506200038b8682870162000272565b925050604084015160ff81168114620003a357600080fd5b809150509250925092565b600181811c90821680620003c357607f821691505b60208210811415620003e557634e487b7160e01b600052602260045260246000fd5b50919050565b60805160a05160c05160e05161010051610120516101405161016051610180516117b96200045960003960006101ff01526000505060006107f501526000610e3401526000610e8301526000610e5e01526000610db701526000610de101526000610e0b01526117b96000f3fe608060405234801561001057600080fd5b506004361061018d5760003560e01c806379cc6790116100e3578063a457c2d71161008c578063d505accf11610066578063d505accf14610369578063dd62ed3e1461037c578063f2fde38b146103b557600080fd5b8063a457c2d714610307578063a9059cbb1461031a578063ced67f0c1461032d57600080fd5b80638da5cb5b116100bd5780638da5cb5b146102ee57806395d89b41146102ff5780639dc29fac146102a857600080fd5b806379cc6790146102a85780637ecebe00146102bb578063893d20e8146102ce57600080fd5b80633644e5151161014557806342966c681161011f57806342966c68146102575780634ce2f71a1461026a57806370a082311461027f57600080fd5b80633644e51514610229578063395093511461023157806340c10f191461024457600080fd5b806318160ddd1161017657806318160ddd146101d357806323b872dd146101e5578063313ce567146101f857600080fd5b806306fdde0314610192578063095ea7b3146101b0575b600080fd5b61019a6103c8565b6040516101a79190611542565b60405180910390f35b6101c36101be3660046115b3565b61045a565b60405190151581526020016101a7565b6002545b6040519081526020016101a7565b6101c36101f33660046115dd565b610472565b60405160ff7f00000000000000000000000000000000000000000000000000000000000000001681526020016101a7565b6101d7610496565b6101c361023f3660046115b3565b6104a5565b6101c36102523660046115b3565b6104e4565b6101c3610265366004611619565b6105be565b61027d6102783660046115b3565b6105d2565b005b6101d761028d366004611632565b6001600160a01b031660009081526020819052604090205490565b6101c36102b63660046115b3565b610693565b6101d76102c9366004611632565b6106a6565b6102d66106c6565b6040516001600160a01b0390911681526020016101a7565b6006546001600160a01b03166102d6565b61019a6106da565b6101c36103153660046115b3565b6106e9565b6101c36103283660046115b3565b610793565b61035461033b366004611632565b6007602052600090815260409020805460019091015482565b604080519283526020830191909152016101a7565b61027d61037736600461164d565b6107a1565b6101d761038a3660046116c0565b6001600160a01b03918216600090815260016020908152604080832093909416825291909152205490565b61027d6103c3366004611632565b610905565b6060600380546103d7906116f3565b80601f0160208091040260200160405190810160405280929190818152602001828054610403906116f3565b80156104505780601f1061042557610100808354040283529160200191610450565b820191906000526020600020905b81548152906001019060200180831161043357829003601f168201915b5050505050905090565b6000336104688185856109f6565b5060019392505050565b600033610480858285610b1b565b61048b858585610bad565b506001949350505050565b60006104a0610daa565b905090565b3360008181526001602090815260408083206001600160a01b038716845290915281205490919061046890829086906104df90879061173e565b6109f6565b33600090815260076020526040812080546105465760405162461bcd60e51b815260206004820152600e60248201527f696e76616c69642063616c6c657200000000000000000000000000000000000060448201526064015b60405180910390fd5b8281600101600082825461055a919061173e565b90915550508054600182015411156105b45760405162461bcd60e51b815260206004820152601960248201527f657863656564732062726964676520737570706c792063617000000000000000604482015260640161053d565b6104688484610ed1565b60006105ca3383610fb0565b506001919050565b336105e56006546001600160a01b031690565b6001600160a01b03161461063b5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161053d565b6001600160a01b038216600081815260076020908152604091829020849055815192835282018390527f59e1e4348943de408b89af8ab71e502ea722dd41efd1ff4a3548c60e83e91c60910160405180910390a15050565b600061069f83836110f6565b9392505050565b6001600160a01b0381166000908152600560205260408120545b92915050565b60006104a06006546001600160a01b031690565b6060600480546103d7906116f3565b3360008181526001602090815260408083206001600160a01b0387168452909152812054909190838110156107865760405162461bcd60e51b815260206004820152602560248201527f45524332303a2064656372656173656420616c6c6f77616e63652062656c6f7760448201527f207a65726f000000000000000000000000000000000000000000000000000000606482015260840161053d565b61048b82868684036109f6565b600033610468818585610bad565b834211156107f15760405162461bcd60e51b815260206004820152601d60248201527f45524332305065726d69743a206578706972656420646561646c696e65000000604482015260640161053d565b60007f00000000000000000000000000000000000000000000000000000000000000008888886108208c611192565b6040805160208101969096526001600160a01b0394851690860152929091166060840152608083015260a082015260c0810186905260e001604051602081830303815290604052805190602001209050600061087b826111ba565b9050600061088b82878787611208565b9050896001600160a01b0316816001600160a01b0316146108ee5760405162461bcd60e51b815260206004820152601e60248201527f45524332305065726d69743a20696e76616c6964207369676e61747572650000604482015260640161053d565b6108f98a8a8a6109f6565b50505050505050505050565b336109186006546001600160a01b031690565b6001600160a01b03161461096e5760405162461bcd60e51b815260206004820181905260248201527f4f776e61626c653a2063616c6c6572206973206e6f7420746865206f776e6572604482015260640161053d565b6001600160a01b0381166109ea5760405162461bcd60e51b815260206004820152602660248201527f4f776e61626c653a206e6577206f776e657220697320746865207a65726f206160448201527f6464726573730000000000000000000000000000000000000000000000000000606482015260840161053d565b6109f381611230565b50565b6001600160a01b038316610a585760405162461bcd60e51b8152602060048201526024808201527f45524332303a20617070726f76652066726f6d20746865207a65726f206164646044820152637265737360e01b606482015260840161053d565b6001600160a01b038216610ab95760405162461bcd60e51b815260206004820152602260248201527f45524332303a20617070726f766520746f20746865207a65726f206164647265604482015261737360f01b606482015260840161053d565b6001600160a01b0383811660008181526001602090815260408083209487168084529482529182902085905590518481527f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b92591015b60405180910390a3505050565b6001600160a01b038381166000908152600160209081526040808320938616835292905220546000198114610ba75781811015610b9a5760405162461bcd60e51b815260206004820152601d60248201527f45524332303a20696e73756666696369656e7420616c6c6f77616e6365000000604482015260640161053d565b610ba784848484036109f6565b50505050565b6001600160a01b038316610c295760405162461bcd60e51b815260206004820152602560248201527f45524332303a207472616e736665722066726f6d20746865207a65726f20616460448201527f6472657373000000000000000000000000000000000000000000000000000000606482015260840161053d565b6001600160a01b038216610c8b5760405162461bcd60e51b815260206004820152602360248201527f45524332303a207472616e7366657220746f20746865207a65726f206164647260448201526265737360e81b606482015260840161053d565b6001600160a01b03831660009081526020819052604090205481811015610d1a5760405162461bcd60e51b815260206004820152602660248201527f45524332303a207472616e7366657220616d6f756e742065786365656473206260448201527f616c616e63650000000000000000000000000000000000000000000000000000606482015260840161053d565b6001600160a01b03808516600090815260208190526040808220858503905591851681529081208054849290610d5190849061173e565b92505081905550826001600160a01b0316846001600160a01b03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef84604051610d9d91815260200190565b60405180910390a3610ba7565b6000306001600160a01b037f000000000000000000000000000000000000000000000000000000000000000016148015610e0357507f000000000000000000000000000000000000000000000000000000000000000046145b15610e2d57507f000000000000000000000000000000000000000000000000000000000000000090565b50604080517f00000000000000000000000000000000000000000000000000000000000000006020808301919091527f0000000000000000000000000000000000000000000000000000000000000000828401527f000000000000000000000000000000000000000000000000000000000000000060608301524660808301523060a0808401919091528351808403909101815260c0909201909252805191012090565b6001600160a01b038216610f275760405162461bcd60e51b815260206004820152601f60248201527f45524332303a206d696e7420746f20746865207a65726f206164647265737300604482015260640161053d565b8060026000828254610f39919061173e565b90915550506001600160a01b03821660009081526020819052604081208054839290610f6690849061173e565b90915550506040518181526001600160a01b038316906000907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9060200160405180910390a35050565b6001600160a01b0382166110105760405162461bcd60e51b815260206004820152602160248201527f45524332303a206275726e2066726f6d20746865207a65726f206164647265736044820152607360f81b606482015260840161053d565b6001600160a01b038216600090815260208190526040902054818110156110845760405162461bcd60e51b815260206004820152602260248201527f45524332303a206275726e20616d6f756e7420657863656564732062616c616e604482015261636560f01b606482015260840161053d565b6001600160a01b03831660009081526020819052604081208383039055600280548492906110b3908490611756565b90915550506040518281526000906001600160a01b038516907fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef90602001610b0e565b3360009081526007602052604081208054151580611118575060008160010154115b1561117d5782816001015410156111715760405162461bcd60e51b815260206004820152601c60248201527f6578636565647320627269646765206d696e74656420616d6f756e7400000000604482015260640161053d565b60018101805484900390555b611188843385610b1b565b6104688484610fb0565b6001600160a01b03811660009081526005602052604090208054600181018255905b50919050565b60006106c06111c7610daa565b8360405161190160f01b6020820152602281018390526042810182905260009060620160405160208183030381529060405280519060200120905092915050565b60008060006112198787878761129a565b9150915061122681611387565b5095945050505050565b600680546001600160a01b038381167fffffffffffffffffffffffff0000000000000000000000000000000000000000831681179093556040519116919082907f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e090600090a35050565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156112d1575060009050600361137e565b8460ff16601b141580156112e957508460ff16601c14155b156112fa575060009050600461137e565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561134e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166113775760006001925092505061137e565b9150600090505b94509492505050565b600081600481111561139b5761139b61176d565b14156113a45750565b60018160048111156113b8576113b861176d565b14156114065760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e61747572650000000000000000604482015260640161053d565b600281600481111561141a5761141a61176d565b14156114685760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e67746800604482015260640161053d565b600381600481111561147c5761147c61176d565b14156114d55760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c604482015261756560f01b606482015260840161053d565b60048160048111156114e9576114e961176d565b14156109f35760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c604482015261756560f01b606482015260840161053d565b600060208083528351808285015260005b8181101561156f57858101830151858201604001528201611553565b81811115611581576000604083870101525b50601f01601f1916929092016040019392505050565b80356001600160a01b03811681146115ae57600080fd5b919050565b600080604083850312156115c657600080fd5b6115cf83611597565b946020939093013593505050565b6000806000606084860312156115f257600080fd5b6115fb84611597565b925061160960208501611597565b9150604084013590509250925092565b60006020828403121561162b57600080fd5b5035919050565b60006020828403121561164457600080fd5b61069f82611597565b600080600080600080600060e0888a03121561166857600080fd5b61167188611597565b965061167f60208901611597565b95506040880135945060608801359350608088013560ff811681146116a357600080fd5b9699959850939692959460a0840135945060c09093013592915050565b600080604083850312156116d357600080fd5b6116dc83611597565b91506116ea60208401611597565b90509250929050565b600181811c9082168061170757607f821691505b602082108114156111b457634e487b7160e01b600052602260045260246000fd5b634e487b7160e01b600052601160045260246000fd5b6000821982111561175157611751611728565b500190565b60008282101561176857611768611728565b500390565b634e487b7160e01b600052602160045260246000fdfea2646970667358221220511c1dfefcbb2806cd4204320e57dd9e05b2e8676f0301446ce50202bea742e264736f6c63430008090033";

type MultiBridgeTokenPermitConstructorParams = [signer?: Signer] | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: MultiBridgeTokenPermitConstructorParams,
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class MultiBridgeTokenPermit__factory extends ContractFactory {
  constructor(...args: MultiBridgeTokenPermitConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "MultiBridgeTokenPermit";
  }

  deploy(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): Promise<MultiBridgeTokenPermit> {
    return super.deploy(name_, symbol_, decimals_, overrides || {}) as Promise<MultiBridgeTokenPermit>;
  }
  getDeployTransaction(
    name_: string,
    symbol_: string,
    decimals_: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> },
  ): TransactionRequest {
    return super.getDeployTransaction(name_, symbol_, decimals_, overrides || {});
  }
  attach(address: string): MultiBridgeTokenPermit {
    return super.attach(address) as MultiBridgeTokenPermit;
  }
  connect(signer: Signer): MultiBridgeTokenPermit__factory {
    return super.connect(signer) as MultiBridgeTokenPermit__factory;
  }
  static readonly contractName: "MultiBridgeTokenPermit";
  public readonly contractName: "MultiBridgeTokenPermit";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): MultiBridgeTokenPermitInterface {
    return new utils.Interface(_abi) as MultiBridgeTokenPermitInterface;
  }
  static connect(address: string, signerOrProvider: Signer | Provider): MultiBridgeTokenPermit {
    return new Contract(address, _abi, signerOrProvider) as MultiBridgeTokenPermit;
  }
}