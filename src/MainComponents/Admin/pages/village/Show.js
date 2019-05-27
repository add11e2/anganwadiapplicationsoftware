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
      villagename: "",
      villageid: "",
      talukname: "",
      successindicator: 0
    };
  }

  componentDidMount() {
    var editid = this.props.match.params.id;
    firebase
      .database()
      .ref(`village/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        this.setState({
          villagename: data.villagename,
          talukname: data.talukname,
          villageid: editid,
          isLoading: false
        });
      });
  }

  delete(deleteid) {
    firebase
      .database()
      .ref(`village/${deleteid}`)
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
        <h3 style={globalStyles.title}>Edit village</h3>
        <div>
          <p> NOTE : Deleting village will delete all awcplaces under it !!</p>
          {!this.state.successindicator ? (
            <div>
              <TextField
                hintText="Taluk name"
                label="Taluk name"
                value={this.state.talukname}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                hintText="Village name"
                label="Village name"
                value={this.state.villagename}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
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
              to={`../villageEdit/${this.state.villageid}`}
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained">Edit</Button>
            </Link>
            <Button
              onClick={this.delete.bind(this, this.state.villageid)}
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
            <Link to="../village" style={{ textDecoration: "none" }}>
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
