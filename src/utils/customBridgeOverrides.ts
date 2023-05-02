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

  console.log(
    "From EVM Mode:",
    fromChainNonEVMMode,
    "To EVM Mode:",
    dstChainNonEVMMode
  );
  if (fromChainNonEVMMode === NonEVMMode.defichainMainnet) {
    const url = `${process.env.REACT_APP_DEFICHAIN_BRIDGE_API_URL}`;
    return fetch(url + "/fees")
      .then((response) => response.json())
      .then((responseJson) => {
        let valbn = BigNumber.from(value);
        // scaler
        const scaleUp = BigNumber.from(10).pow(
          // THIS DOESNT WORK BigNumber.from(Math.max(targetToken?.token?.decimal - 8, 0))
          // TODO: Ugly hack
          10
        );
        valbn = valbn.mul(scaleUp);
        console.log("Scaler Up: " + scaleUp.toString());
        const thoubn = BigNumber.from(1000);
        const netfee = BigNumber.from(1000000).mul(scaleUp);
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
  } else if (dstChainNonEVMMode === NonEVMMode.defichainMainnet) {
    const url = `${process.env.REACT_APP_DEFICHAIN_BRIDGE_API_URL}`;
    return fetch(url + "/fees")
      .then((response) => response.json())
      .then((responseJson) => {
        let valbn = BigNumber.from(value);
        // scaler
        const scaleDown = BigNumber.from(10).pow(
          BigNumber.from(Math.max(targetToken?.token?.decimal - 8, 0))
        );
        console.log("Scaler: " + scaleDown.toString());
        valbn = valbn.div(scaleDown);

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
