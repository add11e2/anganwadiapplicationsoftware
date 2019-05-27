import React, { Component } from "react";
import { Redirect } from "react-router";
import firebase from "../../../../Firebase";
import { Link } from "react-router-dom";
import SupervisorLayout from "../../../../OtherComponents/Layout/SupervisorLayout";
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
export const anganwadicenterLooper = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val(),
      id: childSnapshot.key
    });
  });
  return data;
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
      assignedawcenters_supervisorid: "",
      anganwadicenteroptions: null,
      anganwadiworkeroptions: null,
      supervisorkey: ""
    };
  }

  handleChange1 = value1 => {
    this.setState({ value1 });
    console.log(value1.label);
    const anganwadicentercode = value1.label;
    firebase
      .database()
      .ref("assignedawcenters_supervisor")
      .once("value")
      .then(snapshot => {
        var data2 = anganwadicenterLooper(snapshot);
        var i = 0;
        for (i = 0; data2.length; i++) {
          var centercodefromdb = data2[i].anganwadicenter_code
            ? data2[i].anganwadicenter_code
            : null;

          if (centercodefromdb != null) {
            if (
              parseInt(centercodefromdb) === parseInt(anganwadicentercode) &&
              data2[i].anganwadicenter_code !== undefined
            ) {
              var supervisorkeytemp = data2[i].id;
              console.log(data2[i].id);
              this.setState({
                supervisorkey: supervisorkeytemp
              });
            }
          }
        }
      });
  };
  //handleChange1 = value1 => this.setState({ value1 });
  handleChange2 = value2 => this.setState({ value2 });

  firebaseLooper = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (this.state.supervisorfromdata === childSnapshot.val().supervisorid) {
        data.push({
          ...childSnapshot.val(),
          assignedawcenters_supervisorid: childSnapshot.key
        });
      }
    });
    return data;
  };
  anganwadicenteroptionsmaker = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (childSnapshot.val().assign_to_worker_status === 0) {
        data.push({
          label: childSnapshot.val().anganwadicenter_code,
          value: childSnapshot.val().anganwadicenterid
        });
      }
    });
    return data;
  };
  anganwadiworkeroptionsmaker = snapshot => {
    let data = [];

    snapshot.forEach(childSnapshot => {
      if (
        parseInt(childSnapshot.val().anganwadiworker_assignto_center_status) ===
        0
      ) {
        data.push({
          label: childSnapshot.val().anganwadiworker_emailid,
          value: childSnapshot.key
        });
      }
    });

    return data;
  };
  componentDidMount() {
    const currentuser = this.props.user.uid;
    console.log(currentuser);
    this.setState({
      supervisorfromdata: currentuser
    });
    firebase
      .database()
      .ref("assignedawcenters_supervisor")
      .once("value")
      .then(snapshot => {
        //  console.log("assignedawcenters_supervisor", snapshot.val());

        const datafromassignedawcenters_supervisor = this.firebaseLooper(
          snapshot
        );

        //    console.log(datafromassignedawcenters_supervisor.cdpoid);

        var i = 0;
        var temp = "";
        var temp2, temp3;
        for (i = 0; i < datafromassignedawcenters_supervisor.length; i++) {
          temp =
            datafromassignedawcenters_supervisor[i]
              .assignedawcenters_supervisorid;
          temp2 = datafromassignedawcenters_supervisor[i].cdpoid;
          temp3 = datafromassignedawcenters_supervisor[i].supervisorid;
        }
        //    console.log(temp, "hello");
        this.setState({
          assignedawcenters_supervisorid: temp,
          cdpoid: temp2,
          supervisorid: temp3
        });

        const anganwadicenteroptions = this.anganwadicenteroptionsmaker(
          snapshot
        );
        this.setState({
          anganwadicenteroptions: anganwadicenteroptions
        });
      });
    firebase
      .database()
      .ref("anganwadiworker")
      .once("value")
      .then(snapshot => {
        const dataarray = firebaseLooper(snapshot);
        var i = 0;
        for (i = 0; i < dataarray.length; i++) {
          console.log(dataarray[i].anganwadiworker_assignto_center_status);
        }
        const anganwadiworkeroptions = this.anganwadiworkeroptionsmaker(
          snapshot
        );

        console.log(anganwadiworkeroptions);

        this.setState({
          anganwadiworkeroptions: anganwadiworkeroptions
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
    const selected_assignedawcenters_supervisor = this.state.value1.label;
    const selected_assignedawcenters_supervisorid = this.state.value1.value;

    const selected_anganwadiworkeremailid = this.state.value2.label;
    const selected_anganwadiworkerid = this.state.value2.value;
    const cdpoid = this.state.cdpoid;
    const supervisorid = this.state.supervisorid;
    // console.log(this.state);
    var supervisorkeytemp = "";
    var i;

    var successindicator = 0;
    firebase
      .database()
      .ref("anganwadicenter")
      .once("value")
      .then(snapshot => {
        console.log("supervisorkey", this.state.supervisorkey);
        const supervisorkey = this.state.supervisorkey;
        var data = anganwadicenterLooper(snapshot);
        var i = 0;
        for (i = 0; i < data.length; i++) {
          if (
            parseInt(data[i].anganwadicenter_code) ===
            parseInt(selected_assignedawcenters_supervisor)
          ) {
            var awcplace = data[i].awcplace;
            var talukname = data[i].talukname;
            var villagename = data[i].villagename;
            //   console.log(awcplace, villagename, talukname);
            var ref = firebase.database().ref("assignedworkerstocenters");
            var obj = {
              anganwadicenter_code: selected_assignedawcenters_supervisor,
              anganwadicenterid: selected_assignedawcenters_supervisorid,
              anganwadiworker_emailid: selected_anganwadiworkeremailid,
              anganwadiworkerid: selected_anganwadiworkerid,
              assignedawcenters_supervisorid: supervisorkey,
              cdpoid: cdpoid,
              supervisorid: supervisorid,
              awcplace: awcplace,
              villagename: villagename,
              talukname: talukname
            };
            ref.push(obj);
            firebase
              .database()
              .ref(`assignedawcenters_supervisor/${supervisorkey}`)
              .update({
                assign_to_worker_status: 1
              });
            firebase
              .database()
              .ref(`anganwadiworker/${selected_anganwadiworkerid}`)
              .update({
                anganwadiworker_assignto_center_status: 1
              });
            successindicator++;
            this.setState({
              successindicator: successindicator
            });
          }
        }
      });
  };

  render() {
    return (
      <SupervisorLayout>
        <form onSubmit={this.onSubmit}>
          <h3 style={globalStyles.title}>
            Assign anganwadiworker to anganwadicenter
          </h3>
          <div>
            {this.state.presentindicator ? (
              <div style={styles.warningDiv}>Is already allocated</div>
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
                options={this.state.anganwadiworkeroptions}
              />
            </div>
          ) : (
            <div style={styles.successDiv}>Assigned successfully!!</div>
          )}
          {!this.state.successindicator ? (
            <div style={styles.buttons}>
              <Link to="assignworkertoawc" style={{ textDecoration: "none" }}>
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
              <Link to="assignworkertoawc" style={{ textDecoration: "none" }}>
                <Button variant="contained">
                  {" "}
                  <KeyboardArrowLeft />
                  Go Back
                </Button>
              </Link>
            </div>
          )}
        </form>
      </SupervisorLayout>
    );
  }
}

export default Create;
