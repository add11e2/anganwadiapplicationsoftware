import React from "react";
import Person from "@material-ui/icons/Person";
import DrawerToggleButton from "../SideDrawer/DrawerToggleButton";
import "./Toolbar.css";

const toolbar = props => (
  <header className="toolbar">
    <nav className="toolbar__navigation">
      <div className="toolbar__toggle-button">
        <DrawerToggleButton click={props.drawerClickHandler} />
      </div>
      <div className="toolbar__logo">
        <a href="/">
          <img
            height="45"
            width="45"
            src={require("../../../Resources/Images/logo.png")}
          />
        </a>
      </div>
      <div className="spacer" />
      <div className="toolbar_navigation-items">
        <ul>
          <li>
            <a href="/">Home</a>
          </li>

          <li>
            <a href="/">Users</a>
            <ul class="dropdown">
              <li>
                <a href="ceodddc/login">
                  {" "}
                  <Person
                    style={{
                      color: "#ffffff",
                      display: "inline-flex",
                      verticalAlign: "top"
                    }}
                  />
                  {"\t"}
                  DC/CEO/DD
                </a>
              </li>
              <li>
                <a href="cdpoacdpo/login">
                  {" "}
                  <Person
                    style={{
                      color: "#ffffff",
                      display: "inline-flex",
                      verticalAlign: "top"
                    }}
                  />
                  {"\t"}ACDPO/CDPO
                </a>
              </li>
              <li>
                <a href="supervisor/login">
                  {" "}
                  <Person
                    style={{
                      color: "#ffffff",
                      display: "inline-flex",
                      verticalAlign: "top"
                    }}
                  />
                  {"\t"}Supervisor
                </a>
              </li>
            </ul>
          </li>
          <li>
            <a href="/">Help</a>
          </li>
        </ul>
      </div>
    </nav>
  </header>
);

export default toolbar;
