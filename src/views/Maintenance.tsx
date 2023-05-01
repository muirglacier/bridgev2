import { createUseStyles } from "react-jss";
import { Theme } from "../theme";
import { useAppSelector } from "../redux/store";

const useStyles = createUseStyles<string, { isMobile: boolean }, Theme>(
  (theme: Theme) => ({
    center: {
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  })
);
export const Maintenance = () => {
  const { isMobile } = useAppSelector((state) => state.windowWidth);
  const classes = useStyles({ isMobile });
  return (
    <div className={classes.center}>
      <h1 style={{ color: "#ffffff", fontSize: "10vh" }}>Maintenance Mode!</h1>
    </div>
  );
};
