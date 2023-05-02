import { Button, Dropdown, Menu, Typography } from "antd";
import { createUseStyles } from "react-jss";
import { alpha2Hex } from "../helpers/alpha2Hex";
import { Theme } from "../theme";
import { useAppSelector } from "../redux/store";
const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>(
  (theme: Theme) => ({
    addressBtn: {
      marginLeft: (props) => (props.isMobile ? 0 : 8),
      height: (props) => (props.isMobile ? 22 : 44),
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: (props) =>
        props.isMobile ? theme.primaryBackground : theme.secondBackground,
      transition: "none !important",
      backdropFilter: "blur(20px)",
      border: "none",
      borderRadius: 12,
      minWidth: 50,
      fontWeight: (props) => (props.isMobile ? 400 : 700),
      padding: (props) => (props.isMobile ? "0px 8px" : ""),
      "& .ant-typography": {
        width: (props) => (props.isMobile ? 100 : 120),
        color: theme.surfacePrimary,
        "&:hover": {
          color: theme.unityWhite,
        },
      },
      "&:hover": {
        background: theme.buttonHover,
        color: theme.unityWhite,
        "& .ant-typography": {
          color: theme.unityWhite,
        },
      },
    },

    buttonText: {
      position: "relative",
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },

    connectBtn: {
      marginLeft: 8,
      height: 44,
      background: theme.secondBackground,
      backdropFilter: "blur(20px)",
      border: "none",
      borderRadius: 12,
      fontSize: 14,
      fontWeight: 700,
      lineHeight: "16px",
      "& .ant-typography": {
        width: 120,
        color: theme.surfacePrimary,
      },
      "&:hover": {
        background: theme.buttonHover,
        color: theme.unityWhite,
      },
      "&::before": {
        backgroundColor: `${theme.primaryBrand} !important`,
      },
    },
    dropDownMenu: {
      background: theme.secondBackground,
      borderRadius: "12px",
      padding: 0,
      "& .ant-dropdown-menu-item-active": {
        color: theme.surfacePrimary + alpha2Hex(70),
        background: theme.secondBackground,
      },
    },
    logoutBtn: {
      color: theme.surfacePrimary,
      textAlign: "center",
      borderRadius: "12px",
      fontSize: 14,
      fontWeight: 700,
      padding: "10px",
    },
    indicator: {
      verticalAlign: "middle",
      marginLeft: 8,
      color: theme.surfacePrimary,
    },
  })
);

export const NiceInfos = () => {
  const { isMobile } = useAppSelector((state) => state.windowWidth);
  const classes = useStyles({ isMobile });

  const menu = (
    <Menu className={classes.dropDownMenu}>
      <Menu.Item
        className={classes.logoutBtn}
        key="reserves"
        onClick={() =>
          window.open(
            "https://defiscan.live/address/8Jgfq4pBUdJLiFGStunoTCy2wqRQphP6bQ"
          )
        }
      >
        Funds Reserves
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="smconstract"
        onClick={() =>
          window.open(
            "https://bscscan.com/address/0x3961a7b7d2ceb33ad5740624901f6264023c9ac0"
          )
        }
      >
        Minting Smart Contract
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="bsctoken"
        onClick={() =>
          window.open(
            "https://bscscan.com/token/0x361c60b7c2828fcab80988d00d1d542c83387b50"
          )
        }
      >
        DFI Token on BSC
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="pkpool"
        onClick={() =>
          window.open(
            "https://pancakeswap.finance/swap?outputCurrency=0x361C60b7c2828fCAb80988d00D1D542c83387b50"
          )
        }
      >
        Pancake Swap Pool (BNB)
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="pkpool2"
        onClick={() =>
          window.open(
            "https://pancakeswap.finance/swap?outputCurrency=0x361C60b7c2828fCAb80988d00D1D542c83387b50&inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
          )
        }
      >
        Pancake Swap Pool (BUSD)
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="acsi"
        onClick={() => window.open("https://app.acsi.finance/#/trade")}
      >
        ACSI Finance Pool
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="tos"
        onClick={() => window.open("https://defichain-bridge.com/tos.pdf")}
      >
        Terms of Service
      </Menu.Item>
      <Menu.Item
        className={classes.logoutBtn}
        key="git"
        onClick={() => window.open("https://github.com/muirglacier/bridgev2")}
      >
        Github Repository
      </Menu.Item>
    </Menu>
  );
  https: return (
    <Dropdown overlay={menu} trigger={["click", "hover"]}>
      <Button className={classes.connectBtn} type="primary">
        Resources
        <span className={classes.indicator}>▾</span>
      </Button>
    </Dropdown>
  );
};
