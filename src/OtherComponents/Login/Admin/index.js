import React from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { render } from "react-dom";
import firebase from "../../../Firebase";
import Check from "@material-ui/icons/Check";
export const firebaseLooper = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val()
    });
  });
  return data;
};
const styles = theme => ({
  error_label: {
    color: "red"
  },
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: "black"
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class SignIn extends React.Component {
  state = {
    formError: false,
    inputemail: "",
    inputpassword: ""
  };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }
  submitForm(event) {
    event.preventDefault();

    let email = this.state.inputemail;
    let password = this.state.inputpassword;

    console.log(email);

    if (
      new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(email) &&
      password.length > 5
    ) {
      firebase
        .database()
        .ref("admin")
        .once("value")
        .then(snapshot => {
          var res = firebaseLooper(snapshot);
          var i = 0;
          var checkflag = false;
          for (i = 0; i < res.length; i++) {
            if (res[i].role === "admin" && res[i].emailid === email) {
              checkflag = true;
              //console.log("checkflag");
              break;
            } else if (!checkflag) {
              // console.log("!checkflag");
              break;
            }
          }

          if (checkflag) {
            //            console.log("VALID REQUEST 1");
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                //              console.log("VALID REQUEST 2");
                this.props.history.push("/admin/admindashboard");
              });
          } else if (!checkflag) {
            //        console.log("INVALID REQUEST");

            alert("You are not a valid user");
            firebase
              .auth()
              .setPersistence(firebase.auth.Auth.Persistence.SESSION)
              .then(() => {
                this.props.history.push("/");
              });
          }
        });
    } else {
      this.setState({
        formError: true
      });
    }
  }
  handleChange({ target }) {
    this.setState({
      [target.name]: target.value
    });
  }
  render() {
    const { classes } = this.props;

    return (
      <main className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Admin
          </Typography>
          <form
            className={classes.form}
            onSubmit={event => this.submitForm(event)}
          >
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input
                id="email"
                name="inputemail"
                autoComplete="email"
                placeholder="Enter email here..."
                value={this.state.inputemail}
                onChange={this.handleChange}
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input
                name="inputpassword"
                type="password"
                id="inputpassword"
                value={this.state.inputpassword}
                onChange={this.handleChange}
              />
            </FormControl>
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}

            {this.state.formError ? (
              <div className={classes.error_label}>
                Please re-check your email or password
              </div>
            ) : null}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={event => this.submitForm(event)}
            >
              Log in
            </Button>
          </form>
        </Paper>
      </main>
    );
  }
}
SignIn.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
