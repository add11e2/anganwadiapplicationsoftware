import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AdminLayout from "../../../../OtherComponents/Layout/AdminLayout";
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
      talukname: childSnapshot.val().talukname,
      tstatus: childSnapshot.val().tstatus === 0 ? "NOT ASSIGNED" : "ASSIGNED",
      talukid: "talukaShow/" + childSnapshot.key
    });
  });
  return data;
};

export default class taluka extends Component {
  constructor(props) {
    super(props);
    this.state = {
      talukas: [],
      datatotables: []
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref("taluk")
      .once("value")
      .then(snapshot => {
        const orignaldata = firebaseLooper(snapshot);
        const filteredata = datatablecreator(snapshot);
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));

        this.setState({
          talukas: orignaldata,
          datatotables: datatotables
        });
        this.callDataTable();
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }
  callDataTable() {
    if (!this.el) return;
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.state.datatotables,
      columns: [
        { title: "TALUK NAME" },
        { title: "TALUK STATUS" },
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
      <AdminLayout>
        <h3 style={globalStyles.navigation}>Application / Taluka</h3>
        <br />
        <Link to="talukaCreate" style={{ textDecoration: "none" }}>
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to add taluka
          </Button>
        </Link>
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </AdminLayout>
    );
  }
}
