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
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormLabel from "@material-ui/core/FormLabel";
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
      talukname: "",
      talukid: "",
      data: [],
      successindicator: 0
    };
  }

  componentWillMount() {
    var editid = this.props.match.params.id;

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
      });
  }

  handleChange = e => {
    const state = this.state;
    state[e.target.name] = e.target.value;
    this.setState(state);
  };

  onSubmit = e => {
    e.preventDefault();

    // console.log(this.state.talukid);
    console.log(this.state);
    const { talukid, talukname } = this.state;
    const username = this.state.username;
    const gender = this.state.gender;
    const mobileno = this.state.mobileno;
    const emailid = this.state.emailid;
    const dateofbirth = this.state.dateofbirth;
    const ceodddcid = this.state.ceodddcid;

    firebase
      .database()
      .ref(`ceo_dd_dc/${ceodddcid}`)
      .update({
        ceo_dd_dc_name: username,
        ceo_dd_dc_gender: gender,
        ceo_dd_dc_mobileno: mobileno,
        ceo_dd_dc_emailid: emailid,
        ceo_dd_dc_dateofbirth: dateofbirth,
        ceo_dd_dc_id: ceodddcid
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
  handlegenderChange(event) {
    this.setState({ gender: event.target.value });
  }
  render() {
    return (
      <AdminLayout>
        <h3 style={globalStyles.title}>Edit taluka name</h3>
        <form onSubmit={this.onSubmit}>
          <div>
            {!this.state.successindicator ? (
              <div>
                <FormControl fullWidth={true} error>
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
              <Link to="../ceodcdd" style={{ textDecoration: "none" }}>
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
