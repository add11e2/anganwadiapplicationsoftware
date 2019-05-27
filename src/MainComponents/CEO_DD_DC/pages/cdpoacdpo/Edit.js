import React, { Component } from "react";
import firebase from "../../../../Firebase";
import CEO_DD_DCLayout from "../../../../OtherComponents/Layout/CEO_DD_DCLayout";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import globalStyles from "../../../styles";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import { Link } from "react-router-dom";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
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
  editButton: {
    float: "left",
    width: "10%",
    height: "10%",
    backgroundColor: "#D8000C"
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
export const optionsmaker = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    if (childSnapshot.val().tstatus === 0) {
      data.push({
        label: childSnapshot.val().talukname,
        value: childSnapshot.key
      });
    }
  });
  return data;
};
class Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      talukname: "",
      talukid: "",
      data: [],
      successindicator: 0,
      value: ""
    };
    this.changetaluka = this.changetaluka.bind(this);
    this.changetaluka2 = this.changetaluka2.bind(this);
  }

  componentWillMount() {
    var editid = this.props.match.params.id;

    firebase
      .database()
      .ref(`cdpo_acdpo/${editid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();
        console.log(snapshot.val());
        if (data !== null) {
          this.setState({
            talukid: data.talukid,
            talukname: data.talukname,
            username: data.cdpo_acdpo_name,
            gender: data.cdpo_acdpo_gender,
            mobileno: data.cdpo_acdpo_mobileno,
            emailid: data.cdpo_acdpo_emailid,
            dateofbirth: data.cdpo_acdpo_dateofbirth,
            cdpoacdpoid: editid
          });
        }
      });
  }

  handleChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };
  handleChange1 = value => this.setState({ value });
  onSubmit = e => {
    e.preventDefault();

    // console.log(this.state.talukid);
    console.log(this.state);
    const selectedtaluknamenew = "";
    const selectedtalukidnew = "";
    const { talukid, talukname } = this.state;
    const username = this.state.username;
    const gender = this.state.gender;
    const mobileno = this.state.mobileno;
    const emailid = this.state.emailid;
    const dateofbirth = this.state.dateofbirth;
    const cdpoacdpoid = this.state.cdpoacdpoid;
    if (this.state.value) {
      selectedtaluknamenew = this.state.value.label;
      selectedtalukidnew = this.state.value.value;
    }
    const selectedtalukname = this.state.talukname;
    const selectedtalukid = this.state.talukid;
    firebase
      .database()
      .ref(`cdpo_acdpo/${cdpoacdpoid}`)
      .update({
        cdpo_acdpo_name: username,
        cdpo_acdpo_gender: gender,
        cdpo_acdpo_mobileno: mobileno,
        cdpo_acdpo_emailid: emailid,
        cdpo_acdpo_dateofbirth: dateofbirth,
        cdpo_acdpo_id: cdpoacdpoid,
        talukid: selectedtalukidnew ? selectedtalukidnew : selectedtalukid,
        talukname: selectedtaluknamenew
          ? selectedtaluknamenew
          : selectedtalukname
      })
      .then(() => {})
      .catch(error => {
        console.error("Error updating document: ", error);
      });
    var successindicator = 0;
    successindicator++;

    this.setState({
      successindicator: successindicator
    });
  };
  handlegenderChange(event) {
    this.setState({ gender: event.target.value });
  }

  changetaluka() {
    const selectedtalukid = this.state.talukid;
    firebase
      .database()
      .ref(`taluk/${selectedtalukid}`)
      .update({
        tstatus: 0
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
      });
    this.setState({ changetalukname: "yes" });
  }
  changetaluka2() {
    console.log("working");
    const selectedtalukid = this.state.talukid;
    firebase
      .database()
      .ref(`taluk/${selectedtalukid}`)
      .update({
        tstatus: 1
      });
    this.setState({ changetalukname: "no" });
  }
  render() {
    return (
      <CEO_DD_DCLayout>
        <h3 style={globalStyles.title}>Edit credentials</h3>
        <form onSubmit={this.onSubmit}>
          {!this.state.successindicator ? (
            <div>
              <FormControl fullWidth={true} error>
                {" "}
                {this.state.changetalukname === "yes" ? (
                  <div>
                    <Select
                      onChange={this.handleChange1}
                      value={this.state.value}
                      options={this.state.options}
                      style={{ padding: 8 }}
                    />
                    <br />
                    <Button
                      style={styles.editButton}
                      variant="contained"
                      type="submit"
                      color="primary"
                      onClick={this.changetaluka2}
                    >
                      CANCEL
                    </Button>
                  </div>
                ) : (
                  <div>
                    <TextField
                      name="talukname"
                      value={this.state.talukname}
                      hintText="username"
                      fullWidth={true}
                      margin="normal"
                      variant="outlined"
                      disabled
                    />
                    <br />
                    <Button
                      style={styles.editButton}
                      variant="contained"
                      type="submit"
                      color="primary"
                      onClick={this.changetaluka}
                    >
                      Edit taluka
                    </Button>
                  </div>
                )}
                <TextField
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                  hintText="username"
                  fullWidth={true}
                  margin="normal"
                  variant="outlined"
                />
                {this.state.username === "" ? (
                  <FormHelperText id="component-error-text">
                    Required*
                  </FormHelperText>
                ) : null}
              </FormControl>
              <FormControl fullWidth={true} error>
                <TextField
                  name="emailid"
                  value={this.state.emailid}
                  onChange={this.handleChange}
                  hintText="emailid"
                  fullWidth={true}
                  margin="normal"
                  variant="outlined"
                />
                {this.state.emailid === "" ? (
                  <FormHelperText id="component-error-text">
                    Required*
                  </FormHelperText>
                ) : (
                  <div>
                    {!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(
                      this.state.emailid
                    ) ? (
                      <FormHelperText id="component-error-text">
                        Invalid email address
                      </FormHelperText>
                    ) : null}
                  </div>
                )}
              </FormControl>
              <FormControl fullWidth={true} error>
                <TextField
                  name="mobileno"
                  value={this.state.mobileno}
                  onChange={this.handleChange}
                  type="number"
                  hintText="Mobile no"
                  fullWidth={true}
                  margin="normal"
                  variant="outlined"
                />
                {this.state.mobileno === "" ? (
                  <FormHelperText id="component-error-text">
                    Required*
                  </FormHelperText>
                ) : (
                  <div>
                    {this.state.mobileno === "" ? (
                      <FormHelperText id="component-error-text">
                        Invalid Mobile No
                      </FormHelperText>
                    ) : null}
                  </div>
                )}{" "}
              </FormControl>
              <FormControl fullWidth={true} error>
                <TextField
                  name="dateofbirth"
                  value={this.state.dateofbirth}
                  onChange={this.handleChange}
                  label="Date of birth"
                  type="date"
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true
                  }}
                  margin="normal"
                  fullWidth={true}
                />{" "}
                {this.state.dateofbirth === "" ? (
                  <FormHelperText id="component-error-text">
                    Required*
                  </FormHelperText>
                ) : null}{" "}
              </FormControl>
              <FormControl component="fieldset" fullWidth={true}>
                {" "}
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  aria-label="Gender"
                  name="gender"
                  value={this.state.gender}
                  onChange={this.handleChange}
                >
                  return (
                  <fieldset onChange={this.handlegenderChange.bind(this)}>
                    <label>
                      <Radio
                        label="Male"
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={this.state.gender === "Male"}
                      />
                      Male
                    </label>
                    <label>
                      <Radio
                        label="Female"
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={this.state.gender === "Female"}
                      />
                      Female
                    </label>
                  </fieldset>
                  ) }
                </RadioGroup>
                {this.state.gender === "" ? (
                  <FormHelperText
                    id="component-error-text"
                    style={{ color: "red" }}
                  >
                    Required*
                  </FormHelperText>
                ) : null}{" "}
              </FormControl>
            </div>
          ) : (
            <div style={styles.successDiv}>User updated successfully!!</div>
          )}

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
              <Link to="../cdpoacdpo" style={{ textDecoration: "none" }}>
                <Button variant="contained">
                  {" "}
                  <KeyboardArrowLeft />
                  Go Back
                </Button>
              </Link>
            </div>
          )}
        </form>
      </CEO_DD_DCLayout>
    );
  }
}

export default Edit;
