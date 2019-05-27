import React, { Component } from "react";
import firebase from "../../../../Firebase";
import AdminLayout from "../../../../OtherComponents/Layout/AdminLayout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import globalStyles from "../../../styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import { Link } from "react-router-dom";

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
  }
};
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      awcplacename: "",
      awcplaceid: "",
      data: [],
      successindicator: 0
    };
  }

  componentWillMount() {
    var editid = this.props.match.params.id;

    firebase
      .database()
      .ref(`awcplace/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        //  console.log(editid);
        this.setState({
          awcplacename: data.awcplace,
          villagename: data.villagename,
          talukname: data.talukname,
          awcplaceid: editid,
          isLoading: false
        });
      });
  }

  onChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    // console.log(this.state.villageid);
    console.log(this.state);
    const { awcplaceid, awcplacename } = this.state;

    firebase
      .database()
      .ref(`awcplace/${awcplaceid}`)
      .update({
        awcplace: awcplacename
      })
      .then(() => {
        var successindicator = 0;
        successindicator++;

        this.setState({
          successindicator: successindicator
        });
      })
      .catch(error => {
        console.error("Error updating document: ", error);
      });
  };

  render() {
    return (
      <AdminLayout>
        <h3 style={globalStyles.title}>Edit taluka name</h3>
        <form onSubmit={this.onSubmit}>
          <div>
            {!this.state.successindicator ? (
              <div>
                <TextField
                  fullWidth={true}
                  margin="normal"
                  name="talukname"
                  value={this.state.talukname}
                  onChange={this.onChange}
                  disabled
                />
                <TextField
                  fullWidth={true}
                  margin="normal"
                  name="villagename"
                  value={this.state.villagename}
                  onChange={this.onChange}
                  disabled
                />
                <TextField
                  hintText="awcplacename"
                  label="awcplacename"
                  fullWidth={true}
                  margin="normal"
                  name="awcplacename"
                  value={this.state.awcplacename}
                  onChange={this.onChange}
                />
              </div>
            ) : (
              <div style={styles.successDiv}>Updated successfully!!</div>
            )}
          </div>

          {!this.state.successindicator ? (
            <div style={styles.buttons}>
              <Button
                style={styles.saveButton}
                variant="contained"
                type="submit"
                color="primary"
              >
                Update
              </Button>
            </div>
          ) : (
            <div style={styles.buttons}>
              <Link to="../awcplace" style={{ textDecoration: "none" }}>
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

export default Edit;
