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

class request extends Component {
  constructor(props) {
    super(props);
    this.state = {
      villages: [],
      datatotables: []
    };
  }
  firebaseLooper2 = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      data.push({
        ...childSnapshot.val(),
        id: childSnapshot.key
      });
    });
    return data;
  };
  datatablecreator = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (childSnapshot.val().anganwadidetails) {
        if (
          childSnapshot.val().anganwadidetails.supervisorid ===
          this.state.currentusersupervisor
        ) {
          childSnapshot.forEach(childchildSnapshot => {
            childchildSnapshot.forEach(childchildchildSnapshot => {
              childchildchildSnapshot.forEach(childchildchildchildSnapshot => {
                data.push({
                  duedate: childchildchildchildSnapshot.val().DPickdobStock
                    ? childchildchildchildSnapshot.val().DPickdobStock
                    : "NOT AVAILABLE",
                  anganwadicenter_code: childSnapshot.key,
                  assignworkertoawcShow:
                    "requestshow/" +
                    childSnapshot.key +
                    "/" +
                    childchildchildchildSnapshot.key
                });
              });
            });
          });
        }
      }
    });
    return data;
  };

  componentDidMount() {
    const currentusersupervisor = this.props.user.uid;
    this.setState({
      currentusersupervisor: currentusersupervisor
    });
    firebase
      .database()
      .ref("users")
      .once("value")
      .then(snapshot => {
        const filteredata = this.datatablecreator(snapshot);

        console.log(filteredata);
        //   con;
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));

        this.setState({
          //villages: orignaldata,
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
        { title: "NEEDS SUPPLIES BY" },
        { title: "ANGANWADI CENTER CODE" },
        {
          title: "EDIT",
          render: function(data, type, row, meta) {
            if (type === "display") {
              data =
                '<a href="' + data + '"class="link_button">GO TO DETAILS</a>';
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
          Application / <font color="red">EMERGENCY SUPPLIES </font>
          (FOOD/MEDICAL) REQUESTED BY ANGANWADI CENTER'S
        </h3>
        <br />
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </SupervisorLayout>
    );
  }
}

export default request;
