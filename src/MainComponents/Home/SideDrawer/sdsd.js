import React from "react";

import "./SideDrawer.css";
import Home from "@material-ui/icons/Home";
import Person from "@material-ui/icons/Person";
import Help from "@material-ui/icons/Help";
import Group from "@material-ui/icons/Group";

const sideDrawer = props => {
  let drawerClasses = "side-drawer";
  if (props.show) {
    drawerClasses = "side-drawer open";
  }
  return (
    <nav className={drawerClasses}>
      <ul>
        <li>
          <Home
            style={{
              color: "#275DAD",
              display: "inline-flex",
              verticalAlign: "top"
            }}
          />{" "}
          <a href="/">Home</a>
        </li>
        <li>
          <Group
            style={{
              color: "#275DAD",
              display: "inline-flex",
              verticalAlign: "top"
            }}
          />{" "}
          <a href="/">Users</a>
          <ul>
            <li>
              <Person
                style={{
                  color: "#275DAD",
                  display: "inline-flex",
                  verticalAlign: "top"
                }}
              />{" "}
              <a href="/">DC/CEO/DD</a>
            </li>
            <li>
              <Person
                style={{
                  color: "#275DAD",
                  display: "inline-flex",
                  verticalAlign: "top"
                }}
              />{" "}
              <a href="/">CDPO/ACDPO</a>
            </li>
            <li>
              <Person
                style={{
                  color: "#275DAD",
                  display: "inline-flex",
                  verticalAlign: "top"
                }}
              />{" "}
              <a href="/">Supervisor</a>
            </li>
          </ul>
        </li>
        <li>
          <Help
            style={{
              color: "#275DAD",
              display: "inline-flex",
              verticalAlign: "top"
            }}
          />{" "}
          <a href="/">Help</a>
        </li>
      </ul>
    </nav>
  );
};

export default sideDrawer;
