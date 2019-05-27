import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import AppBar from "@material-ui/core/AppBar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import PowerSettingsNew from "@material-ui/icons/PowerSettingsNew";
import { Toolbar } from "@material-ui/core";
import { fade } from "@material-ui/core/styles/colorManipulator";
import { withStyles } from "@material-ui/core/styles";
import firebase from "../../../Firebase";
const styles = theme => ({
  appBar: {
    backgroundColor: "#5a5255",
    color: "#fffff",
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    // marginLeft: theme.drawer.width,
    width: `calc(100% - ${theme.drawer.width}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  root: {
    width: "100%"
  },
  grow: {
    flexGrow: 1
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    }
  }
});
const logoutHandler = () => {
  firebase
    .auth()
    .signOut()
    .then(
      () => {
        console.log("Log out succesfull");
      },
      error => {
        console.log("Error logging out");
      }
    );
};
class CDPO_ACDPOHeader extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null
    };
  }

  handleProfileMenuOpen = event => {
    this.setState({
      anchorEl: event.currentTarget
    });
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget
    });
  };

  handleMobileMenuClose = () => {
    this.setState({
      mobileMoreAnchorEl: null
    });
  };

  render() {
    const { handleChangeNavDrawer, classes, navDrawerOpen } = this.props;
    return (
      <div>
        <AppBar
          className={classNames(classes.appBar, {
            [classes.appBarShift]: navDrawerOpen
          })}
        >
          <Toolbar>
            <IconButton
              className={classes.menuButton}
              color="inherit"
              aria-label="Open drawer"
              onClick={handleChangeNavDrawer}
            >
              <MenuIcon />
            </IconButton>
            <div className={classes.grow} />{" "}
            <IconButton
              aria-haspopup="true"
              onClick={() => logoutHandler()}
              color="inherit"
            >
              <PowerSettingsNew />
            </IconButton>
          </Toolbar>{" "}
        </AppBar>{" "}
      </div>
    );
  }
}

{
  /* <ListItem button style={style2} onClick={() => logoutHandler()}>
Log out
</ListItem> */
}
CDPO_ACDPOHeader.propTypes = {
  styles: PropTypes.object,
  handleChangeNavDrawer: PropTypes.func,
  classes: PropTypes.object,
  navDrawerOpen: PropTypes.bool
};

export default withStyles(styles)(CDPO_ACDPOHeader);
