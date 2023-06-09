/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  BaseContract,
  BigNumber,
  BigNumberish,
  BytesLike,
  CallOverrides,
  ContractTransaction,
  Overrides,
  PopulatedTransaction,
  Signer,
  utils,
} from "ethers";
import { FunctionFragment, Result } from "@ethersproject/abi";
import { Listener, Provider } from "@ethersproject/providers";
import { TypedEventFilter, TypedEvent, TypedListener, OnEvent } from "./common";

export interface IDefichainMinterInterface extends utils.Interface {
  contractName: "IDefichainMinter";
  functions: {
    "mintToken(address,uint256,uint256,uint256,string,bytes32,bytes32,uint8)": FunctionFragment;
    "burnToken(string,string,uint256)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "mintToken",
    values: [
      string,
      BigNumberish,
      BigNumberish,
      BigNumberish,
      string,
      BytesLike,
      number
    ]
  ): string;

  encodeFunctionData(
    functionFragment: "burnToken",
    values: [string, string, BigNumberish]
  ): string;

  decodeFunctionResult(functionFragment: "mintToken", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "burnToken", data: BytesLike): Result;

  events: {};
}

export interface IDefichainMinter extends BaseContract {
  contractName: "IDefichainMinter";
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  interface: IDefichainMinterInterface;

  queryFilter<TEvent extends TypedEvent>(
    event: TypedEventFilter<TEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TEvent>>;

  listeners<TEvent extends TypedEvent>(
    eventFilter?: TypedEventFilter<TEvent>
  ): Array<TypedListener<TEvent>>;
  listeners(eventName?: string): Array<Listener>;
  removeAllListeners<TEvent extends TypedEvent>(
    eventFilter: TypedEventFilter<TEvent>
  ): this;
  removeAllListeners(eventName?: string): this;
  off: OnEvent<this>;
  on: OnEvent<this>;
  once: OnEvent<this>;
  removeListener: OnEvent<this>;

  functions: {
    mintToken(
      _targetAddress: string,
      _txid: BigNumberish,
      _n: BigNumberish,
      _amount: BigNumberish,
      _bridge: string,
      _signature_r: BytesLike,
      _signature_s: BytesLike,
      _signature_v: number,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    burnToken(
      _targetAddress: string,
      _bridge: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  mintToken(
    _targetAddress: string,
    _txid: BigNumberish,
    _n: BigNumberish,
    _amount: BigNumberish,
    _bridge: string,
    _signature_r: BytesLike,
    _signature_s: BytesLike,
    _signature_v: number,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  burnToken(
    _targetAddress: string,
    _bridge: string,
    _amount: BigNumberish,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    mintToken(
      _targetAddress: string,
      _txid: BigNumberish,
      _n: BigNumberish,
      _amount: BigNumberish,
      _bridge: string,
      _signature_r: BytesLike,
      _signature_s: BytesLike,
      _signature_v: number,
      overrides?: CallOverrides
    ): Promise<void>;

    burnToken(
      _targetAddress: string,
      _bridge: string,
      _amount: BigNumberish,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {};

  estimateGas: {
    mintToken(
      _targetAddress: string,
      _txid: BigNumberish,
      _n: BigNumberish,
      _amount: BigNumberish,
      _bridge: string,
      _signature_r: BytesLike,
      _signature_s: BytesLike,
      _signature_v: number,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    burnToken(
      _targetAddress: string,
      _bridge: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    mintToken(
      _targetAddress: string,
      _txid: BigNumberish,
      _n: BigNumberish,
      _amount: BigNumberish,
      _bridge: string,
      _signature_r: BytesLike,
      _signature_s: BytesLike,
      _signature_v: number,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    burnToken(
      _targetAddress: string,
      _bridge: string,
      _amount: BigNumberish,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
