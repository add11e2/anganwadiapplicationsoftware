import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import SupervisorLayout from "../../../../OtherComponents/Layout/SupervisorLayout";
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
      anganwadiworker_assignto_center_status:
        childSnapshot.val().anganwadiworker_assignto_center_status === 0
          ? "<font color=red>NOT ASSIGNED</font>"
          : "<font color=blue>ASSIGNED</font>",
      anganwadiworker_name: childSnapshot.val().anganwadiworker_name,
      anganwadiworker_emailid: childSnapshot.val().anganwadiworker_emailid,
      //  supervisor_dateofbirth: childSnapshot.val().supervisor_dateofbirth,
      anganwadiworker_mobileno: childSnapshot.val().anganwadiworker_mobileno,
      anganwadworker_password: childSnapshot.val().anganwadiworker_password,
      anganwadiworker_edit: "addanganwadiworkerShow/" + childSnapshot.key
    });
  });

  return data;
};

export default class addanganwadiworker extends Component {
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
      .ref("anganwadiworker")
      .once("value")
      .then(snapshot => {
        const orignaldata = firebaseLooper(snapshot);
        console.log(snapshot.val());
        const filteredata = datatablecreator(snapshot);
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));
        console.log(orignaldata);
        this.setState({
          anganwadiworkers: orignaldata,
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
        { title: "Assigned to anganwadi center?" },
        { title: "Anganwadi worker Name" },
        { title: "Anganwadi worker  EMAIL ID" },
        { title: "Anganwadi worker  MOBILE NO" },
        { title: "Anganwadi worker  PASSWORD" },
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
      <SupervisorLayout>
        <h3 style={globalStyles.navigation}>
          Application / Add anganwadi worker
        </h3>
        <br />
        <Link to="addanganwadiworkerCreate" style={{ textDecoration: "none" }}>
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to add new anganwadi worker
          </Button>
        </Link>
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </SupervisorLayout>
    );
  }
}
