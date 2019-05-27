import React, { Component } from "react";
import { Redirect } from "react-router";
import firebase from "../../../../Firebase";
import { Link } from "react-router-dom";
import AdminLayout from "../../../../OtherComponents/Layout/AdminLayout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import globalStyles from "../../../styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

//-------------------------------------------------------------------/
import Select from "react-select"; // v 1.3.0
import "react-select/dist/react-select.css";
//-------------------------------------------------------------------/

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

export const optionsmaker = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      label: childSnapshot.val().talukname,
      value: childSnapshot.key
    });
  });
  return data;
};
export const optionsmaker2 = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      label: childSnapshot.villagename,
      value: childSnapshot.id
    });
  });
  return data;
};

class Create extends Component {
  state = { value: 1 };

  constructor() {
    super();
    this.state = {
      awcplace: "",
      presentindicator: 0,
      successindicator: 0,
      fieldemptyindicator: 0,
      fields: {},
      errors: {},
      options1: null,
      options2: null
    };
  }
  handleChangedropdown1(e) {
    this.setState({ valuedd1: e });
    firebase
      .database()
      .ref("village")
      .once("value")
      .then(snapshot => {
        var temp = [];
        var options2 = [];
        var datadropdown2 = firebaseLooper(snapshot);
        var i = 0;
        for (i = 0; i < datadropdown2.length; i++) {
          if (datadropdown2[i].talukid === e.value) {
            temp[i] = datadropdown2[i];
          }
        }

        options2 = optionsmaker2(temp);
        this.setState({
          options2: options2
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
  handleChangedropdown2(e) {
    this.setState({ valuedd2: e });
  }
  handleChangedropdown3 = valuedd3 => this.setState({ valuedd3 });
  handledata() {
    console.log("hello");
  }

  onSubmit = e => {
    e.preventDefault();
    const awcplace = this.state.awcplace;
    const talukname = this.state.valuedd1.label;
    const talukid = this.state.valuedd1.value;
    const villagename = this.state.valuedd2.label;
    const villageid = this.state.valuedd2.value;

    var i;
    var presentindicator = 0;
    var successindicator = 0;

    if (awcplace.length > 0) {
      for (i = 0; i < this.state.data.length; i++) {
        if (
          this.state.data[i].villagename.toLowerCase() ===
            villagename.toLowerCase() &&
          this.state.data[i].awcplace.toLowerCase() === awcplace.toLowerCase()
        ) {
          presentindicator++;
        }
        this.setState({ presentindicator: presentindicator });
      }
    }

    if (presentindicator === 0) {
      var ref = firebase.database().ref("awcplace");
      var obj = {
        awcplace: awcplace,
        talukname: talukname,
        talukid: talukid,
        villagename: villagename,
        villageid: villageid,
        awcplacestatus: 0
      };
      ref.push(obj);
      successindicator++;
      this.setState({
        successindicator: successindicator
      });
    }
  };
  componentDidMount() {
    firebase
      .database()
      .ref("awcplace")
      .once("value")
      .then(snapshot => {
        const data = firebaseLooper(snapshot);

        this.setState({
          data: data
        });
      });
    firebase
      .database()
      .ref("taluk")
      .once("value")
      .then(snapshot => {
        const options1 = optionsmaker(snapshot);
        this.setState({
          options1: options1
        });
      });
  }
  render() {
    const { village, description, author } = this.state;
    return (
      <AdminLayout>
        <form onSubmit={this.onSubmit}>
          <h3 style={globalStyles.title}>Add new awc place</h3>
          <div>
            {this.state.presentindicator ? (
              <div style={styles.warningDiv}>
                Awcplace you entered is already present
              </div>
            ) : null}
          </div>
          <br />
          <Divider />{" "}
          {!this.state.successindicator ? (
            <div>
              <Select
                onChange={e => {
                  this.handleChangedropdown1(e);
                  this.handledata();
                }}
                value={this.state.valuedd1}
                options={this.state.options1}
              />
              <br />
              <Divider />
              <Select
                onChange={e => {
                  this.handleChangedropdown2(e);
                }}
                value={this.state.valuedd2}
                options={this.state.options2}
              />
              <Divider />

              <TextField
                name="awcplace"
                hintText="Enter awcplace name"
                label="Enter awcplace name"
                value={this.state.awcplace}
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
              <Link to="awcplace" style={{ textDecoration: "none" }}>
                <Button variant="contained">Cancel</Button>
              </Link>
              <Button
                style={styles.saveButton}
                variant="contained"
                type="submit"
                color="primary"
              >
                Save
              </Button>
            </div>
          ) : (
            <div style={styles.buttons}>
              <Link to="awcplace" style={{ textDecoration: "none" }}>
                <Button variant="contained">
                  {" "}
                  <KeyboardArrowLeft />
                  Go Back
                </Button>
              </Link>
            </div>
          )}
        </form>
      </AdminLayout>
    );
  }
}

export default Create;
