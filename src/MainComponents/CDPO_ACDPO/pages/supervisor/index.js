import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CDPO_ACDPOLayout from "../../../../OtherComponents/Layout/CDPO_ACDPOLayout";
import { Link } from "react-router-dom";
import firebase from "../../../../Firebase";
import plusImage from "../../../../Resources/Images/elements/plus_button.png";
import globalStyles from "../../../styles";
const $ = require("jquery");
$.DataTable = require("datatables.net");

export const firebaseLooper = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key
    });
  });
  return data;
};
const styles = {
  saveButton: {
    float: "left",
    marginBottom: 10
  }
};
//FU tstatus: childSnapshot.val().tstatus === 0 ? "NOT ASSIGNED" : "ASSIGNED",
export const datatablecreator = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      talukname: childSnapshot.val().talukname
        ? childSnapshot.val().talukname
        : "<font color=red>NOT ASSIGNED</font>",
      supervisor_name: childSnapshot.val().supervisor_name,
      supervisor_emailid: childSnapshot.val().supervisor_emailid,
      //  supervisor_dateofbirth: childSnapshot.val().supervisor_dateofbirth,
      supervisor_mobileno: childSnapshot.val().supervisor_mobileno,
      supervisor_password: childSnapshot.val().supervisor_password,
      supervisor_id: "supervisorShow/" + childSnapshot.key
    });
  });

  return data;
};

export default class supervisor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supervisors: [],
      datatotables: []
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref("supervisor")
      .once("value")
      .then(snapshot => {
        const orignaldata = firebaseLooper(snapshot);
        const filteredata = datatablecreator(snapshot);
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));
        console.log(orignaldata);
        this.setState({
          supervisors: orignaldata,
          datatotables: datatotables
        });
        this.callDataTable();
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }
  // supervisor_name: childSnapshot.val().supervisor_name,
  // supervisor_emailid: childSnapshot.val().supervisor_emailid,
  // supervisor_mobileno: childSnapshot.val().supervisor_mobileno,
  // supervisor_password: childSnapshot.val().supervisor_password,
  // supervisor_id: "ceodcddShow/" + childSnapshot.key
  callDataTable() {
    if (!this.el) return;
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.state.datatotables,
      columns: [
        { title: "TALUK NAME" },
        { title: "CDPO/ACDPO NAME" },
        { title: "CDPO/ACDPO EMAIL ID" },
        { title: "CDPO/ACDPO MOBILE NO" },
        { title: "CDPO/ACDPO PASSWORD" },
        {
          title: "EDIT",
          render: function(data, type) {
            if (type === "display") {
              data = '<a href="' + data + '"class="link_button">EDIT</a>';
            }
            return data;
          }
        }
      ]
    });
  }
  render() {
    return (
      <CDPO_ACDPOLayout>
        <h3 style={globalStyles.navigation}>Application / Add SUPERVISOR</h3>
        <br />
        <Link to="supervisorCreate" style={{ textDecoration: "none" }}>
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to add new Supervisor
          </Button>
        </Link>
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </CDPO_ACDPOLayout>
    );
  }
}
