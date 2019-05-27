import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CEO_DD_DCLayout from "../../../../OtherComponents/Layout/CEO_DD_DCLayout";
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
      cdpo_acdpo_name: childSnapshot.val().cdpo_acdpo_name,
      cdpo_acdpo_emailid: childSnapshot.val().cdpo_acdpo_emailid,
      //  cdpo_acdpo_dateofbirth: childSnapshot.val().cdpo_acdpo_dateofbirth,
      cdpo_acdpo_mobileno: childSnapshot.val().cdpo_acdpo_mobileno,
      cdpo_acdpo_password: childSnapshot.val().cdpo_acdpo_password,
      cdpo_acdpo_id: "cdpoacdpoShow/" + childSnapshot.key
    });
  });

  return data;
};

export default class cdpoacdpo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cdpo_acdpos: [],
      datatotables: []
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref("cdpo_acdpo")
      .once("value")
      .then(snapshot => {
        const orignaldata = firebaseLooper(snapshot);
        const filteredata = datatablecreator(snapshot);
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));
        console.log(orignaldata);

        this.setState({
          cdpo_acdpos: orignaldata,
          datatotables: datatotables
        });
        this.callDataTable();
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }
  // cdpo_acdpo_name: childSnapshot.val().cdpo_acdpo_name,
  // cdpo_acdpo_emailid: childSnapshot.val().cdpo_acdpo_emailid,
  // cdpo_acdpo_mobileno: childSnapshot.val().cdpo_acdpo_mobileno,
  // cdpo_acdpo_password: childSnapshot.val().cdpo_acdpo_password,
  // cdpo_acdpo_id: "ceodcddShow/" + childSnapshot.key
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
      <CEO_DD_DCLayout>
        <h3 style={globalStyles.navigation}>Application / Add CDPO/ACDPO</h3>
        <br />
        <Link to="cdpoacdpoCreate" style={{ textDecoration: "none" }}>
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to add new CDPO/ACDPO
          </Button>
        </Link>
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </CEO_DD_DCLayout>
    );
  }
}
