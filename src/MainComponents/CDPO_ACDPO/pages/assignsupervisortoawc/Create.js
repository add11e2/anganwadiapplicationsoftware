import React, { Component } from "react";
import { Redirect } from "react-router";
import firebase from "../../../../Firebase";
import { Link } from "react-router-dom";
import CDPO_ACDPOLayout from "../../../../OtherComponents/Layout/CDPO_ACDPOLayout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import globalStyles from "../../../styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import Select from "react-select"; // v 1.3.0
import "react-select/dist/react-select.css";

const styles = {
  toggleDiv: {
    marginTop: 20,
    marginBottom: 5
  },
  toggleLabel: {
    color: grey[400],
    fontWeight: 100
  },
  buttons: {
    marginTop: 30,
    float: "right"
  },
  saveButton: {
    marginLeft: 5
  },
  errordiv: {
    backgroundColor: "#FFBABA",
    color: "#D8000C",
    padding: 10,
    borderRadius: 25,
    textAlign: "center"
  },
  successDiv: {
    backgroundColor: "#d4edda",
    color: "#305939",
    padding: 10,
    borderRadius: 25,
    textAlign: "center"
  },
  warningDiv: {
    backgroundColor: "#fff3cd",
    color: "#776e52",
    padding: 10,
    borderRadius: 25,
    textAlign: "center"
  }
};
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

class Create extends Component {
  state = { value1: 1, value2: 1 };

  constructor() {
    super();
    this.state = {
      presentindicator: 0,
      successindicator: 0,
      anganwadicenteroptions: null,
      supervisoroptions: null,
      talukid: ""
    };
  }
  handleChange1 = value1 => this.setState({ value1 });
  handleChange2 = value2 => this.setState({ value2 });
  optionsmaker = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (
        childSnapshot.val().anganwadicenter_supervisorassignstatus === 0 &&
        childSnapshot.val().talukid === this.state.talukid
      ) {
        data.push({
          label:
            childSnapshot.val().anganwadicenter_code +
            "(" +
            childSnapshot.val().awcplace +
            ")",
          value: childSnapshot.key
        });
      }
    });
    return data;
  };
  supervisoroptionsmaker = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (childSnapshot.val().talukid === this.state.talukid) {
        data.push({
          label: childSnapshot.val().supervisor_emailid,
          value: childSnapshot.key
        });
      }
    });
    return data;
  };
  componentDidMount() {
    const currentusercdpo = this.props.user.uid;
    firebase
      .database()
      .ref(`cdpo_acdpo/${currentusercdpo}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();

        this.setState({
          talukid: data.talukid,
          talukname: data.talukname,
          cdpoid: currentusercdpo
        });
      });

    firebase
      .database()
      .ref("anganwadicenter")
      .once("value")
      .then(snapshot => {
        console.log(snapshot.val());
        const anganwadicenteroptions = this.optionsmaker(snapshot);
        this.setState({
          anganwadicenteroptions: anganwadicenteroptions
        });
      });
    firebase
      .database()
      .ref("supervisor")
      .once("value")
      .then(snapshot => {
        console.log(snapshot.val());
        const supervisoroptions = this.supervisoroptionsmaker(snapshot);
        this.setState({
          supervisoroptions: supervisoroptions
        });
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
    e.target.value = "";
  };

  onSubmit = e => {
    e.preventDefault();
    const selected_anganwadicenter = this.state.value1.label;
    const selected_anganwadicenterid = this.state.value1.value;

    const selected_supervisoremailid = this.state.value2.label;
    const selected_supervisorid = this.state.value2.value;
    const cdpoid = this.state.cdpoid;
    var i;

    var successindicator = 0;

    var ref = firebase.database().ref("assignedawcenters_supervisor");
    var obj = {
      anganwadicenter_code: selected_anganwadicenter.replace(
        / *\([^)]*\) */g,
        ""
      ),
      anganwadicenterid: selected_anganwadicenterid,
      supervisor_emailid: selected_supervisoremailid,
      supervisorid: selected_supervisorid,
      cdpoid: cdpoid,
      assign_to_worker_status: 0
    };
    ref.push(obj);
    firebase
      .database()
      .ref(`anganwadicenter/${selected_anganwadicenterid}`)
      .update({
        anganwadicenter_supervisorassignstatus: 1
      });

    successindicator++;
    this.setState({
      successindicator: successindicator
    });
  };

  render() {
    return (
      <CDPO_ACDPOLayout>
        <form onSubmit={this.onSubmit}>
          <h3 style={globalStyles.title}>
            Assign supervisor to anganwadicenter
          </h3>
          <div>
            {this.state.presentindicator ? (
              <div style={styles.warningDiv}>
                Anganwadi center code you entered is already present
              </div>
            ) : null}
          </div>
          <Divider />{" "}
          {!this.state.successindicator ? (
            <div>
              <Select
                onChange={this.handleChange1}
                value={this.state.value1}
                options={this.state.anganwadicenteroptions}
              />
              <br />
              <Divider />
              <br />
              <Select
                onChange={this.handleChange2}
                value={this.state.value2}
                options={this.state.supervisoroptions}
              />
            </div>
          ) : (
            <div style={styles.successDiv}>Assigned successfully!!</div>
          )}
          {!this.state.successindicator ? (
            <div style={styles.buttons}>
              <Link
                to="assignsupervisortoawc"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained">Cancel</Button>
              </Link>
              {!this.state.presentindicator ? (
                <Button
                  style={styles.saveButton}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  ASSIGN
                </Button>
              ) : (
                <Button
                  style={styles.saveButton}
                  variant="contained"
                  type="submit"
                  color="primary"
                  disabled
                >
                  Save
                </Button>
              )}
            </div>
          ) : (
            <div style={styles.buttons}>
              <Link
                to="assignsupervisortoawc"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained">
                  {" "}
                  <KeyboardArrowLeft />
                  Go Back
                </Button>
              </Link>
            </div>
          )}
        </form>
      </CDPO_ACDPOLayout>
    );
  }
}

export default Create;
