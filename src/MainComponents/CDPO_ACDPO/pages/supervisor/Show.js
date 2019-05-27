import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../../../Firebase";
import TextField from "@material-ui/core/TextField";
import CDPO_ACDPOLayout from "../../../../OtherComponents/Layout/CDPO_ACDPOLayout";
import Button from "@material-ui/core/Button";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import globalStyles from "../../../styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";

const styles = {
  buttons: {
    marginTop: 30,
    float: "right"
  },
  deleteButton: {
    marginLeft: 5,
    backgroundColor: "red"
  },
  successDiv: {
    backgroundColor: "#d4edda",
    color: "#305939",
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

class Show extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      gender: "",
      mobileno: "",
      emailid: "",
      dateofbirth: "",
      supervisorid: "",
      successindicator: 0,
      talukname: ""
    };
  }

  componentDidMount() {
    var editid = this.props.match.params.id;
    console.log(editid);
    firebase
      .database()
      .ref(`supervisor/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        if (data !== null) {
          this.setState({
            username: data.supervisor_name,
            gender: data.supervisor_gender,
            mobileno: data.supervisor_mobileno,
            emailid: data.supervisor_emailid,
            dateofbirth: data.supervisor_dateofbirth,
            talukname: data.talukname,
            supervisorid: editid
          });
        }
        console.log(this.state.dateofbirth);
      });
  }
  delete(deleteid) {
    firebase
      .database()
      .ref(`taluk/${deleteid}`)
      .remove()
      .then(() => {
        var successindicator = 0;
        successindicator++;
        this.setState({
          successindicator: successindicator
        });
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }

  render() {
    return (
      <CDPO_ACDPOLayout>
        <h3 style={globalStyles.title}>Edit credentials (CEO/DC/DD)</h3>
        <div>
          {!this.state.successindicator ? (
            <div>
              <TextField
                name="talukname"
                value={this.state.talukname}
                onChange={this.handleChange}
                fullWidth={true}
                margin="normal"
                variant="outlined"
                disabled
              />
              <TextField
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                hintText="username"
                label="Username (only text)"
                fullWidth={true}
                margin="normal"
                variant="outlined"
                disabled
              />

              <TextField
                name="emailid"
                value={this.state.emailid}
                onChange={this.handleChange}
                hintText="emailid"
                label="Emailid (e.g xyz@gmail.com)"
                fullWidth={true}
                margin="normal"
                variant="outlined"
                disabled
              />

              <TextField
                name="mobileno"
                value={this.state.mobileno}
                onChange={this.handleChange}
                type="number"
                hintText="emailid"
                label="Mobile no (e.g 8050204010)"
                fullWidth={true}
                margin="normal"
                variant="outlined"
                disabled
              />

              <TextField
                name="gender"
                value={this.state.gender}
                onChange={this.handleChange}
                hintText="Gender"
                label="gender"
                fullWidth={true}
                margin="normal"
                variant="outlined"
                disabled
              />

              <TextField
                name="dateofbirth"
                value={this.state.dateofbirth}
                onChange={this.handleChange}
                margin="normal"
                fullWidth={true}
                disabled
              />
            </div>
          ) : (
            <div style={styles.successDiv}>Deleted successfully!!</div>
          )}
        </div>

        {!this.state.successindicator ? (
          <div style={styles.buttons}>
            <Link
              to={`../supervisorEdit/${this.state.supervisorid}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" disabled>
                Edit
              </Button>
            </Link>
            <Button
              onClick={this.delete.bind(this, this.state.supervisorid)}
              style={styles.deleteButton}
              variant="contained"
              type="submit"
              color="primary"
              disabled
            >
              Delete
            </Button>
          </div>
        ) : (
          <div style={styles.buttons}>
            <Link to="../supervisor" style={{ textDecoration: "none" }}>
              <Button variant="contained">
                {" "}
                <KeyboardArrowLeft />
                Go Back
              </Button>
            </Link>
          </div>
        )}
      </CDPO_ACDPOLayout>
    );
  }
}

export default Show;
