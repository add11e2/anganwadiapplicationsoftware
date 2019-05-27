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
  constructor() {
    super();
    this.state = {
      taluk: "",
      presentindicator: 0,
      successindicator: 0
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref("taluk")
      .once("value")
      .then(snapshot => {
        const data = firebaseLooper(snapshot);

        this.setState({
          data: data
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
    const { taluk } = this.state;
    var i;
    var presentindicator = 0;
    var successindicator = 0;

    if (taluk.length > 0) {
      for (i = 0; i < this.state.data.length; i++) {
        if (
          this.state.data[i].talukname.toLowerCase() === taluk.toLowerCase()
        ) {
          console.log(this.state.data[i].talukname);
          presentindicator++;
        }
        this.setState({ presentindicator: presentindicator });
      }
    }

    if (presentindicator === 0) {
      var ref = firebase.database().ref("taluk");
      var obj = {
        talukname: taluk,
        tstatus: 0
      };
      ref.push(obj);
      successindicator++;

      this.setState({
        successindicator: successindicator
      });
    }
  };

  render() {
    const { taluk } = this.state;
    return (
      <AdminLayout>
        <form onSubmit={this.onSubmit}>
          <h3 style={globalStyles.title}>Add new taluk</h3>
          <div>
            {this.state.presentindicator ? (
              <div style={styles.warningDiv}>
                Taluk you entered is already present
              </div>
            ) : null}
          </div>
          <Divider />
          {!this.state.successindicator ? (
            <TextField
              value={taluk}
              onChange={this.onChange}
              name="taluk"
              hintText="Enter taluk name"
              label="Enter taluk name"
              fullWidth={true}
              margin="normal"
            />
          ) : (
            <div style={styles.successDiv}>Created successfully!!</div>
          )}

          {!this.state.successindicator ? (
            <div style={styles.buttons}>
              <Link to="taluka" style={{ textDecoration: "none" }}>
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
              <Link to="taluka" style={{ textDecoration: "none" }}>
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
