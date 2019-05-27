import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../../../Firebase";
import TextField from "@material-ui/core/TextField";
import AdminLayout from "../../../../OtherComponents/Layout/AdminLayout";
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
      ceodddcid: "",
      successindicator: 0
    };
  }

  componentDidMount() {
    var editid = this.props.match.params.id;
    console.log(editid);
    firebase
      .database()
      .ref(`ceo_dd_dc/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        if (data !== null) {
          this.setState({
            username: data.ceo_dd_dc_name,
            gender: data.ceo_dd_dc_gender,
            mobileno: data.ceo_dd_dc_mobileno,
            emailid: data.ceo_dd_dc_emailid,
            dateofbirth: data.ceo_dd_dc_dateofbirth,
            ceodddcid: editid
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
      <AdminLayout>
        <h3 style={globalStyles.title}>Edit credentials (CEO/DC/DD)</h3>
        <div>
          {!this.state.successindicator ? (
            <div>
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
              to={`../ceodcddEdit/${this.state.ceodddcid}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained">Edit</Button>
            </Link>
            <Button
              onClick={this.delete.bind(this, this.state.ceodddcid)}
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
            <Link to="../ceodcdd" style={{ textDecoration: "none" }}>
              <Button variant="contained">
                {" "}
                <KeyboardArrowLeft />
                Go Back
              </Button>
            </Link>
          </div>
        )}
      </AdminLayout>
    );
  }
}

export default Show;
