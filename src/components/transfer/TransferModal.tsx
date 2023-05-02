import { Modal, Button } from "antd";
import { ContractTransaction, ethers } from "ethers";
import { Collapse } from "react-collapse";

import {
  FC,
  useEffect,
  useState,
  useContext,
  useRef,
  useCallback,
} from "react";
import { createUseStyles } from "react-jss";
import { CloseCircleFilled, WarningFilled } from "@ant-design/icons";
import { BigNumber } from "@ethersproject/bignumber";
import { formatUnits } from "@ethersproject/units";
import { formatDecimalPart, safeParseUnits } from "celer-web-utils/lib/format";
import { useConnectedWallet, TxResult } from "@terra-money/wallet-provider";
import { MsgExecuteContract } from "@terra-money/terra.js";
import { getAddress } from "ethers/lib/utils";

import { useContractsContext } from "../../providers/ContractsContextProvider";
import { useWeb3Context } from "../../providers/Web3ContextProvider";

import { useAppDispatch, useAppSelector } from "../../redux/store";
import { setEstimateAmtInfoInState } from "../../redux/transferSlice";

import { Theme } from "../../theme";
import { ERC20 } from "../../typechain/typechain/ERC20";
import { ERC20__factory } from "../../typechain/typechain/factories/ERC20__factory";
import { ColorThemeContext } from "../../providers/ThemeProvider";
import { useCustomContractLoader, useNativeETHToken } from "../../hooks";
import arrTop from "../../images/arrTop.svg";
import errorLogo from "../../images/dialog-error.svg";

import TransDetail from "./TransDetail";
import {
  TransferHistoryStatus,
  TransferHistory,
  FlowDepositParameters,
  FlowBurnParameters,
} from "../../constants/type";
import arrTopLightIcon from "../../images/arrTopLight.svg";

/* eslint-disable camelcase */

import { WebClient } from "../../proto/gateway/GatewayServiceClientPb";
import {
  EstimateAmtRequest,
  EstimateAmtResponse,
} from "../../proto/gateway/gateway_pb";
import { getNetworkById } from "../../constants/network";
import {
  PeggedChainMode,
  usePeggedPairConfig,
} from "../../hooks/usePeggedPairConfig";
import {
  isNonEVMChain,
  convertNonEVMAddressToEVMCompatible,
  useNonEVMContext,
  getNonEVMMode,
  NonEVMMode,
} from "../../providers/NonEVMContextProvider";
import { depositFromFlow, burnFromFlow } from "../../redux/NonEVMAPIs/flowAPIs";
import {
  pegV2ThirdPartDeployTokens,
  storageConstants,
} from "../../constants/const";
import { useNonEVMBigAmountDelay } from "../../hooks/useNonEVMBigAmountDelay";
import {
  convertCanonicalToTerraAddress,
  convertTerraToCanonicalAddress,
} from "../../redux/NonEVMAPIs/terraAPIs";
import { useMultiBurnConfig } from "../../hooks/useMultiBurnConfig";
import { isApeChain } from "../../hooks/useTransfer";
import {
  DepositMessage,
  burnToken,
  getDepositAddress,
  getDeposits,
  getKeySignatures,
  getLogs,
  getSignatures,
  getTransactionN,
} from "../../utils/customDefichainFunctions";
import QRCode from "react-qr-code";
import cx from "classnames";
import classNames from "classnames";
import TokenInput, { TokenInputAny } from "../TokenInput";

const Down = ({ classes, isOpen }) => {
  return (
    <svg
      className={isOpen ? cx(classes.icondownopen) : cx(classes.icondown)}
      width="16"
      height="16"
      viewBox="0 0 16 16"
    >
      <path d="M14.8 4L8 9.6 1.2 4 0 5.333 8 12l8-6.667z" />
    </svg>
  ) as any;
};

const generateErrMsg = (
  classes: any,
  msg: string,
  iconType = "WarningFilled"
) => {
  return (
    <div className={classes.err}>
      <div className={classes.errInner}>
        {" "}
        <div className="errInnerbody">
          {iconType === "WarningFilled" ? (
            <WarningFilled style={{ fontSize: 20, marginRight: 5 }} />
          ) : (
            <CloseCircleFilled style={{ fontSize: 20, marginRight: 5 }} />
          )}
          <span style={{ fontSize: 14, marginLeft: 10 }}>{msg}</span>
        </div>
      </div>
    </div>
  );
};

function Block({ classes, isOpen, title, onToggle, children }) {
  return (
    <div className={cx("block")}>
      <button
        className={cx(classes.toggle, classes.rescueButton)}
        onClick={onToggle}
      >
        <span style={{ paddingRight: "10px" }}>{title}</span>
        <Down classes={classes} isOpen={isOpen} />
      </button>
      <Collapse isOpened={isOpen}>{children}</Collapse>
    </div>
  );
}

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>(
  (theme: Theme) => ({
    balanceText: {
      textDecoration: "underline",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    countdown: {
      fontSize: 14,
      fontWeight: 600,
    },
    explanation: {
      color: theme.infoSuccess,
      marginBottom: 24,
    },
    historyDetail: {
      width: "100%",
    },
    detailItem: {
      borderBottom: `1px solid ${theme.infoSuccess}`,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "relative",
      padding: "12px 0",
    },
    detailItemBto: {
      borderBottom: `1px solid ${theme.infoSuccess}`,
      padding: "12px 0",
    },
    detailItemTop: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    itemLeft: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      textAlign: "left",
    },
    itemContImg: {
      width: 32,
      height: 32,
      borderRadius: "50%",
      marginRight: 8,
    },
    itemRight: {
      textAlign: "right",
    },
    itemText: {},
    itemTitle: {
      fontSize: 16,
      color: theme.infoSuccess,
    },
    itemTextDes: {
      fontSize: 12,
      color: theme.infoSuccess,
    },
    totalValue: {
      fontSize: 16,
      color: "#FC5656",
    },
    totalValueRN: {
      fontSize: 16,
      color: "#00d395",
    },
    err: {
      width: "100%",
      textAlign: "center",
      display: "flex",
      justifyContent: "center",
      minHeight: (props) => (props.isMobile ? 0 : 24),
    },
    errInner: {
      color: theme.infoDanger,
      textAlign: "left",
      margin: (props) => (props.isMobile ? "24px 0 0 0" : "24px 0"),
      background: "#fff",
      boxShadow:
        "0px 6px 12px -6px rgba(24, 39, 75, 0.12), 0px 8px 24px -4px rgba(24, 39, 75, 0.08)",
      borderRadius: 8,
      fontSize: 14,
    },
    fromNet: {
      fontSize: 12,
      color: theme.infoSuccess,
    },
    icondown: {
      fill: "gray",
      transition: "transform 280ms cubic-bezier(0, 1, 0, 1)",
    },
    icondownopen: {
      fill: "gray",
      transition: "transform 280ms cubic-bezier(0, 1, 0, 1)",
      transform: "rotate(.5turn)",
    },
    toggle: {
      display: "flex",
      justifyContent: "space-between",
      color: "white",
    },
    contentToggle: {
      padding: "10px 10px 30px",
    },
    recipientDescText: {},
    recipientDescText3: { display: "flex", flexFlow: "row wrap" },
    recipientDescText2: {},
    expe: {
      fontSize: 12,
      color: theme.infoSuccess,
      textAlign: "left",
      paddingTop: 30,
    },
    transndes: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 12px",
      marginTop: 18,
      fontSize: 20,
      flexGrow: 3,
    },
    nonEvmAddressText: {
      color: theme.surfacePrimary,
      float: "left",
      flex: 2,
      "& .ant-input": {
        width: "100%",
        fontSize: 14,
        fontWeight: 600,
      },
      "& .ant-input::-webkit-input-placeholder": {
        color: `${theme.selectChainBorder} !important`,
      },

      "& .ant-input[disabled]": {
        color: `${theme.surfacePrimary} !important`,
      },
    },
    time: {
      fontSize: 16,
      color: theme.infoSuccess,
      textAlign: "right",
    },
    modalTop: {},
    modalTopDes: {
      fontSize: 14,
    },
    modalTopTitle: {
      fontSize: 12,
      width: "100%",
      textAlign: "center",
      marginBottom: 20,
      fontWeight: 600,
      color: theme.surfacePrimary,
    },
    transferdes: {
      fontSize: 12,
      width: "100%",
      textAlign: "center",
      marginBottom: (props) => (props.isMobile ? 0 : 20),
      fontWeight: 400,
      color: theme.surfacePrimary,
    },
    transferde2: {
      color: theme.infoWarning,
      textAlign: "center",
      background: "#fff",
      borderRadius: 12,
      padding: "8px 12px",
      fontWeight: 500,
    },
    modalToptext: {
      fontSize: 15,
      width: "100%",
      textAlign: "center",
      fontWeight: 600,
      color: theme.surfacePrimary,
    },
    modalToptext2: {
      fontSize: 16,
      width: "100%",
      textAlign: "center",
      fontWeight: 600,
      color: theme.surfacePrimary,
    },
    modalToptext3: {
      fontSize: 16,
      width: "100%",
      textAlign: "center",
      fontWeight: 600,
      color: theme.surfacePrimary,
    },
    baseTimer: {
      position: "relative",
      width: "256px",
      height: "256px",
    },
    baseTimerSvg: {
      transform: "scaleX(-1)",
    },
    baseTimerCircle: {
      fill: "none",
      stroke: "none",
    },
    baseTimerPath: {
      strokeWidth: "7px",
      stroke: "grey",
    },
    green: {
      color: "rgb(65, 184, 131)",
    },
    orange: {
      color: "orange",
    },
    red: {
      color: "red",
    },
    rescueButton: {
      background: "transparent",
      margin: "0",
      padding: "10px",
      textAlign: "left",
      cursor: "pointer",
      color: "gray",
      border: "0",
      marginLeft: "auto",
      marginRight: "auto",
      marginTop: "20px",
    },
    baseTimerPathRem: {
      strokeWidth: "7px",
      strokeLinecap: "round",
      transform: "rotate(90deg)",
      transformOrigin: "center",
      transition: "1s linear all",
      fillRule: "nonzero",
      stroke: "currentColor",
    },
    baseTimerLabel: {
      position: "absolute",
      width: "256px",
      height: "256px",
      top: "0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "46px",
      color: "#ffffff",
    },
    modalTopTitleNotice: {
      fontSize: 14,
      fontWeight: 400,
      width: "100%",
      textAlign: "center",
      marginBottom: 20,
    },
    modalTopIcon: {
      fontSize: 16,
      fontWeight: 600,
      width: "100%",
      textAlign: "center",
      marginTop: (props) => (props.isMobile ? 18 : 40),
      marginBottom: (props) => (props.isMobile ? 18 : 40),
      "&img": {
        width: 90,
      },
    },
    block: {
      border: "1px solid #ccc",
      marginBottom: "10px",
    },
    modalSuccessIcon: {
      fontSize: 70,
      fontWeight: "bold",
      color: theme.transferSuccess,
    },
    addToken: {
      color: "#00E096",
      fontSize: 12,
      padding: "10px 10px",
      borderRadius: "100px",
      background: theme.primaryBackground,
      display: "flex",
      width: "auto",
      alignItems: "center",
      cursor: "pointer",
      justifyContent: "center",
      marginTop: 40,
    },
    recipientContainer: {
      background: theme.primaryBackground,
      borderRadius: 8,
      padding: "14px 14px 14px 14px",
      color: theme.surfacePrimary,
      textAlign: "center",
      marginTop: "14px",
    },
    descripetItem: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: 6,
    },
    button: {
      marginTop: (props) => (props.isMobile ? 16 : 40),
      height: 56,
      lineHeight: "42px",
      width: "100%",
      background: theme.primaryBrand,
      borderRadius: 16,
      fontSize: 18,
      fontWeight: 500,
      borderWidth: 0,
      "&:focus, &:hover": {
        background: theme.buttonHover,
      },
      "&::before": {
        backgroundColor: `${theme.primaryBrand} !important`,
      },
    },
    buttonSmaller: {
      marginTop: (props) => (props.isMobile ? 16 : 40),
      height: 42,
      background: theme.primaryBrand,
      borderRadius: 16,
      fontSize: 14,
      fontWeight: 500,
      borderWidth: 0,
      "&:focus, &:hover": {
        background: theme.buttonHover,
      },
      "&::before": {
        backgroundColor: `${theme.primaryBrand} !important`,
      },
    },
    resultText: {
      color: theme.surfacePrimary,
    },
    modaldes: {
      color: theme.surfacePrimary,
      marginTop: (props) => (props.isMobile ? 16 : 40),
      fontSize: 15,
      textAlign: "center",
    },
    modaldes2: {
      color: theme.surfacePrimary,
      marginTop: (props) => (props.isMobile ? 16 : 70),
      fontSize: 15,
      textAlign: "center",
    },
    transferModal: {
      minWidth: (props) => (props.isMobile ? "100%" : 448),
      background: theme.secondBackground,
      border: `1px solid ${theme.primaryBackground}`,
      "& .ant-modal-content": {
        background: theme.secondBackground,
        boxShadow: (props) => (props.isMobile ? "none" : ""),
        "& .ant-modal-close": {
          color: theme.surfacePrimary,
        },
        "& .ant-modal-header": {
          background: theme.secondBackground,
          borderBottom: "none",
          "& .ant-modal-title": {
            color: theme.surfacePrimary,
            "& .ant-typography": {
              color: theme.surfacePrimary,
            },
          },
        },
        "& .ant-modal-body": {
          minHeight: 260,
        },
        "& .ant-modal-footer": {
          border: "none",
          "& .ant-btn-link": {
            color: theme.primaryBrand,
          },
        },
      },
      "& .ant-typography": {
        color: theme.surfacePrimary,
      },
    },
    warningInnerbody: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    },
    viewInExplorerWrapper: {
      display: "flex",
      justifyContent: "center",
      width: "100%",
      fontWeight: 700,
      fontSize: 12,
      marginTop: 18,
    },
  })
);

const TRANSFER = "transfer";
const BRIDGE_RATE_UPDATED = "bridgeRateUpdated";

interface IProps {
  amount: string;
  receiveAmount: number;
  nonEVMReceiverAddress: string;
  onCancel: () => void;
  onSuccess: () => void;
}

const TransferModal: FC<IProps> = ({
  amount,
  receiveAmount,
  nonEVMReceiverAddress,
  onCancel,
  onSuccess,
}) => {
  const { isMobile } = useAppSelector((state) => state.windowWidth);
  const classes = useStyles({ isMobile });
  const {
    contracts: {
      bridge,
      originalTokenVault,
      originalTokenVaultV2,
      peggedTokenBridge,
      peggedTokenBridgeV2,
    },
    transactor,
  } = useContractsContext();
  const terraWallet = useConnectedWallet();
  const { provider, address, chainId } = useWeb3Context();
  const { nonEVMMode, nonEVMAddress } = useNonEVMContext();
  const dispatch = useAppDispatch();
  const { transferInfo, modal } = useAppSelector((state) => state);
  const { showTransferModal } = modal;
  const {
    transferConfig,
    fromChain,
    toChain,
    selectedToken,
    estimateAmtInfoInState,
    rate,
    flowTokenPathConfigs,
  } = transferInfo;

  const getTokenByChainAndTokenSymbol = (cId, tokenSymbol) => {
    return transferConfig?.chain_token[cId]?.token?.find(
      (tokenInfo) => tokenInfo?.token?.symbol === tokenSymbol
    );
  };

  const selectedToChain = transferConfig?.chains.find(
    (chain) => chain.id === toChain?.id
  );
  const value = safeParseUnits(
    amount || "0",
    selectedToken?.token?.decimal ?? 18
  );

  const toChainInConfig = transferConfig.chains.find(
    (it) => it.id === toChain?.id
  );

  // const arrivalGasTokenAmount = BigNumber.from(toChainInConfig?.drop_gas_amt ?? "0");
  const dropGasAmt =
    estimateAmtInfoInState?.dropGasAmt &&
    estimateAmtInfoInState?.dropGasAmt.length > 0
      ? estimateAmtInfoInState?.dropGasAmt
      : "0";
  const arrivalGasTokenAmount = BigNumber.from(dropGasAmt);
  const arrivalGasTokenDecimal =
    getTokenByChainAndTokenSymbol(
      toChainInConfig?.id ?? 0,
      toChainInConfig?.gas_token_symbol
    )?.token.decimal ?? 18;
  const arrivalGasTokenAmountValue = formatUnits(
    arrivalGasTokenAmount,
    arrivalGasTokenDecimal
  );
  const arrivalGasTokenAmountDisplay = formatDecimalPart(
    arrivalGasTokenAmountValue || "0",
    6,
    "round",
    true
  );
  const arrivalGasTokenSymbol = toChainInConfig?.gas_token_symbol;

  // token contract: param address is selected token's address
  const pegConfig = usePeggedPairConfig();
  const { multiBurnConfig } = useMultiBurnConfig();

  const tokenAddress = pegConfig?.getTokenBalanceAddress(
    selectedToken?.token?.address || "",
    fromChain?.id,
    selectedToken?.token?.symbol,
    transferConfig.pegged_pair_configs
  );

  const tokenContract = useCustomContractLoader(
    provider,
    isNonEVMChain(fromChain?.id ?? 0) ? "" : tokenAddress || "",
    ERC20__factory
  ) as ERC20 | undefined;
  const [transferSuccess, setTransferSuccess] = useState<boolean>(false);
  const [transfState, setTransfState] = useState<
    TransferHistoryStatus | "bridgeRateUpdated" | "transfer"
  >(TRANSFER);
  const [loading, setLoading] = useState(false);
  const [defichainGeneratingSignatures, setDefichainGeneratingSignatures] =
    useState(false);
  const [defichainGeneratingSignatures2, setDefichainGeneratingSignatures2] =
    useState(false);
  const [isRecovering, setIsRecovering] = useState<boolean>(false);
  const [isRecoveringBurn, setIsRecoveringBurn] = useState<boolean>(false);
  const [recErr, setRecErr] = useState<string>("");
  const [mintErr, setMintErr] = useState<string>("");
  const [contractTransaction, setContractTransaction] = useState<any>(null);
  const [burnErr, setBurnErr] = useState<string>("");
  const [burnWait, setBurnWait] = useState<boolean>(false);

  // toggle recovery for mint
  const [toggled, setToggled] = useState(false);

  const [defichainDepositHash, setDefichainDepositHash] = useState("");
  const [defichainDepositAddress, setDefichainDepositAddress] = useState("");
  const [failedMessageToDisplay, setFailedMessageToDisplay] = useState("");
  const [newEstimateAmtInfoInState, setNewEstimateAmtInfoInState] =
    useState<EstimateAmtResponse.AsObject>({
      eqValueTokenAmt: "",
      bridgeRate: 0,
      baseFee: "",
      percFee: "",
      slippageTolerance: 0,
      maxSlippage: 0,
      estimatedReceiveAmt: "",
      dropGasAmt: "",
    });
  const { isNativeToken } = useNativeETHToken(fromChain, selectedToken);
  const { nonEVMBigAmountDelayed, nonEVMDelayTimeInMinute } =
    useNonEVMBigAmountDelay(receiveAmount);

  const [recoveryTXID, setRecoveryTXID] = useState("");
  const [recoveryBurnTXID, setRecoveryBurnTXID] = useState("");

  let detailInter;
  const { themeType } = useContext(ColorThemeContext);
  useEffect(() => {
    const img = new Image();
    img.src = themeType === "dark" ? arrTop : arrTopLightIcon; // To speed up image source loading
    return () => {
      clearInterval(detailInter);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // defichain useeffect
  const [defiConfs, setDefiConfs] = useState<number>(0);
  const [defiDeposit, setDefiDeposit] = useState<any | null>(null);
  const CONFLIMIT = 10;
  const [isInFlight, setIsInFlight] = useState<boolean>(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (isInFlight) return;
      setIsInFlight(true);
      if (transfState === TransferHistoryStatus.DEFICHAIN_STEP_1_BURN) {
        try {
          const txReceipt = await provider?.getTransaction(
            contractTransaction.hash
          );
          if (txReceipt == null) {
            console.log("Receipt null");
          } else {
            console.log(txReceipt);
            setContractTransaction(txReceipt);
            setDefiConfs(txReceipt.confirmations);

            // check here, if we are finished
            if (defiConfs > CONFLIMIT) {
              const res = await getLogs(txReceipt.hash, "binance");
              if (res?.DefiTx && res?.DefiTx.length > 0)
                setTransfState(TransferHistoryStatus.TRANSFER_COMPLETED);
              else {
                setFailedMessageToDisplay(
                  "This transaction could not be minted on defichain, please try again in a few minutes."
                );
                setTransfState(TransferHistoryStatus.TRANSFER_FAILED);
              }
            }
          }
        } catch (e: any) {}
      } else if (
        transfState === TransferHistoryStatus.DEFICHAIN_STEP_2_MINT &&
        (defiDeposit === null || defiDeposit.confirmations < 10)
      ) {
        await getDeposits(nonEVMReceiverAddress, "binance").then((jsonObj) => {
          if (jsonObj.status === 1) {
            if (
              jsonObj.result !== undefined &&
              jsonObj.result.data !== undefined &&
              jsonObj.result.data.length > 0
            ) {
              let index = 0;

              if (defichainDepositHash !== "") {
                // find index, as subsequent deposits may have come in
                index = -1;
                let i = 0;
                for (i = 0; i < jsonObj.result.data.length; ++i) {
                  const key = (jsonObj.result.data[i].vout?.txid +
                    ":" +
                    jsonObj.result.data[i].vout?.n) as string;
                  if (key === defichainDepositHash) {
                    index = i;
                    break;
                  }
                }
                if (index === -1) return; // something went wrong
              }

              const key =
                jsonObj.result.data[index].vout?.txid +
                ":" +
                jsonObj.result.data[0].vout?.n.toString();
              setDefiConfs(jsonObj.result.data[index].confirmations);
              setDefiDeposit(jsonObj.result.data[index]);
              setDefichainDepositHash(key);
            }
          }
        });

        console.log("Confirmations:", defiConfs);
      }
      setIsInFlight(false);
    }, 5000);
    return () => clearInterval(interval);
  }, [
    transfState,
    defiConfs,
    defiDeposit,
    defichainDepositAddress,
    defichainDepositHash,
    nonEVMReceiverAddress,
    provider,
    recoveryBurnTXID,
  ]);

  const onHandleCancel = () => {
    clearInterval(detailInter);
    if (transferSuccess) {
      onSuccess();
      onCancel();
    } else {
      onCancel();
    }
  };
  const updateRate = () => {
    dispatch(setEstimateAmtInfoInState(newEstimateAmtInfoInState));
    setTransfState(TRANSFER);
  };

  const getBigAmountModalMsg = (): string => {
    let time = "1-5 minutes";

    return `Please allow ${time} for the funds to arrive at your wallet on ${toChain?.name}.`;
  };

  const getChainInfo = (selectedChainId) => {
    return transferConfig.chains.find((chain) => chain.id === selectedChainId);
  };

  const handleAction = async () => {
    setBurnErr("");
    setContractTransaction(null);

    if (!fromChain || !toChain || !selectedToken) {
      return;
    }

    const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
    const toChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

    console.log(
      "from chain evm:",
      fromChainNonEVMMode,
      "to chain evm:",
      toChainNonEVMMode
    );

    if (fromChainNonEVMMode === NonEVMMode.defichainMainnet) {
      await getDepositAddress(nonEVMReceiverAddress, "binance")
        .then((deposit) => {
          if (!deposit || deposit.status !== 1) {
            setTransfState(TransferHistoryStatus?.TRANSFER_FAILED);
            return;
          }

          setDefichainDepositAddress(deposit.result || "");
          console.log("defichainDepositAddress =", deposit.result);
          setTransfState(TransferHistoryStatus?.DEFICHAIN_STEP_1_MINT);
        })
        .catch((_) => {
          setFailedMessageToDisplay(
            "Could not retrieve your deposit address, most likely the server is down."
          );
          setTransfState(TransferHistoryStatus?.TRANSFER_FAILED);
        });
    } else if (toChainNonEVMMode === NonEVMMode.defichainMainnet) {
      // Create burn transaction
      console.log("create burn transaction via WEB3 provider");
      setBurnWait(true);
      const res = await burnToken(
        provider,
        nonEVMReceiverAddress,
        value as BigNumber,
        "DFI"
      );
      if (res && res.err === null) {
        setContractTransaction(res.result);
        setTransfState(TransferHistoryStatus?.DEFICHAIN_STEP_1_BURN);
      } else {
        setBurnErr("The burn transaction has not gone trough.");
      }
      setBurnWait(false);
    }
  };

  const submitTransactionFromNonEVMChain = async (
    fromChainNonEVMMode: NonEVMMode
  ) => {
    setLoading(true);

    if (multiBurnConfig) {
      if (
        fromChainNonEVMMode === NonEVMMode.flowMainnet ||
        fromChainNonEVMMode === NonEVMMode.flowTest
      ) {
        submitFlowBurn(multiBurnConfig.burn_config_as_org.burn_contract_addr);
      } else if (
        fromChainNonEVMMode === NonEVMMode.terraMainnet ||
        fromChainNonEVMMode === NonEVMMode.terraTest
      ) {
        submitTerraBurn(multiBurnConfig.burn_config_as_org.token.token.address);
      }
      return;
    }

    const deposit = transferConfig.pegged_pair_configs.find((config) => {
      return (
        config.org_chain_id === fromChain?.id &&
        config.pegged_chain_id === toChain?.id &&
        config.org_token.token.symbol === selectedToken?.token.symbol
      );
    });

    const burn = transferConfig.pegged_pair_configs.find((config) => {
      return (
        config.pegged_chain_id === fromChain?.id &&
        config.org_chain_id === toChain?.id &&
        config.pegged_token.token.symbol === selectedToken?.token.symbol
      );
    });

    if (deposit) {
      if (
        fromChainNonEVMMode === NonEVMMode.flowMainnet ||
        fromChainNonEVMMode === NonEVMMode.flowTest
      ) {
        submitFlowDeposit(deposit.pegged_deposit_contract_addr);
      } else if (
        fromChainNonEVMMode === NonEVMMode.terraMainnet ||
        fromChainNonEVMMode === NonEVMMode.terraTest
      ) {
        submitTerraDeposit(deposit.pegged_deposit_contract_addr);
      }
    } else if (burn) {
      if (
        fromChainNonEVMMode === NonEVMMode.flowMainnet ||
        fromChainNonEVMMode === NonEVMMode.flowTest
      ) {
        submitFlowBurn(burn.pegged_burn_contract_addr);
      } else if (
        fromChainNonEVMMode === NonEVMMode.terraMainnet ||
        fromChainNonEVMMode === NonEVMMode.terraTest
      ) {
        submitTerraBurn(burn.pegged_token.token.address);
      }
    } else {
      setLoading(false);
    }
  };

  const submitFlowDeposit = async (flowDepositContractAddress: string) => {
    const nonce = new Date().getTime();
    const flowTokenPath = flowTokenPathConfigs.find((config) => {
      return config.Symbol === selectedToken?.token.symbol;
    });
    const depositParameter: FlowDepositParameters = {
      safeBoxContractAddress: flowDepositContractAddress,
      storagePath: flowTokenPath?.StoragePath ?? "",
      amount,
      flowAddress: nonEVMAddress,
      mintChainId: (toChain?.id ?? 0).toString(),
      evmMintAddress: nonEVMReceiverAddress,
      nonce: nonce.toString(),
      tokenAddress: selectedToken?.token.address ?? "",
    };
    await depositFromFlow(depositParameter)
      .then((response) => {
        setLoading(false);
        if (response.flowTransanctionId.length > 0) {
          setTransferSuccess(true);
          setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

          const selectedToChainToken = getTokenByChainAndTokenSymbol(
            toChain?.id,
            selectedToken?.token?.symbol
          )?.token;
          if (
            selectedToChainToken &&
            fromChain &&
            selectedToken?.token &&
            toChain
          ) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(
                  amount,
                  selectedToken?.token.decimal ?? 18
                ).toString(),
                chain: fromChain,
                token: selectedToken?.token,
              },
              src_block_tx_link: `${
                getNetworkById(fromChain?.id ?? 0).blockExplorerUrl
              }/transaction/${response.flowTransanctionId}`,
              srcAddress: depositParameter.flowAddress,
              dst_received_info: {
                amount: safeParseUnits(
                  receiveAmount.toString(),
                  selectedToChainToken?.decimal
                ).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              dstAddress: depositParameter.evmMintAddress,
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: response.transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(
              storageConstants.KEY_TRANSFER_LIST_JSON
            );
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(
              storageConstants.KEY_TRANSFER_LIST_JSON,
              JSON.stringify(localTransferList)
            );
          }
        }
      })
      .catch((_) => {
        // continue
        setLoading(false);
      });
  };

  const submitFlowBurn = async (flowBurnContractAddress: string) => {
    const nonce = new Date().getTime();
    const flowTokenPath = flowTokenPathConfigs.find((config) => {
      return config.Symbol === selectedToken?.token.symbol;
    });
    const burnParameter: FlowBurnParameters = {
      pegBridgeAddress: flowBurnContractAddress,
      storagePath: flowTokenPath?.StoragePath ?? "",
      amount,
      flowAddress: nonEVMAddress,
      withdrawChainId: (toChain?.id ?? 0).toString(),
      evmWithdrawAddress: nonEVMReceiverAddress,
      nonce: nonce.toString(),
      tokenAddress: selectedToken?.token.address ?? "",
    };

    await burnFromFlow(burnParameter)
      .then((response) => {
        setLoading(false);
        if (response.flowTransanctionId.length > 0) {
          setTransferSuccess(true);
          setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

          const selectedToChainToken = getTokenByChainAndTokenSymbol(
            toChain?.id,
            selectedToken?.token?.symbol
          )?.token;
          if (
            selectedToChainToken &&
            fromChain &&
            selectedToken?.token &&
            toChain
          ) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(
                  amount,
                  selectedToken?.token.decimal ?? 18
                ).toString(),
                chain: fromChain,
                token: selectedToken?.token,
              },
              src_block_tx_link: `${
                getNetworkById(fromChain?.id ?? 0).blockExplorerUrl
              }/transaction/${response.flowTransanctionId}`,
              srcAddress: burnParameter.flowAddress,
              dst_received_info: {
                amount: safeParseUnits(
                  receiveAmount.toString(),
                  selectedToChainToken?.decimal
                ).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              dstAddress: burnParameter.evmWithdrawAddress,
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: response.transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(
              storageConstants.KEY_TRANSFER_LIST_JSON
            );
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(
              storageConstants.KEY_TRANSFER_LIST_JSON,
              JSON.stringify(localTransferList)
            );
          }
        }
      })
      .catch((_) => {
        // continue
        setLoading(false);
      });
  };

  const submitTerraDeposit = async (canonicalContractAddress: string) => {
    if (terraWallet) {
      const nonce = new Date().getTime();
      const senderEVMCompatibleAddress = await convertTerraToCanonicalAddress(
        terraWallet.walletAddress
      );
      const terraContractAddress = await convertCanonicalToTerraAddress(
        canonicalContractAddress.toLowerCase().replace("0x", "")
      );

      const transferId = ethers.utils.solidityKeccak256(
        [
          "address",
          "address",
          "uint256",
          "uint64",
          "address",
          "uint64",
          "uint64",
        ],
        [
          senderEVMCompatibleAddress,
          selectedToken?.token?.address,
          (Number(amount) * 1000000).toString(),
          toChain?.id.toString(),
          nonEVMReceiverAddress,
          nonce.toString(),
          fromChain?.id.toString(),
        ]
      );

      terraWallet
        .post({
          msgs: [
            new MsgExecuteContract(
              terraWallet.walletAddress,
              terraContractAddress,
              {
                deposit_native: {
                  dst_chid: toChain?.id ?? 0,
                  mint_acnt: nonEVMReceiverAddress,
                  nonce,
                },
              },
              { uluna: Number(amount) * 1000000 }
            ),
          ],
        })
        .then((nextTxResult: TxResult) => {
          console.log(nextTxResult);
          setLoading(false);
          if (nextTxResult.success) {
            setTransferSuccess(true);
            setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

            const selectedToChainToken = getTokenByChainAndTokenSymbol(
              toChain?.id,
              selectedToken?.token?.symbol
            )?.token;
            if (
              selectedToChainToken &&
              fromChain &&
              selectedToken?.token &&
              toChain
            ) {
              const transferJson: TransferHistory = {
                dst_block_tx_link: "",
                src_send_info: {
                  amount: safeParseUnits(
                    amount,
                    selectedToken?.token.decimal ?? 18
                  ).toString(),
                  chain: fromChain,
                  token: selectedToken?.token,
                },
                src_block_tx_link: `${
                  getNetworkById(fromChain?.id ?? 0).blockExplorerUrl
                }/tx/${nextTxResult.result.txhash.replace("0x", "")}`,
                srcAddress: terraWallet.walletAddress,
                dst_received_info: {
                  amount: safeParseUnits(
                    receiveAmount.toString(),
                    selectedToChainToken?.decimal
                  ).toString(),
                  chain: toChain,
                  token: selectedToChainToken,
                },
                dstAddress: nonEVMReceiverAddress,
                status: TransferHistoryStatus.TRANSFER_SUBMITTING,
                transfer_id: transferId,
                ts: nonce,
                updateTime: nonce,
                nonce,
                isLocal: true,
                txIsFailed: false,
              };

              const localTransferListJsonStr = localStorage.getItem(
                storageConstants.KEY_TRANSFER_LIST_JSON
              );
              let localTransferList: TransferHistory[] = [];
              if (localTransferListJsonStr) {
                localTransferList = JSON.parse(localTransferListJsonStr) || [];
              }
              localTransferList.unshift(transferJson);
              localStorage.setItem(
                storageConstants.KEY_TRANSFER_LIST_JSON,
                JSON.stringify(localTransferList)
              );
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
          setLoading(false);
        });
      return;
    }
    setLoading(false);
  };

  const submitTerraBurn = async (canonicalTokenAddress: string) => {
    if (terraWallet) {
      const nonce = new Date().getTime();
      const senderEVMCompatibleAddress = await convertTerraToCanonicalAddress(
        terraWallet.walletAddress
      );
      const terraTokenAddress = await convertCanonicalToTerraAddress(
        canonicalTokenAddress.toLowerCase().replace("0x", "")
      );

      const transferId = ethers.utils.solidityKeccak256(
        [
          "address",
          "address",
          "uint256",
          "uint64",
          "address",
          "uint64",
          "uint64",
        ],
        [
          senderEVMCompatibleAddress,
          selectedToken?.token.address, /// selectedToken?.token?.address,
          value.toString(),
          toChain?.id.toString(),
          nonEVMReceiverAddress,
          nonce.toString(),
          fromChain?.id.toString(),
        ]
      );

      const msgInfo = {
        to_chid: toChain?.id ?? 0,
        to_acnt: nonEVMReceiverAddress,
        nonce,
      };

      const base64Msg = Buffer.from(JSON.stringify(msgInfo)).toString("base64");

      terraWallet
        .post({
          msgs: [
            new MsgExecuteContract(
              terraWallet.walletAddress,
              terraTokenAddress,
              {
                burn: {
                  msg: base64Msg,
                  amount: value.toString(),
                },
              }
            ),
          ],
        })
        .then((nextTxResult: TxResult) => {
          console.log(nextTxResult);
          setLoading(false);
          if (nextTxResult.success) {
            setTransferSuccess(true);
            setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);

            const selectedToChainToken = getTokenByChainAndTokenSymbol(
              toChain?.id,
              selectedToken?.token?.symbol
            )?.token;
            if (
              selectedToChainToken &&
              fromChain &&
              selectedToken?.token &&
              toChain
            ) {
              const transferJson: TransferHistory = {
                dst_block_tx_link: "",
                src_send_info: {
                  amount: safeParseUnits(
                    amount,
                    selectedToken?.token.decimal ?? 18
                  ).toString(),
                  chain: fromChain,
                  token: selectedToken?.token,
                },
                src_block_tx_link: `${
                  getNetworkById(fromChain?.id ?? 0).blockExplorerUrl
                }/tx/${nextTxResult.result.txhash.replace("0x", "")}`,
                srcAddress: terraWallet.walletAddress,
                dst_received_info: {
                  amount: safeParseUnits(
                    receiveAmount.toString(),
                    selectedToChainToken?.decimal
                  ).toString(),
                  chain: toChain,
                  token: selectedToChainToken,
                },
                dstAddress: nonEVMReceiverAddress,
                status: TransferHistoryStatus.TRANSFER_SUBMITTING,
                transfer_id: transferId,
                ts: nonce,
                updateTime: nonce,
                nonce,
                isLocal: true,
                txIsFailed: false,
              };

              const localTransferListJsonStr = localStorage.getItem(
                storageConstants.KEY_TRANSFER_LIST_JSON
              );
              let localTransferList: TransferHistory[] = [];
              if (localTransferListJsonStr) {
                localTransferList = JSON.parse(localTransferListJsonStr) || [];
              }
              localTransferList.unshift(transferJson);
              localStorage.setItem(
                storageConstants.KEY_TRANSFER_LIST_JSON,
                JSON.stringify(localTransferList)
              );
            }
          }
        })
        .catch((error) => {
          console.log("error", error);
          setLoading(false);
        });
      return;
    }
    setLoading(false);
  };

  const submitTransactionForOriginalVaultV2 = async () => {
    if (
      value.isZero() ||
      !transactor ||
      fromChain === undefined ||
      toChain === undefined ||
      selectedToken === undefined
    ) {
      return;
    }

    if (!originalTokenVaultV2 || originalTokenVaultV2 === undefined) {
      console.log("Warning: Original Token Vault V2 not ready");
      return;
    }

    const nonce = new Date().getTime();
    const receiverEVMCompatibleAddress =
      await convertNonEVMAddressToEVMCompatible(
        nonEVMReceiverAddress,
        nonEVMMode
      );
    const isToChainNonEVM = isNonEVMChain(toChain?.id ?? 0);

    const transferId = ethers.utils.solidityKeccak256(
      [
        "address",
        "address",
        "uint256",
        "uint64",
        "address",
        "uint64",
        "uint64",
        "address",
      ],
      [
        address,
        selectedToken?.token?.address,
        value.toString(),
        toChain?.id.toString(),
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce.toString(),
        fromChain?.id.toString(),
        originalTokenVaultV2.address,
      ]
    );

    const executor = (wrapToken: string | undefined) => {
      if (wrapToken === pegConfig.config.org_token.token.address) {
        if (isApeChain(fromChain.id)) {
          return transactor(
            // eslint-disable-next-line
            originalTokenVaultV2!.depositNative(
              value,
              pegConfig.config.pegged_chain_id,
              isToChainNonEVM ? receiverEVMCompatibleAddress : address,
              nonce,
              { value, gasPrice: 0 }
            )
          );
        }
        return transactor(
          // eslint-disable-next-line
          originalTokenVaultV2!.depositNative(
            value,
            pegConfig.config.pegged_chain_id,
            isToChainNonEVM ? receiverEVMCompatibleAddress : address,
            nonce,
            { value }
          )
        );
      }

      // force Ape chain gas price = 0;
      if (isApeChain(fromChain.id)) {
        return transactor(
          // eslint-disable-next-line
          originalTokenVaultV2!.deposit(
            pegConfig.config.org_token.token.address,
            value,
            pegConfig.config.pegged_chain_id,
            isToChainNonEVM ? receiverEVMCompatibleAddress : address,
            nonce,
            { gasPrice: 0 }
          )
        );
      }
      return transactor(
        // eslint-disable-next-line
        originalTokenVaultV2!.deposit(
          pegConfig.config.org_token.token.address,
          value,
          pegConfig.config.pegged_chain_id,
          isToChainNonEVM ? receiverEVMCompatibleAddress : address,
          nonce
        )
      );
    };

    let wrapTokenAddress;
    try {
      wrapTokenAddress = await originalTokenVaultV2?.nativeWrap();
    } catch (e) {
      console.log("wrap token not support");
    }

    try {
      setLoading(true);

      const transferTx = await executor(wrapTokenAddress).catch((_) => {
        setLoading(false); // Handle transaction rejection
        onHandleCancel();
      });
      if (transferTx) {
        setTransferSuccess(true);
        setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
        const newtxStr = JSON.stringify(transferTx);
        const newtx = JSON.parse(newtxStr);
        if (newtx.code) {
          setLoading(false);
        } else {
          const selectedToChainToken = getTokenByChainAndTokenSymbol(
            toChain?.id,
            selectedToken?.token?.symbol
          )?.token;
          if (selectedToChainToken) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(
                  amount,
                  selectedToken.token.decimal
                ).toString(),
                chain: fromChain,
                token: selectedToken.token,
              },
              src_block_tx_link: `${
                getNetworkById(fromChain.id).blockExplorerUrl
              }/tx/${transferTx.hash}`,
              dst_received_info: {
                amount: safeParseUnits(
                  receiveAmount.toString(),
                  selectedToChainToken?.decimal
                ).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              srcAddress: address,
              dstAddress: isToChainNonEVM ? nonEVMReceiverAddress : address, /// Local check only, don't use address with leading 0s. Use original address.
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(
              storageConstants.KEY_TRANSFER_LIST_JSON
            );
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(
              storageConstants.KEY_TRANSFER_LIST_JSON,
              JSON.stringify(localTransferList)
            );
          }
        }
      }
    } catch (e) {
      // Handle failure due to low gas limit setting
      console.log("e", e);
      clearInterval(detailInter);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const submitTransactionForPeggedBridgeV2 = async (
    burnTokenAddress: string
  ) => {
    if (
      value.isZero() ||
      !transactor ||
      fromChain === undefined ||
      toChain === undefined ||
      selectedToken === undefined
    ) {
      return;
    }

    if (!peggedTokenBridgeV2 || peggedTokenBridgeV2 === undefined) {
      console.log("Warning: Pegged Bridge V2 not ready");
      return;
    }

    const nonce = new Date().getTime();
    const receiverEVMCompatibleAddress =
      await convertNonEVMAddressToEVMCompatible(
        nonEVMReceiverAddress,
        nonEVMMode
      );
    const isToChainNonEVM = isNonEVMChain(toChain?.id ?? 0);

    const transferId = ethers.utils.solidityKeccak256(
      [
        "address",
        "address",
        "uint256",
        "uint64",
        "address",
        "uint64",
        "uint64",
        "address",
      ],
      [
        address,
        burnTokenAddress,
        value.toString(),
        toChain?.id.toString(),
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce.toString(),
        fromChain?.id.toString(),
        peggedTokenBridgeV2.address,
      ]
    );

    let burn;
    if (pegV2ThirdPartDeployTokens[fromChain?.id]?.includes(tokenAddress)) {
      burn = peggedTokenBridgeV2.burnFrom(
        burnTokenAddress,
        value,
        toChain?.id ?? 0,
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce
      );
    } else {
      burn = peggedTokenBridgeV2.burn(
        burnTokenAddress,
        value,
        toChain?.id ?? 0,
        isToChainNonEVM ? receiverEVMCompatibleAddress : address,
        nonce
      );
    }

    try {
      setLoading(true);
      const transferTx = await transactor(burn).catch((_) => {
        setLoading(false); // Handle transaction rejection
        onHandleCancel();
      });

      console.log("transferTx", transferTx);
      if (transferTx) {
        setTransferSuccess(true);
        setTransfState(TransferHistoryStatus?.TRANSFER_COMPLETED);
        const newtxStr = JSON.stringify(transferTx);
        const newtx = JSON.parse(newtxStr);
        if (newtx.code) {
          setLoading(false);
        } else {
          const selectedToChainToken = getTokenByChainAndTokenSymbol(
            toChain?.id,
            selectedToken?.token?.symbol
          )?.token;
          if (selectedToChainToken) {
            const transferJson: TransferHistory = {
              dst_block_tx_link: "",
              src_send_info: {
                amount: safeParseUnits(
                  amount,
                  selectedToken.token.decimal
                ).toString(),
                chain: fromChain,
                token: selectedToken.token,
              },
              src_block_tx_link: `${
                getNetworkById(fromChain.id).blockExplorerUrl
              }/tx/${transferTx.hash}`,
              dst_received_info: {
                amount: safeParseUnits(
                  receiveAmount.toString(),
                  selectedToChainToken?.decimal
                ).toString(),
                chain: toChain,
                token: selectedToChainToken,
              },
              srcAddress: address,
              dstAddress: isToChainNonEVM ? nonEVMReceiverAddress : address, /// Local check only, don't use address with leading 0s. Use original address.
              status: TransferHistoryStatus.TRANSFER_SUBMITTING,
              transfer_id: transferId,
              ts: nonce,
              updateTime: nonce,
              nonce,
              isLocal: true,
              txIsFailed: false,
            };

            const localTransferListJsonStr = localStorage.getItem(
              storageConstants.KEY_TRANSFER_LIST_JSON
            );
            let localTransferList: TransferHistory[] = [];
            if (localTransferListJsonStr) {
              localTransferList = JSON.parse(localTransferListJsonStr) || [];
            }
            localTransferList.unshift(transferJson);
            localStorage.setItem(
              storageConstants.KEY_TRANSFER_LIST_JSON,
              JSON.stringify(localTransferList)
            );
          }
        }
      }
    } catch (e) {
      // Handle failure due to low gas limit setting
      console.log("e", e);
      clearInterval(detailInter);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  let titleText = "Transfer";
  let content;

  if (transfState === BRIDGE_RATE_UPDATED) {
    content = (
      <>
        <TransDetail
          amount={amount}
          receiveAmount={receiveAmount}
          receiverAddress={nonEVMReceiverAddress}
        />
        <div className={classes.modalTop}>
          <div className={classes.transferde2}>
            <div className={classes.warningInnerbody}>
              <div>
                <WarningFilled
                  style={{ fontSize: 20, marginRight: 5, color: "#ff8f00" }}
                />
                <span style={{ color: "#17171A" }}>Bridge Rate Updated</span>
              </div>
              <div
                style={{ color: "#3366FF", cursor: "pointer" }}
                onClick={() => {
                  updateRate();
                }}
              >
                Accept
              </div>
            </div>
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          onClick={() => {}}
          className={classes.button}
          disabled
        >
          Confirm Transfer
        </Button>
      </>
    );
  } else if (transfState === TransferHistoryStatus?.TRANSFER_COMPLETED) {
    // Relay - check your fund
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
          <img
            src={themeType === "dark" ? arrTop : arrTopLightIcon}
            height="120"
            alt=""
          />
        </div>
        <div className={classes.modalToptext2}>Transfer Submitted.</div>
        <div className={classes.modaldes}>{getBigAmountModalMsg()}</div>
        <Button
          type="primary"
          size="large"
          block
          // loading={loading}
          onClick={() => {
            setTransfState(TRANSFER);
            onSuccess();
            onHandleCancel();
          }}
          className={classes.button}
        >
          Done
        </Button>
      </div>
    );
    titleText = "";
  } else if (transfState === TransferHistoryStatus?.TRANSFER_FAILED) {
    // Relay - check your fund
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 80 }}>
          <img src={errorLogo} height="120" alt="" />
        </div>
        <div className={classes.modalToptext2}>Transfer Failed.</div>
        <div className={classes.modaldes}>{failedMessageToDisplay}</div>
        <Button
          type="primary"
          size="large"
          block
          // loading={loading}
          onClick={() => {
            setTransfState(TRANSFER);
            onSuccess();
            onHandleCancel();
          }}
          className={classes.button}
        >
          Close
        </Button>
      </div>
    );
    titleText = "";
  } else if (transfState === TransferHistoryStatus?.DEFICHAIN_STEP_1_MINT) {
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 14 }}>
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 256,
              width: "100%",
            }}
          >
            <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={defichainDepositAddress}
              viewBox={`0 0 256 256`}
            />
          </div>
        </div>
        <div className={classes.modalToptext2}>
          Deposit {formatDecimalPart(amount || "0", 8, "round", true)}{" "}
          {selectedToken?.token.symbol} to your deposit address on Defichain:
        </div>
        <div className={classes.recipientContainer}>
          <div className={classes.recipientDescText}>
            {defichainDepositAddress}
          </div>
        </div>
        <div className={classes.modaldes}>
          You can also deposit a different amount, just bear in mind that the
          fee estimations from the last step will no longer be correct
        </div>
        <Button
          type="primary"
          size="large"
          // loading={loading}
          onClick={() => {
            setDefiDeposit(null);
            setDefiConfs(0);
            setDefichainDepositHash("");
            setDefichainGeneratingSignatures(false);
            setTransfState(TransferHistoryStatus.DEFICHAIN_STEP_2_MINT);
          }}
          className={classes.button}
        >
          Continue (after payment made)
        </Button>
      </div>
    );
  } else if (transfState === TransferHistoryStatus?.DEFICHAIN_STEP_2_MINT) {
    const WARNING_THRESHOLD = 8;
    const ALERT_THRESHOLD = 2;
    const CONFLIMIT = 10;

    const confClass = (confs) => {
      if (confs < ALERT_THRESHOLD) {
        return classes.red;
      }
      if (confs < WARNING_THRESHOLD) {
        return classes.orange;
      }
      return classes.green;
    };
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 14 }}>
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 256,
              width: "100%",
            }}
          >
            <div className={classes.baseTimer}>
              <svg
                className={classes.baseTimerSvg}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g className={classes.baseTimerCircle}>
                  <circle
                    className={classes.baseTimerPath}
                    cx="50"
                    cy="50"
                    r="45"
                  ></circle>
                  <path
                    id={classes.baseTimerPathRem}
                    stroke-dasharray={
                      (Math.max(Math.min(defiConfs, CONFLIMIT), 0) / 10) * 283 +
                      " " +
                      283
                    }
                    className={
                      classes.baseTimerPathRem + " " + confClass(defiConfs)
                    }
                    d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
                  ></path>
                </g>
              </svg>
              <span id="base-timer-label" className={classes.baseTimerLabel}>
                {Math.max(Math.min(defiConfs, CONFLIMIT), 0)} of {CONFLIMIT}
              </span>
            </div>
          </div>
        </div>
        <div className={classes.modalToptext3}>
          Waiting for your deposit to be confirmed on Defichain:
        </div>
        <div className={classes.recipientContainer}>
          <div className={classes.recipientDescText2}>
            {defichainDepositHash === ""
              ? "Waiting for the transaction to be broadcast in the network ..."
              : "Received " +
                defiDeposit.vout.value +
                " DFI via transaction " +
                defichainDepositHash.substring(0, 12) +
                "..."}
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          loading={
            Math.min(defiConfs, CONFLIMIT) < CONFLIMIT ||
            defichainGeneratingSignatures
          }
          block
          // loading={loading}
          onClick={async () => {
            try {
              setMintErr("");
              setDefichainGeneratingSignatures2(false);
              setDefichainGeneratingSignatures(true);
              const sign = await getKeySignatures(
                nonEVMReceiverAddress,
                defichainDepositHash.split(":")[0],
                parseInt(defichainDepositHash.split(":")[1]),
                "binance"
              );
              console.log(sign);

              const signed_json = JSON.parse(sign["signed_json"]);
              const r = "0x" + sign["signatures"][0]["r"] || "";
              const s = "0x" + sign["signatures"][0]["s"] || "";
              const v = sign["signatures"][0]["recovery_id"] === "00" ? 0 : 1;

              setDefichainGeneratingSignatures2(true);
              setIsInFlight(true);
              let res: any = await getSignatures(
                provider,
                nonEVMReceiverAddress,
                defichainDepositHash.split(":")[0],
                parseInt(defichainDepositHash.split(":")[1]),
                signed_json.amount,
                "DFI",
                r,
                s,
                v + 27
              );
              setIsInFlight(false);
              console.log("getSignatures() returned:");
              console.log(res);
              if (res.err !== null && res.err?.code !== 0) {
                console.log("Mint error: " + res.err?.message);
                setMintErr(res.err?.message as string);
              } else {
                setMintErr("");
                setTransfState(TransferHistoryStatus.TRANSFER_COMPLETED);
              }
            } catch (e) {
              setDefichainGeneratingSignatures(false);
              setMintErr((e as any).toString());
            }
            setDefichainGeneratingSignatures(false);
            setDefichainGeneratingSignatures2(false);
          }}
          className={classes.button}
        >
          {Math.min(defiConfs, CONFLIMIT) < CONFLIMIT
            ? "Waiting for confirmations ..."
            : !defichainGeneratingSignatures
            ? "Mint DFI on Binance Chain"
            : !defichainGeneratingSignatures2
            ? "Generating Decentralised Signatures ..."
            : "Submitting Mint Transaction ..."}
        </Button>
        {mintErr && generateErrMsg(classes, mintErr)}

        <Block
          classes={classes}
          title="Rescue Function: Enter the TXID manually"
          isOpen={toggled}
          onToggle={() => {
            console.log("Setting toggled to", !toggled);
            setToggled(!toggled);
            setRecErr("");
          }}
        >
          <div className={classes.recipientContainer}>
            <div className={classes.recipientDescText3}>
              <div className={classes.transndes}>
                <div className={classes.nonEvmAddressText}>
                  <TokenInputAny
                    placeholderText="Please enter your deposit TXID"
                    onChange={(e) => {
                      setRecoveryTXID(e.value);
                    }}
                    disabled={false}
                  />
                </div>
              </div>
              <Button
                type="primary"
                size="large"
                loading={isRecovering}
                onClick={async () => {
                  // try to recover sigs from server
                  setRecErr("");
                  setIsRecovering(true);
                  await getTransactionN(
                    defichainDepositAddress || "",
                    recoveryTXID
                  )
                    .then((n) => {
                      console.log("found n:", n);
                      const fakeReceipt: any = {
                        vout: { value: (n as any).satoshi },
                        confirmations: 10,
                      };
                      setDefiConfs(10);
                      setDefiDeposit(fakeReceipt);
                      setDefichainDepositHash(
                        recoveryTXID + ":" + (n as any).n.toString()
                      );

                      setToggled(false);
                    })
                    .catch((reason) => {
                      setRecErr(reason);
                      return;
                    });
                  setIsRecovering(false);
                }}
                className={classes.buttonSmaller}
                style={{ marginTop: 0 }}
              >
                Try Recover
              </Button>
            </div>
          </div>
          {recErr && generateErrMsg(classes, recErr)}
        </Block>
      </div>
    );
  } else if (transfState === TransferHistoryStatus?.DEFICHAIN_STEP_1_BURN) {
    const WARNING_THRESHOLD = 8;
    const ALERT_THRESHOLD = 2;
    const CONFLIMIT = 10;

    const confClass = (confs) => {
      if (confs < ALERT_THRESHOLD) {
        return classes.red;
      }
      if (confs < WARNING_THRESHOLD) {
        return classes.orange;
      }
      return classes.green;
    };
    content = (
      <div>
        <div className={classes.modalTopIcon} style={{ marginTop: 14 }}>
          <div
            style={{
              height: "auto",
              margin: "0 auto",
              maxWidth: 256,
              width: "100%",
            }}
          >
            <div className={classes.baseTimer}>
              <svg
                className={classes.baseTimerSvg}
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g className={classes.baseTimerCircle}>
                  <circle
                    className={classes.baseTimerPath}
                    cx="50"
                    cy="50"
                    r="45"
                  ></circle>
                  <path
                    id={classes.baseTimerPathRem}
                    stroke-dasharray={
                      (Math.min(defiConfs, CONFLIMIT) / 10) * 283 + " " + 283
                    }
                    className={
                      classes.baseTimerPathRem + " " + confClass(defiConfs)
                    }
                    d="
          M 50, 50
          m -45, 0
          a 45,45 0 1,0 90,0
          a 45,45 0 1,0 -90,0
        "
                  ></path>
                </g>
              </svg>
              <span id="base-timer-label" className={classes.baseTimerLabel}>
                {Math.max(Math.min(defiConfs, CONFLIMIT), 0)} of {CONFLIMIT}
              </span>
            </div>
          </div>
        </div>
        <div className={classes.modalToptext3}>
          Waiting for your burn to be confirmed on the network:
        </div>
        <div className={classes.recipientContainer}>
          <div className={classes.recipientDescText2}>
            {defichainDepositHash === ""
              ? "Waiting for the transaction to be broadcast in the network ..."
              : "Burning " + value + " DFI on Binance Smart Chain"}
          </div>
        </div>
      </div>
    );
  } else {
    const isToChainNonEVM = isNonEVMChain(toChain?.id ?? 0);
    content = (
      <>
        <TransDetail
          amount={amount}
          receiveAmount={receiveAmount}
          receiverAddress={nonEVMReceiverAddress}
        />
        <div className={classes.modalTop} hidden={arrivalGasTokenAmount.lte(0)}>
          <div className={classes.transferdes}>
            You will also receive{" "}
            <span style={{ color: "#ff8f00" }}>
              {arrivalGasTokenAmountDisplay} {arrivalGasTokenSymbol}
            </span>{" "}
            to pay gas fee on {toChain?.name}
          </div>
        </div>
        <Button
          type="primary"
          size="large"
          block
          loading={loading || burnWait}
          onClick={() => {
            handleAction();
          }}
          className={classes.button}
          style={{ marginTop: 0 }}
        >
          Confirm Transfer
        </Button>
        {burnErr && generateErrMsg(classes, burnErr)}

        {isToChainNonEVM && (
          <Block
            classes={classes}
            title="Rescue Function: Enter the TXID manually"
            isOpen={toggled}
            onToggle={() => {
              console.log("Setting toggled to", !toggled);
              setToggled(!toggled);
              setRecErr("");
            }}
          >
            <div className={classes.recipientContainer}>
              <div className={classes.recipientDescText3}>
                <div className={classes.transndes}>
                  <div className={classes.nonEvmAddressText}>
                    <TokenInputAny
                      placeholderText="Please enter your deposit TXID"
                      onChange={(e) => {
                        setRecoveryBurnTXID(e.value);
                      }}
                      disabled={false}
                    />
                  </div>
                </div>
                <Button
                  type="primary"
                  size="large"
                  loading={isRecoveringBurn}
                  onClick={async () => {
                    // try to recover sigs from server
                    setBurnErr("");
                    setIsRecoveringBurn(true);
                    try {
                      const txReceipt = await provider?.getTransaction(
                        recoveryBurnTXID
                      );
                      if (txReceipt == null) {
                        setBurnErr(
                          "This transaction is unknown on the network"
                        );
                      } else {
                        console.log(txReceipt);
                        setContractTransaction(txReceipt);
                        setDefiConfs(0);
                        setTransfState(
                          TransferHistoryStatus?.DEFICHAIN_STEP_1_BURN
                        );
                        setToggled(false);
                      }
                    } catch (e: any) {
                      setBurnErr(e.toString());
                    }
                    setIsRecoveringBurn(false);
                  }}
                  className={classes.buttonSmaller}
                  style={{ marginTop: 0 }}
                >
                  Try Recover
                </Button>
              </div>
            </div>
            {recErr && generateErrMsg(classes, recErr)}
          </Block>
        )}
      </>
    );
  }
  return (
    <Modal
      title={titleText}
      onCancel={onHandleCancel}
      visible={showTransferModal}
      footer={null}
      className={classes.transferModal}
      maskClosable={false}
    >
      {content}
    </Modal>
  );
};

export default TransferModal;
