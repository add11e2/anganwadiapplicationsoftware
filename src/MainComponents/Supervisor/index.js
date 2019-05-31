import React from "react";
import { cyan, pink, purple, orange } from "@material-ui/core/colors";
import Assessment from "@material-ui/icons/Assessment";
import Face from "@material-ui/icons/Face";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InfoBox from "./InfoBox";
import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import SupervisorLayout from "../../OtherComponents/Layout/SupervisorLayout";
import firebase from "../../Firebase";
import Location from "@material-ui/icons/AddLocationOutlined";
import SubLocation from "@material-ui/icons/AddLocation";
import SubSubLocation from "@material-ui/icons/MyLocation";
import { basename } from "path";
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
export const datatablecreator = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    if (childSnapshot.val().talukid == this.state.supervisorcircle) {
      data.push({
        talukname: childSnapshot.val().talukname,
        villagename: childSnapshot.val().villagename,
        awcplace: childSnapshot.val().awcplace
      });
    }
  });

  return data;
};
const logoutHandler = () => {
  firebase
    .auth()
    .signOut()
    .then(
      () => {
        console.log("Log out succesfull");
      },
      error => {
        console.log("Error logging out");
      }
    );
};
export default class CEO_DD_DCDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datatotables: [],
      data: "",
      awccount: 0,
      supervisorcircle: "",
      currentuserflag:""
    };
  }
   datatablecreator = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (childSnapshot.val().talukid == this.state.supervisorcircle) {
        data.push({
          talukname: childSnapshot.val().talukname,
          villagename: childSnapshot.val().villagename,
          awcplace: childSnapshot.val().awcplace
        });
      }
    });
  
    return data;
  };
  componentDidMount() {
    console.log(this.props.user.uid, "CURRENT UID");
    const currentuser=this.props.user.uid;
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
            console.log("ROLE");
            console.log(supervisordata[b].anganwadicenter_code);
            supervisoranganwadiarray[b]=supervisordata[b].anganwadicenter_code.toString();
            currentuserflag++;
          }
         
        }
        console.log(supervisoranganwadiarray);

        firebase
        .database()
        .ref("anganwadicenter")
        .once("value")
        .then(snapshot => {
          const anganwadicenterdata = firebaseLooper(snapshot);
          var awccount = 0;
          for (var i = 0; i < anganwadicenterdata.length; i++) {
            if (anganwadicenterdata[i].anganwadicenter_code == supervisoranganwadiarray[i]) {
              awccount++;
              finaldata.push({
                awcplace:anganwadicenterdata[i].awcplace
              });
            }
          }
          var filteredarray = Object.values(finaldata);
          var datatotables = filteredarray.map(el => Object.values(el));
         
          this.setState({
            datatotables: datatotables,
            awccount: awccount
          });
          this.callDataTable();
        })
        .catch(e => {
          console.log("error returned - ", e);
        });
        this.setState({
          supervisorcircle: supervisorcircle,
          currentuserflag:currentuserflag,
          data:'yes'
        });

      });
   ;
    firebase
      .database()
      .ref("awcplace")
      .once("value")
      .then(snapshot => {
        const awcplacedata = firebaseLooper(snapshot);
        var awccount = 0;
        for (var i = 0; i < awcplacedata.length; i++) {
          if (awcplacedata[i].talukid == this.state.supervisorcircle) {
            awccount++;
          }
        }
       
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }

  callDataTable() {
    if (!this.el) return;
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.state.datatotables,
      columns: [
        { title: "AWC PLACES " }
      ]
    });
  }
  render() {
    if (!this.state.data) {
      return <div />
  }
    return (
      <SupervisorLayout>
        <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

        <Grid container spacing={24}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={SubLocation}
              color="#f7c744"
              title="No of talukas"
              value={this.state.talukacount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={SubLocation}
              color="#D3D3D3"
              title="No of villages"
              value={this.state.villagecount}
            />
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={SubLocation}
              color="#ADD8E6"
              title="No of awcplaces"
              value={this.state.awccount}
            />
          </Grid>
        </Grid>
        <br />
        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={12}>
            <table
              className="display"
              width="100%"
              ref={el => (this.el = el)}
            />
          </Grid>
        </Grid>
        
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
