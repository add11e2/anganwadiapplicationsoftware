import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./style.css";
require("jquery");
require("bootstrap/dist/js/bootstrap.min.js");
const a = require("../../Resources/Images/logo1.png");
const dash = require("../../Resources/Images/dash.png");

class Home extends Component {
  render() {
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark container customnav navbar-fixed-top">
          <a className="navbar-brand" href="#">
            <img className="logo" height="45" width="45" src={a} /> Anganwadi
            Application Software
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbar1"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbar1">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item active">
                <a className="nav-link" href="http://bootstrap-ecommerce.com">
                  Home <span className="sr-only">(current)</span>
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="html-components.html">
                  {" "}
                  Help{" "}
                </a>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link  dropdown-toggle"
                  href="#"
                  data-toggle="dropdown"
                >
                  {" "}
                  Users{" "}
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="ceodddc/login">
                      {" "}
                      DC/CEO/DD
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="cdpoacdpo/login">
                      {" "}
                      CDPO{" "}
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="supervisor/login">
                      {" "}
                      Supervisor{" "}
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </nav>
        <div class="container logofunc">
          <div class="row">
            <div class="col-sm-4">
              <img
                alt="Logo_Image"
                className="img-responsive logoimg"
                src={a}
              />
              <h3>Anganwadi Application Software</h3>
            </div>
            <div class="col-sm-8">
              <div className="func">
                <h3>Anganwadi</h3>
                <p>
                  Anganwadi centres are one of the earliest education medium
                  which needs to be completed before pre-school education level.
                  This includes various fun activities along with the learning
                  process. Along with that this, centres having a teacher to
                  look after the activities conducted in this centres needs to
                  collect some important information which falls under their
                  particular Anganwadi centres. This process will include the
                  process of collecting different information related to an
                  Anganwadi centre and survey’s which needs to be conducted on
                  the people living under the range of that Anganwadi centre.
                  Collecting of this information and maintaining them is very
                  tedious job as now it’s done completely on ledger basis and
                  offline in case if a higher authority wants to access the data
                  he needs to visit the particular AWC place. Considering these
                  issues we are proposed to develop a system which intends to
                  automate the manual which is done by Anganwadi centres and
                  make data accessible for higher authority from the remote
                  location.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Separate */}
        <div className="container funexp">
          <div class="row">
            <div class="col-sm-12">
              <h3>We are known for....</h3>
              <ul class="list-group">
                <li class="list-group-item">
                  Locating location of the centre through  GPS.
                </li>
                <li class="list-group-item">
                  Region wise Statistical reports.
                </li>
                <li class="list-group-item">
                  Household registration with member details.
                </li>
                <li class="list-group-item">
                  Expecting women and nursing mother details.
                </li>
                <li class="list-group-item">
                  Immunization details of children.
                </li>
                <li class="list-group-item">
                   Maintenance of stock and inventory.
                </li>
                <li class="list-group-item">
                  Maintaining the details of nutrients to children, expecting
                  women and nursing mother.
                </li>
                <li class="list-group-item">
                  Submission of daily attendance of Anganwadi centre.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separate */}
        <div className="container dwnloadapp">
          <div class="row">
            <div class="col-sm-4 btndown">
              <h3>Download App</h3>
              <button>Download</button>
            </div>
            <div class="col-sm-8">
              <img alt="Logo_Image" className="img-responsive" src={dash} />
              <img alt="Logo_Image" className="img-responsive" src={dash} />
            </div>
          </div>
        </div>

        {/* footer */}

        <footer class="page-footer font-small blue">
          <div class="footer-copyright text-center py-3">
            © 2019 Copyright: Dept of Mca Students (2016-2019)
            {/* <a href=""> thunderismine.com</a> */}
          </div>
        </footer>
      </div>
    );
  }
}

export default Home;
