/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */

// import { Bytes } from "ethers";
import { BigNumber } from "ethers";
import { MapLike } from "typescript";

interface ErrMsg {
  code: ErrCode;
  msg: string;
}

enum ErrCode {
  ERROR_CODE_UNDEFINED = 0,
  ERROR_CODE_COMMON = 500,
  ERROR_NO_TOKEN_ON_DST_CHAIN = 1001,
}

interface Chain {
  id: number;
  name: string;
  icon: string;
  block_delay: number;
  gas_token_symbol: string;
  explore_url: string;
  rpc_url: string;
  contract_addr: string;
  drop_gas_amt?: string;
}

interface PeggedPairConfig {
  org_chain_id: number;
  org_token: TokenInfo;
  pegged_chain_id: number;
  pegged_token: TokenInfo;
  pegged_deposit_contract_addr: string;
  pegged_burn_contract_addr: string;
  canonical_token_contract_addr: string;
  vault_version: number;
  bridge_version: number;
}

interface Token {
  symbol: string;
  address: string;
  decimal: number;
  xfer_disabled: boolean;
  display_symbol?: string; /// FOR ETH <=====> WETH
}

interface GetAdvancedInfoRequest {
  addr: string;
}

interface GetAdvancedInfoResponse {
  slippage_tolerance: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  err: any;
}
interface SetAdvancedInfoRequest {
  addr: string;
  slippage_tolerance: number;
}

interface ChainTokenInfo {
  token: Array<TokenInfo>;
}

interface GetTransferConfigsResponse {
  chains: Array<Chain>;
  chain_token: MapLike<ChainTokenInfo>;
  farming_reward_contract_addr: string;
  pegged_pair_configs: Array<PeggedPairConfig>;
}

interface EstimateAmtRequest {
  src_chain_id: number;
  dst_chain_id: number;
  token_symbol: string;
  amt: string;
  usr_addr: string;
}

interface EstimateAmtResponse {
  eq_value_token_amt: string;
  bridge_rate: number;
  fee: string;
  slippage_tolerance: number;
  max_slippage: number;
  err: any;
}

interface MarkTransferRequest {
  transfer_id: string;
  // dst_transfer_id: string;
  src_send_info?: TransferInfo;
  dst_min_received_info?: TransferInfo;
  addr?: string;
  src_tx_hash?: string;
  type: MarkTransferTypeRequest;
  withdraw_seq_num?: string;
}

interface GetTransferStatusRequest {
  transfer_id: string;
}

interface GetTransferStatusResponse {
  status: TransferHistoryStatus;
  wd_onchain: string;
  sorted_sigs: Array<string>;
  signers: Array<string>;
  powers: Array<string>;
  src_block_tx_link?: string;
  dst_block_tx_link?: string;
}

export enum MarkTransferTypeRequest {
  TRANSFER_TYPE_UNKNOWN = 0,
  TRANSFER_TYPE_SEND = 1,
  TRANSFER_TYPE_REFUND = 2,
}

interface WithdrawLiquidityRequest {
  transfer_id?: string;
  receiver_addr?: string;
  amount?: string;
  token_addr?: string;
  chain_id?: number;
  sig?: string;
  reqid?: number;
  // creator:string
}

interface WithdrawLiquidityResponse {
  seq_num: string;
  withdraw_id: string;
}
interface WithdrawDetail {
  _wdmsg: string;
  _sigs: Array<string>;
  _signers: Array<string>;
  _powers: Array<string>;
}

interface TransferHistoryRequest {
  next_page_token: string; // for first page, it's ""
  page_size: number;
  acct_addr: string[];
}

interface TransferHistory {
  transfer_id: string;
  src_send_info: TransferInfo;
  dst_received_info: TransferInfo;
  srcAddress: string;
  dstAddress: string;
  ts: number;
  src_block_tx_link: string;
  dst_block_tx_link: string;
  status: TransferHistoryStatus;
  updateTime?: number;
  txIsFailed?: boolean;
  nonce: number;
  isLocal?: boolean;
}

export enum TransferHistoryStatus {
  TRANSFER_UNKNOWN,
  TRANSFER_SUBMITTING, // user: after calling mark transfer api
  TRANSFER_FAILED, // user: check if tx reverted when shown status is TRANSFER_SUBMITTING
  TRANSFER_WAITING_FOR_SGN_CONFIRMATION, // relayer: on send tx success event
  TRANSFER_WAITING_FOR_FUND_RELEASE, // relayer: mark send tx
  TRANSFER_COMPLETED, // relayer: on relay tx success event
  TRANSFER_TO_BE_REFUNDED, // x: transfer rejected by sgn and waiting for withdraw api called
  TRANSFER_REQUESTING_REFUND, // user: withdraw api has been called and withdraw is processing by sgn
  TRANSFER_REFUND_TO_BE_CONFIRMED, // x: withdraw is approved by sgn
  TRANSFER_CONFIRMING_YOUR_REFUND, // user: mark refund has been submitted on chain
  TRANSFER_REFUNDED, // relayer: on refund(withdraw liquidity actually) tx event
  TRANSFER_DELAYED,
  DEFICHAIN_STEP_1_MINT,
  DEFICHAIN_STEP_2_MINT,
  DEFICHAIN_STEP_1_BURN,
}

interface TransferInfo {
  chain: Chain;
  token: Token;
  amount: string;
}

interface TransferHistoryResponse {
  history: Array<TransferHistory>;
  next_page_token: string;
  current_size: number;
}

interface TokenInfo {
  token: Token;
  name: string;
  icon: string;
  max_amt: string;
  balance?: string;
  inbound_lmt?: string;
}

interface ErrMsg {
  code: ErrCode;
  msg: string;
}

interface Signature {
  signer: string;
  sig_bytes: string;
}

export enum UnlockRewardType {
  SWITCH_CHAIN,
  UNLUCK,
  UNLUCKED_TOO_FREQUENTLY,
  UNLUCKING,
  UNLUCK_SUCCESSED,
}

export enum ClaimRewardType {
  CLAIMING,
  COMPLETED,
}

export enum ClaimType {
  SWITCH_CHAIN,
  UNLUCKED_TOO_FREQUENTLY,
  UNLUCKING,
  UNLUCK_SUCCESSED,
  CLAIMING,
  COMPLETED,
}

interface FlowDepositParameters {
  safeBoxContractAddress: string;
  storagePath: string;
  amount: string;
  flowAddress: string; /// Flow wallet address
  mintChainId: string;
  evmMintAddress: string; /// EVM wallet address
  nonce: string;
  tokenAddress: string;
}

interface FlowDepositResponse {
  flowTransanctionId: string; // flow transaction hash
  transferId: string; // auto generated transfer id
}

interface FlowBurnParameters {
  pegBridgeAddress: string;
  storagePath: string;
  amount: string;
  flowAddress: string; /// Flow wallet address
  withdrawChainId: string;
  evmWithdrawAddress: string; /// EVM wallet address
  nonce: string;
  tokenAddress: string;
}

interface FlowBurnResponse {
  flowTransanctionId: string; // flow transaction hash
  transferId: string; // auto generated transfer id
}

interface FlowDepositTokenConfig {
  minDepo: number;
  maxDepo: number;
  cap: number;
  delayThreshold: number;
}

interface FlowBurnTokenConfig {
  minBurn: number;
  maxBurn: number;
  cap: number;
  delayThreshold: number;
}

interface FlowTokenPathConfigs {
  FtConfigs: Array<FlowTokenPathConfig>;
}
interface FlowTokenPathConfig {
  TokenName: string;
  FullAddress: string;
  TokenAddress: string;
  StoragePath: string;
  BalancePath: string;
  ReceiverPath: string;
  Symbol: string;
}

interface CoMinterCap {
  minterCap: BigNumber;
  minterSupply: BigNumber;
}

interface BurnConfig {
  chain_id: number;
  token: TokenInfo;
  burn_contract_addr: string;
  canonical_token_contract_addr: string;
  burn_contract_version: number;
}

/// burn_config_as_org.bridge_version === 2
/// burn_config_as_dst.bridge_version is not required
/// If the bridge_version of burnConfig1 and burnConfig2 are 2,
/// There should be two MultiBurnPairConfigs
/// 1: burnConfig1 ----> burnConfig2
/// 2: burnConfig2 ----> burnConfig1
interface MultiBurnPairConfig {
  burn_config_as_org: BurnConfig; /// Could be used only as from chain
  burn_config_as_dst: BurnConfig; /// Could be used only as to chain
}

interface S3NFTToken {
  chainid: number;
  addr: string;
}

interface S3NFTConfig {
  name: string;
  symbol: string;
  url: string;
  orig: S3NFTToken;
  pegs: S3NFTToken[];
}

interface NFTItem {
  name: string;
  img: string;
  tokenName: string;
  nftId: number;
  address: string;
  isNativeNft: boolean;
}

interface S3NFTConfigChain {
  chainid: number;
  addr: string;
}

interface NFTChain {
  chainid: number;
  name: string;
  addr: string;
  icon: string;
}

interface NFTHistory {
  // second
  createdAt: number;
  srcChid: number;
  dstChid: number;
  sender: string;
  receiver: string;
  srcNft: string;
  dstNft: string;
  tokID: string;
  srcTx: string;
  dstTx: string;
  status: number;
  txIsFailed: boolean;
}

interface NFTHistoryRequest {
  pageSize: number;
  nextPageToken: string;
}

interface NFTHistoryResponse {
  history: NFTHistory[];
  nextPageToken: number;
  pageSize: number;
}

export enum NFTBridgeStatus {
  NFT_BRIDEGE_SUBMITTING,
  NFT_BRIDEGE_WAITING_FOR_SGN,
  NFT_BRIDEGE_WAITING_DST_MINT,
  NFT_BRIDEGE_COMPLETE,
  NFT_BRIDGE_FAILED,
}

export enum NFTBridgeMode {
  UNDEFINED,
  PEGGED, // orig chain lock, dst chain mint
  BURN, // back to orig chain
  NATIVE, // token contract cross chain
  NON_ORIG_BURN, // remote mint on peg chains
}

interface ERC721TokenUriMetadata {
  image: string;
  description: string;
  name: string;
}

export type {
  //   LPHistoryStatus,
  Chain,
  Token,
  GetAdvancedInfoRequest,
  GetAdvancedInfoResponse,
  SetAdvancedInfoRequest,
  GetTransferConfigsResponse,
  EstimateAmtRequest,
  EstimateAmtResponse,
  MarkTransferRequest,
  GetTransferStatusRequest,
  GetTransferStatusResponse,
  WithdrawLiquidityRequest,
  WithdrawLiquidityResponse,
  WithdrawDetail,
  TransferHistoryRequest,
  TransferHistory,
  TransferInfo,
  TransferHistoryResponse,
  TokenInfo,
  ErrMsg,
  Signature,
  PeggedPairConfig,
  FlowDepositParameters,
  FlowDepositResponse,
  FlowBurnParameters,
  FlowBurnResponse,
  FlowDepositTokenConfig,
  FlowBurnTokenConfig,
  FlowTokenPathConfigs,
  FlowTokenPathConfig,
  CoMinterCap,
  BurnConfig,
  MultiBurnPairConfig,
  S3NFTConfig,
  S3NFTToken,
  NFTItem,
  NFTChain,
  S3NFTConfigChain,
  NFTHistory,
  NFTHistoryRequest,
  NFTHistoryResponse,
  ERC721TokenUriMetadata,
};
