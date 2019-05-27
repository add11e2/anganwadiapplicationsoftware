import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../../../Firebase";
import TextField from "@material-ui/core/TextField";
import CEO_DD_DCLayout from "../../../../OtherComponents/Layout/CEO_DD_DCLayout";
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
      cdpoacdpoid: "",
      successindicator: 0,
      talukname: ""
    };
  }

  componentDidMount() {
    var editid = this.props.match.params.id;
    console.log(editid);
    firebase
      .database()
      .ref(`cdpo_acdpo/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        if (data !== null) {
          this.setState({
            username: data.cdpo_acdpo_name,
            gender: data.cdpo_acdpo_gender,
            mobileno: data.cdpo_acdpo_mobileno,
            emailid: data.cdpo_acdpo_emailid,
            dateofbirth: data.cdpo_acdpo_dateofbirth,
            talukname: data.talukname,
            cdpoacdpoid: editid
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
      <CEO_DD_DCLayout>
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
              to={`../cdpoacdpoEdit/${this.state.cdpoacdpoid}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained">Edit</Button>
            </Link>
            <Button
              onClick={this.delete.bind(this, this.state.cdpoacdpoid)}
              style={styles.deleteButton}
              variant="contained"
              type="submit"
              color="primary"
            >
              Delete
            </Button>
          </div>
        ) : (
          <div style={styles.buttons}>
            <Link to="../cdpoacdpo" style={{ textDecoration: "none" }}>
              <Button variant="contained">
                {" "}
                <KeyboardArrowLeft />
                Go Back
              </Button>
            </Link>
          </div>
        )}
      </CEO_DD_DCLayout>
    );
  }
}

export default Show;
