import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import SupervisorLayout from "../../../../OtherComponents/Layout/SupervisorLayout";
import { Link } from "react-router-dom";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import firebase from "../../../../Firebase";
import plusImage from "../../../../Resources/Images/elements/plus_button.png";
import globalStyles from "../../../styles";
const $ = require("jquery");
$.DataTable = require("datatables.net");

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
const logoutHandler = () => {
  firebase
    .auth()
    .signOut()
    .then(
      () => {
        //console.log("Log out succesfull");
      },
      error => {
        //console.log("Error logging out");
      }
    );
};
const styles = {
  saveButton: {
    float: "left",
    marginBottom: 10
  }
};
//FU tstatus: childSnapshot.val().tstatus === 0 ? "NOT ASSIGNED" : "ASSIGNED",


export default class addanganwadiworker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      supervisors: [],
      datatotables: [],
      currentuserflag:"",
      data:"",
      currentuser_supervisor: ""
    };
  }
   datatablecreator = snapshot => {
    let data = [];
  
    snapshot.forEach(childSnapshot => {
      ////console.log(childSnapshot.val().supervisorid,this.state.currentuser_supervisor,"Final comparison","IJc8Wxj2zfesWdAEHFGG3y9x3ti2");
      if(childSnapshot.val().supervisorid==this.state.currentuser_supervisor){
       
      data.push({
        anganwadiworker_assignto_center_status:
          childSnapshot.val().anganwadiworker_assignto_center_status === 0
            ? "<font color=red>NOT ASSIGNED</font>"
            : "<font color=blue>ASSIGNED</font>",
        anganwadiworker_name: childSnapshot.val().anganwadiworker_name,
        anganwadiworker_emailid: childSnapshot.val().anganwadiworker_emailid,
        //  supervisor_dateofbirth: childSnapshot.val().supervisor_dateofbirth,
        anganwadiworker_mobileno: childSnapshot.val().anganwadiworker_mobileno,
        anganwadworker_password: childSnapshot.val().anganwadiworker_password,
        anganwadiworker_edit: "addanganwadiworkerShow/" + childSnapshot.key
      });
    }
    });
  
    return data;
  };
  componentDidMount() {
    //console.log(this.props.user.uid, "CURRENT UID");
    const currentuser=this.props.user.uid;
    this.setState({
      currentuser_supervisor:currentuser
    });
    let finaldata=[];
    firebase
      .database()
      .ref("assignedawcenters_supervisor")
      .once("value")
      .then(snapshot => {
        const supervisordata = firebaseLooper(snapshot);
        var supervisorcircle = "";
        var currentuserflag=0;
        var supervisoranganwadiarray=[];
        for (var b = 0; b < supervisordata.length; b++) {
          if(currentuser==supervisordata[b].supervisorid)
          {
            supervisoranganwadiarray[b]=supervisordata[b].anganwadicenter_code.toString();
            currentuserflag++;
          }
         
        }
        this.setState({
          currentuserflag:currentuserflag,
          data:'yes'
        });
      })
      .catch(e => {
        //console.log("error returned - ", e);
      });


    firebase
      .database()
      .ref("anganwadiworker")
      .once("value")
      .then(snapshot => {
        const orignaldata = firebaseLooper(snapshot);
        //console.log(snapshot.val());
        const filteredata = this.datatablecreator(snapshot);
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));
        //console.log(orignaldata);
        this.setState({
          anganwadiworkers: orignaldata,
          datatotables: datatotables
        });
        this.callDataTable();
      })
      .catch(e => {
        //console.log("error returned - ", e);
      });
  }
  // supervisor_name: childSnapshot.val().supervisor_name,
  // supervisor_emailid: childSnapshot.val().supervisor_emailid,
  // supervisor_mobileno: childSnapshot.val().supervisor_mobileno,
  // supervisor_password: childSnapshot.val().supervisor_password,
  // supervisor_id: "ceodcddShow/" + childSnapshot.key
  callDataTable() {
    if (!this.el) return;
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.state.datatotables,
      columns: [
        { title: "Assigned to anganwadi center?" },
        { title: "Anganwadi worker Name" },
        { title: "Anganwadi worker  EMAIL ID" },
        { title: "Anganwadi worker  MOBILE NO" },
        { title: "Anganwadi worker  PASSWORD" },
        {
          title: "EDIT",
          render: function(data, type) {
            if (type === "display") {
              data = '<a href="' + data + '"class="link_button">EDIT</a>';
            }
            return data;
          }
        }
      ]
    });
  }
  render() {
    if (!this.state.data) {
      return <div />
  }
    return (
      <SupervisorLayout>
        <h3 style={globalStyles.navigation}>
          Application / Add anganwadi worker
        </h3>
        <br />
        <Link to="addanganwadiworkerCreate" style={{ textDecoration: "none" }}>
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to add new anganwadi worker
          </Button>
        </Link>
        <br /> <br />
        <table className="display" width="100%" ref={el => (this.el = el)} />
        <Dialog
       // fullScreen={fullScreen}
      open={this.state.currentuserflag==0}
      style={{
        backgroundColor: 'rgba(255, 40, 0, 0.8)'
      }}
      //  onClose={handleClose}
      //  aria-labelledby="responsive-dialog-title"
      >
      
      <DialogTitle id="responsive-dialog-title">{"YOU ARE NOT AUTHORIZED TO USE THIS PANEL!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
                 
          </DialogContentText>
        </DialogContent>
        <DialogActions>    
        <Link to="/" style={{ textDecoration: "none" }}>   
        <Button
        onClick={() => logoutHandler()}
        style={{
        backgroundColor: '#008CBA',
        color:'white'

      }}>
            HOME
          </Button>
          </Link>

          <Link to="/supervisor/login" style={{ textDecoration: "none" }}>  
          <Button style={{
        backgroundColor: '#008CBA',
        color:'white'

      }}  onClick={() => logoutHandler()}
      autoFocus>
             LOGIN AGAIN
          </Button>
          </Link>
        </DialogActions>
      </Dialog>
      </SupervisorLayout>
    );
  }
}
