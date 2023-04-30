import { NonEVMMode, getNonEVMMode } from "../providers/NonEVMContextProvider";
import { BigNumber } from "@ethersproject/bignumber";

const customOverrideEstimateAmt = (
  fromChain,
  toChain,
  targetToken,
  value,
  addr,
  rate
) => {
  const fromChainNonEVMMode = getNonEVMMode(fromChain?.id ?? 0);
  const dstChainNonEVMMode = getNonEVMMode(toChain?.id ?? 0);

  if (
    fromChainNonEVMMode === NonEVMMode.defichainMainnet ||
    dstChainNonEVMMode === NonEVMMode.defichainMainnet
  ) {
    const url = `${process.env.REACT_APP_DEFICHAIN_BRIDGE_API_URL}`;
    return fetch(url + "/fees")
      .then((response) => response.json())
      .then((responseJson) => {
        const valbn = BigNumber.from(value);
        const thoubn = BigNumber.from(1000);
        const netfee = BigNumber.from(1000000);
        const frbn = BigNumber.from(responseJson.result.fee_rate);
        const fee = valbn.mul(frbn).div(thoubn);

        responseJson.result.value = valbn.sub(fee).sub(netfee).toString();
        responseJson.result.absolute_fee = fee.toString();
        responseJson.result.network_fee = netfee.toString();
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    throw new Error("Implement this trading pair in customBridgeOverrides.ts");
  }
};

export { customOverrideEstimateAmt };
