import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "../../../../Firebase";
import TextField from "@material-ui/core/TextField";
import SupervisorLayout from "../../../../OtherComponents/Layout/SupervisorLayout";
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
  approveButton: {
    marginLeft: 5,
    backgroundColor: "green"
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
      Aspirin: 0,
      Benzyl_benzoate: 0,
      Chloroquine: 0,
      Co_trimoxazole_syrup: 0,
      Co_trimoxazole_tablet: 0,
      Iron_and_folic_acid: 0,
      Mebendazole: 0,
      Oralrehydrationsalts: 0,
      Paracetamol: 0,
      Request_Status: 0,
      Sulphadimidine: 0,
      Vitamin_A_solution: 0,
      amalice_rich: 0,
      chilli: 0,
      egg: 0,
      food_provided_today: 0,
      grams: 0,
      green_gram: 0,
      jaggery: 0,
      mustard_seeds: 0,
      nutritious_food: 0,
      oil: 0,
      protien_food: 0,
      salt: 0,
      successindicator: 0
    };
  }

  componentDidMount() {
    var awid = this.props.match.params.awid;
    var awrid = this.props.match.params.awrid;
    console.log(awid, awrid);
    firebase
      .database()
      .ref(`users/${awid}/Timeline/DailyUsageRequest/${awrid}`)
      .once("value")
      .then(snapshot => {
        const data = snapshot.val();

        this.setState({
          awid: awid,
          awrid: awrid,
          Aspirin: data.Aspirin ? data.Aspirin : "NOT REQUIRED",
          Benzyl_benzoate: data.Benzyl_benzoate
            ? data.Benzyl_benzoate
            : "NOT REQUIRED",
          Chloroquine: data.Chloroquine ? data.Chloroquine : "NOT REQUIRED",
          Co_trimoxazole_syrup: data.Co_trimoxazole_syrup
            ? data.Co_trimoxazole_syrup
            : "NOT REQUIRED",
          Co_trimoxazole_tablet: data.Co_trimoxazole_tablet
            ? data.Co_trimoxazole_tablet
            : "NOT REQUIRED",
          Iron_and_folic_acid: data.Iron_and_folic_acid
            ? data.Iron_and_folic_acid
            : "NOT REQUIRED",
          Mebendazole: data.Mebendazole ? data.Mebendazole : "NOT REQUIRED",
          Oralrehydrationsalts: data.Oralrehydrationsalts
            ? data.Oralrehydrationsalts
            : "NOT REQUIRED",
          Paracetamol: data.Paracetamol ? data.Paracetamol : "NOT REQUIRED",
          Request_Status: data.Request_Status,
          Sulphadimidine: data.Sulphadimidine
            ? data.Sulphadimidine
            : "NOT REQUIRED",
          Vitamin_A_solution: data.Vitamin_A_solution
            ? data.Vitamin_A_solution
            : "NOT REQUIRED",
          amalice_rich: data.amalice_rich ? data.amalice_rich : "NOT REQUIRED",
          chilli: data.chilli ? data.chilli : "NOT REQUIRED",
          egg: data.egg ? data.egg : "NOT REQUIRED",
          food_provided_today: data.food_provided_today
            ? data.food_provided_today
            : "NOT REQUIRED",
          grams: data.grams ? data.grams : "NOT REQUIRED",
          green_gram: data.green_gram ? data.green_gram : "NOT REQUIRED",
          jaggery: data.jaggery ? data.jaggery : "NOT REQUIRED",
          mustard_seeds: data.mustard_seeds
            ? data.mustard_seeds
            : "NOT REQUIRED",
          nutritious_food: data.nutritious_food
            ? data.nutritious_food
            : "NOT REQUIRED",
          oil: data.oil ? data.oil : "NOT REQUIRED",
          protien_food: data.protien_food ? data.protien_food : "NOT REQUIRED",
          salt: data.salt ? data.salt : "NOT REQUIRED"
        });
      });
  }

  approve() {
    var awid = this.state.awid;
    var awrid = this.state.awrid;
    firebase
      .database()
      .ref(`users/${awid}/Timeline/DailyUsageRequest/${awrid}`)
      .update({
        Request_Status: 1
      })

      .catch(error => {
        console.error("Error removing document: ", error);
      });
    this.props.history.push("../../request");
  }

  render() {
    return (
      <SupervisorLayout>
        <h3 style={globalStyles.title}>SUPPLIES LIST</h3>
        <div>
          <p>
            {" "}
            Pressing the approve button will approve the requested resources and
            anganwadi worker will be notified!
          </p>
          {!this.state.successindicator ? (
            <div>
              <TextField
                label="Aspirin"
                value={this.state.Aspirin}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Benzyl_benzoate"
                value={this.state.Benzyl_benzoate}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Chloroquine"
                value={this.state.Chloroquine}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Co_trimoxazole_syrup"
                value={this.state.Co_trimoxazole_syrup}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Co_trimoxazole_tablet"
                value={this.state.Co_trimoxazole_tablet}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Iron_and_folic_acid"
                value={this.state.Iron_and_folic_acid}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Mebendazole"
                value={this.state.Mebendazole}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Oralrehydrationsalts"
                value={this.state.Oralrehydrationsalts}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Paracetamol"
                value={this.state.Paracetamol}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Sulphadimidine"
                value={this.state.Sulphadimidine}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="Vitamin_A_solution"
                value={this.state.Vitamin_A_solution}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="amalice_rich"
                value={this.state.amalice_rich}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="chilli"
                value={this.state.chilli}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="egg"
                value={this.state.egg}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="grams"
                value={this.state.grams}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="green_gram"
                value={this.state.green_gram}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="jaggery"
                value={this.state.jaggery}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="mustard_seeds"
                value={this.state.mustard_seeds}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="nutritious_food"
                value={this.state.nutritious_food}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="oil"
                value={this.state.oil}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="protien_food"
                value={this.state.protien_food}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
              <TextField
                label="salt"
                value={this.state.salt}
                onChange={this.onChange}
                fullWidth={true}
                margin="normal"
                disabled
              />
            </div>
          ) : (
            <div style={styles.successDiv}>Approved & Sent Successfully!!</div>
          )}
        </div>

        {this.state.Request_Status === 0 ? (
          <div style={styles.buttons}>
            <Button
              onClick={this.approve.bind(this)}
              style={styles.approveButton}
              variant="contained"
              type="submit"
              color="primary"
            >
              Approve & Send supplies
            </Button>
          </div>
        ) : (
          <div style={styles.buttons}>
            <Link to="../../request" style={{ textDecoration: "none" }}>
              <Button variant="contained">
                {" "}
                <KeyboardArrowLeft />
                Go Back (Already Approved)
              </Button>
            </Link>
          </div>
        )}
      </SupervisorLayout>
    );
  }
}

export default Show;
