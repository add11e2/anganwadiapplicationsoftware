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

class assignsupervisortosupervisor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      villages: [],
      datatotables: []
    };
  }

  datatablecreator = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      //if (childSnapshot.val().talukid === this.state.talukid) {
      data.push({
        supervisor_emailid: childSnapshot.val().supervisor_emailid,
        anganwadicenter_code: childSnapshot.val().anganwadicenter_code,
        assignsupervisortoawcShow:
          "assignsupervisortoawcShow/" + childSnapshot.key
      });
      //  }
    });
    return data;
  };

  componentDidMount() {
    const currentuser = this.props.user.uid;
    firebase
      .database()
      .ref(`cdpo_acdpo/${currentuser}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();

        this.setState({
          talukid: data.talukid,
          talukname: data.talukname
        });
      });

    firebase
      .database()
      .ref("assignedawcenters_supervisor")
      .once("value")
      .then(snapshot => {
        const filteredata = this.datatablecreator(snapshot);

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
        { title: "SUPERVISOR EMAILID" },
        { title: "ANGANWADI CENTER CODE" },
        {
          title: "EDIT",
          render: function(data, type, row, meta) {
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
        <h3 style={globalStyles.navigation}>Application / ASSIGN SUPERVISOR</h3>
        <br />
        <Link
          to="assignsupervisortoawcCreate"
          style={{ textDecoration: "none" }}
        >
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to assign anganwadicenter to
            supervisor
          </Button>
        </Link>
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
      </CDPO_ACDPOLayout>
    );
  }
}

export default assignsupervisortosupervisor;
