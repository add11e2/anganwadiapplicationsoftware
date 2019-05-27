import React from "react";
import "./SideDrawer.css";
import Divider from "@material-ui/core/Divider";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Collapse from "@material-ui/core/Collapse";
import Group from "@material-ui/icons/Group";
import Help from "@material-ui/icons/Help";
import Home from "@material-ui/icons/Home";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Person from "@material-ui/icons/Person";

const styles = theme => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  nested: {
    paddingLeft: theme.spacing.unit * 4
  },
  text: {
    color: "#275DAD"
  },
  topimage: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "red"
  }
});

class SideDrawer extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props);
  }
  state = { open: false };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  render() {
    const { classes } = this.props;
    console.log(this.props.show);
    let drawerClasses = "side-drawer";
    if (this.props.show) {
      drawerClasses = "side-drawer open";
    }
    return (
      <nav className={drawerClasses} style={styles.root}>
        <img
          src={require("./anglogo.png")}
          style={styles.topimage}
          width="100%"
        />
        <Divider />
        <List component="nav">
          <ListItem button component="a" href="/">
            <ListItemIcon>
              <Home
                style={{
                  color: "#275DAD"
                }}
              />
            </ListItemIcon>

            <ListItemText
              inset
              primary={
                <Typography style={{ color: "#275DAD", fontSize: 16 }}>
                  Home
                </Typography>
              }
            />
          </ListItem>

          <ListItem button onClick={this.handleClick}>
            <ListItemIcon>
              <Group
                style={{
                  color: "#275DAD"
                }}
              />
            </ListItemIcon>
            <ListItemText
              inset
              primary={
                <Typography style={{ color: "#275DAD", fontSize: 16 }}>
                  Users
                </Typography>
              }
            />
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={this.state.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem
                button
                component="a"
                href="ceodddc/login"
                className={classes.nested}
              >
                <ListItemIcon>
                  <Person
                    style={{
                      color: "#275DAD"
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={
                    <Typography style={{ color: "#275DAD", fontSize: 16 }}>
                      CEO/DD/DC
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                component="a"
                href="cdpoacdpo/login"
                className={classes.nested}
              >
                <ListItemIcon>
                  <Person
                    style={{
                      color: "#275DAD"
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={
                    <Typography style={{ color: "#275DAD", fontSize: 16 }}>
                      CDPO/ACDPO
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem
                button
                component="a"
                href="supervisor/login"
                className={classes.nested}
              >
                <ListItemIcon>
                  <Person
                    style={{
                      color: "#275DAD"
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  inset
                  primary={
                    <Typography style={{ color: "#275DAD", fontSize: 16 }}>
                      Supervisor
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Collapse>
          <ListItem button>
            <ListItemIcon>
              <Help
                style={{
                  color: "#275DAD"
                }}
              />
            </ListItemIcon>
            <ListItemText
              inset
              primary={
                <Typography style={{ color: "#275DAD", fontSize: 16 }}>
                  Help
                </Typography>
              }
            />
          </ListItem>
        </List>
      </nav>
    );
  }
}

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SideDrawer);
