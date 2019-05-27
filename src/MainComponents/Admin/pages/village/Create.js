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

class Create extends Component {
  state = { value: 1 };

  constructor() {
    super();
    this.state = {
      village: "",
      presentindicator: 0,
      successindicator: 0,
      fieldemptyindicator: 0,
      options: null
    };
  }
  handleChange = value => this.setState({ value });

  componentDidMount() {
    firebase
      .database()
      .ref("village")
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
        const options = optionsmaker(snapshot);
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
    e.target.value = "";
  };

  onSubmit = e => {
    e.preventDefault();
    const village = this.state.village;
    const selectedtalukname = this.state.value.label;
    const selectedtalukid = this.state.value.value;
    var i;
    var presentindicator = 0;
    var successindicator = 0;
    if (village.length > 0) {
      for (i = 0; i < this.state.data.length; i++) {
        if (
          this.state.data[i].villagename.toLowerCase() ===
            village.toLowerCase() &&
          this.state.data[i].talukname.toLowerCase() === selectedtalukname
        ) {
          presentindicator++;
        }
        this.setState({ presentindicator: presentindicator });
      }
    }

    if (presentindicator === 0) {
      var ref = firebase.database().ref("village");
      var obj = {
        talukid: selectedtalukid,
        talukname: selectedtalukname,
        villagename: village
      };
      ref.push(obj);
      successindicator++;
      this.setState({
        successindicator: successindicator
      });
    }
  };

  render() {
    const { village } = this.state;
    return (
      <AdminLayout>
        <form onSubmit={this.onSubmit}>
          <h3 style={globalStyles.title}>Add new village</h3>
          <div>
            {this.state.presentindicator ? (
              <div style={styles.warningDiv}>
                Village you entered is already present
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
                name="village"
                hintText="Enter village name"
                label="Enter village name"
                value={village}
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
              <Link to="village" style={{ textDecoration: "none" }}>
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
              <Link to="village" style={{ textDecoration: "none" }}>
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
