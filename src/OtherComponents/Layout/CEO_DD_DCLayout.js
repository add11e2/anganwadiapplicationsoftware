import React from "react";
import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Header from "../../MainComponents/CEO_DD_DC/CEO_DD_DCComponents/CEO_DD_DCHeader";
import LeftDrawer from "../../MainComponents/CEO_DD_DC/CEO_DD_DCComponents/CEO_DD_DCLeftDrawer";
import Data from "../../MainComponents/CEO_DD_DC/CEO_DD_DCComponents/CEO_DD_DCdata";
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import defaultTheme, {
  customTheme
} from "../../MainComponents/CEO_DD_DC/CEO_DD_DCComponents/CEO_DD_DCtheme";

const styles = () => ({
  container: {
    margin: "80px 20px 20px 15px",
    height: "100vh",
    paddingLeft: defaultTheme.drawer.width,
    [defaultTheme.breakpoints.down("sm")]: {
      paddingLeft: 0
    }
    // width: `calc(100% - ${defaultTheme.drawer.width}px)`
  },
  containerFull: {
    height: "100vh",
    paddingLeft: defaultTheme.drawer.miniWidth,
    [defaultTheme.breakpoints.down("sm")]: {
      paddingLeft: 0
    }
  },
  settingBtn: {
    top: 80,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    color: "white",
    width: 48,
    right: 0,
    height: 48,
    opacity: 0.9,
    padding: 0,
    zIndex: 999,
    position: "fixed",
    minWidth: 48,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  }
});

class CEO_DD_DCLayout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      theme: defaultTheme,
      rightDrawerOpen: false,
      navDrawerOpen:
        window &&
        window.innerWidth &&
        window.innerWidth >= defaultTheme.breakpoints.values.md
          ? true
          : false
    };

    this.handleChangeNavDrawer = this.handleChangeNavDrawer.bind(this);
    this.handleChangeTheme = this.handleChangeTheme.bind(this);
  }

  handleChangeNavDrawer() {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen
    });
  }

  handleChangeTheme(colorOption) {
    const theme = customTheme({
      palette: colorOption
    });
    this.setState({
      theme
    });
  }

  render() {
    // console.log(this.props, "sdesd");
    const { classes } = this.props;
    const { navDrawerOpen, theme } = this.state;
    return (
      <MuiThemeProvider theme={theme}>
        <Header
          handleChangeNavDrawer={this.handleChangeNavDrawer}
          navDrawerOpen={navDrawerOpen}
        />{" "}
        <LeftDrawer
          navDrawerOpen={navDrawerOpen}
          handleChangeNavDrawer={this.handleChangeNavDrawer}
          menus={Data.menus}
        />{" "}
        <div
          className={classNames(
            classes.container,
            !navDrawerOpen && classes.containerFull
          )}
        >
          {this.props.children}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(CEO_DD_DCLayout);
