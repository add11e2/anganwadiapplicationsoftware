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
      .ref(`assignedawcenters_supervisor/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        this.setState({
          anganwadicenter_code: data.anganwadicenter_code,
          anganwadicenterid: data.anganwadicenterid,
          supervisor_emailid: data.supervisor_emailid,
          assignsupervisortoawcid: editid
        });
      });
    console.log(editid);
  }

  delete(deleteid) {
    firebase
      .database()
      .ref(`assignedawcenters_supervisor/${deleteid}`)
      .remove()
      .then(() => {
        var successindicator = 0;
        successindicator++;
        this.setState({
          successindicator: successindicator
        });
        firebase
          .database()
          .ref(`anganwadicenter/${this.state.anganwadicenterid}`)
          .update({
            anganwadicenter_supervisorassignstatus: 0
          });
      })
      .catch(error => {
        console.error("Error removing document: ", error);
      });
  }

  render() {
    return (
      <CDPO_ACDPOLayout>
        <h3 style={globalStyles.title}>Edit</h3>
        <div>
          <p> Pressing the remove button will remove center from supervisor!</p>
          {!this.state.successindicator ? (
            <div>
              <TextField
                value={this.state.anganwadicenter_code}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                value={this.state.supervisor_emailid}
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
            <Button
              onClick={this.delete.bind(
                this,
                this.state.assignsupervisortoawcid
              )}
              style={styles.deleteButton}
              variant="contained"
              type="submit"
              color="primary"
            >
              REMOVE
            </Button>
          </div>
        ) : (
          <div style={styles.buttons}>
            <Link
              to="../assignsupervisortoawc"
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
      </CDPO_ACDPOLayout>
    );
  }
}

export default Show;
