import { Button, Dropdown, Menu, Typography } from "antd";
import { createUseStyles } from "react-jss";
import { alpha2Hex } from "../helpers/alpha2Hex";
import { Theme } from "../theme";
import { useAppSelector } from "../redux/store";
import TLogo from "../images/telegram.svg";

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

export const Telegram = () => {
  const { isMobile } = useAppSelector((state) => state.windowWidth);
  const classes = useStyles({ isMobile });

  return (
    <Button
      className={classes.connectBtn}
      type="primary"
      onClick={() => window.open("https://t.me/defichain_bridge")}
    >
      <img
        src={TLogo}
        style={{ width: "85%", height: "85%" }}
        alt="Telegram Support"
      />
    </Button>
  );
};
