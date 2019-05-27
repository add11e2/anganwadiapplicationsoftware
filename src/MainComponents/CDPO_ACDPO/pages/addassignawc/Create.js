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
  state = { value: 1 };

  constructor() {
    super();
    this.state = {
      presentindicator: 0,
      successindicator: 0,
      options: null,
      talukid: ""
    };
  }
  handleChange = value => this.setState({ value });

  optionsmaker = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (
        childSnapshot.val().awcplacestatus === 0 &&
        childSnapshot.val().talukid === this.state.talukid
      ) {
        data.push({
          label: childSnapshot.val().awcplace,
          value: childSnapshot.key
        });
      }
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
      .ref("awcplace")
      .once("value")
      .then(snapshot => {
        const options = this.optionsmaker(snapshot);
        this.setState({
          options: options
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
    firebase
      .database()
      .ref(`anganwadicenter`)
      .once("value")
      .then(snapshot => {
        var presentindicator = 0;
        const checkifexists = firebaseLooper(snapshot);
        var i = 0;
        for (i = 0; i < checkifexists.length; i++) {
          if (
            checkifexists[i].anganwadicenter_code ===
            this.state.anganwadicentercode
          ) {
            presentindicator++;
          }
        }

        this.setState({
          presentindicator: presentindicator
        });
      });
    e.target.value = "";
  };

  onSubmit = e => {
    e.preventDefault();
    const anganwadicentercode = this.state.anganwadicentercode;
    const selectedawcplacename = this.state.value.label;
    const selectedawcplaceid = this.state.value.value;
    var i;

    var successindicator = 0;
    firebase
      .database()
      .ref(`awcplace/${selectedawcplaceid}`)
      .once("value")
      .then(snapshot => {
        this.setState({
          villageid: snapshot.val().villageid,
          villagename: snapshot.val().villagename
        });

        var ref = firebase.database().ref("anganwadicenter");
        var obj = {
          awcplaceid: selectedawcplaceid,
          awcplace: selectedawcplacename,
          anganwadicenter_workerassignstatus: 0,
          anganwadicenter_supervisorassignstatus: 0,
          anganwadicenter_code: anganwadicentercode,
          talukid: this.state.talukid,
          talukname: this.state.talukname,
          villageid: this.state.villageid,
          villagename: this.state.villagename
        };
        ref.push(obj);
        firebase
          .database()
          .ref(`awcplace/${selectedawcplaceid}`)
          .update({
            awcplacestatus: 1
          });
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
            Add anagwadi center to anganwadi place
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
                onChange={this.handleChange}
                value={this.state.value}
                options={this.state.options}
              />
              <Divider />

              <TextField
                name="anganwadicentercode"
                hintText="Enter anganwadi center code"
                label="Enter anganwadi center code (e.g X10001)"
                value={this.state.anganwadicentercode}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
              />
            </div>
          ) : (
            <div style={styles.successDiv}>Created successfully!!</div>
          )}
          {!this.state.successindicator ? (
            <div style={styles.buttons}>
              <Link to="addassignawc" style={{ textDecoration: "none" }}>
                <Button variant="contained">Cancel</Button>
              </Link>
              {!this.state.presentindicator ? (
                <Button
                  style={styles.saveButton}
                  variant="contained"
                  type="submit"
                  color="primary"
                >
                  Save
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
              <Link to="addassignawc" style={{ textDecoration: "none" }}>
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
