// eslint-disable-next-line
export enum FeatureSupported {
  TRANSFER = "Transfer",
  NFT = "NFT",
  BOTH = "BOTH",
  TRANSFERR = "TransferAndReserves",
  NFTR = "NFTAndReserves",
  BOTHR = "BOTHAndReserves",
}

export const getSupportedFeatures = (): FeatureSupported => {
  const featureSupported = process.env.REACT_APP_FEATURES_SUPPORTED;
  const transferSupported = featureSupported
    ?.toLowerCase()
    .includes("transfer");
  const nftSupported = featureSupported?.toLowerCase().includes("nft");
  const porSupported = featureSupported
    ?.toLowerCase()
    .includes("proofofreserves");

  if (transferSupported && nftSupported) {
    return porSupported ? FeatureSupported.BOTHR : FeatureSupported.BOTH;
  }

  if (transferSupported) {
    return porSupported
      ? FeatureSupported.TRANSFERR
      : FeatureSupported.TRANSFER;
  }

  if (nftSupported) {
    return porSupported ? FeatureSupported.NFTR : FeatureSupported.NFT;
  }

  return FeatureSupported.TRANSFER;
};
