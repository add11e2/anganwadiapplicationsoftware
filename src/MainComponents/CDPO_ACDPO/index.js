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
import CDPO_ACDPOLayout from "../../OtherComponents/Layout/CDPO_ACDPOLayout";
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
    if (childSnapshot.val().talukid == this.state.cdpotaluk) {
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
      talukacount: 0,
      villagecount: 0,
      awcplacecount: 0,
      cdpotaluk: "",
      currentuserflag:""
    };
  }
   datatablecreator = snapshot => {
    let data = [];
    snapshot.forEach(childSnapshot => {
      if (childSnapshot.val().talukid == this.state.cdpotaluk) {
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


    firebase
      .database()
      .ref("cdpo_acdpo")
      .once("value")
      .then(snapshot => {
        const cdpodata = firebaseLooper(snapshot);
        var cdpotaluk = "";
        var currentuserflag=0;
        for (var i = 0; i < cdpodata.length; i++) {
          
          cdpotaluk = cdpodata[i].talukid;
        }
        for (var b = 0; b < cdpodata.length; b++) {
          if(currentuser==cdpodata[b].cdpo_acdpo_id)
          {
            console.log(cdpodata[b].role,"ROLE");
            currentuserflag++;
          }
          
         
        }

        this.setState({
          cdpotaluk: cdpotaluk,
          currentuserflag:currentuserflag,
          data:'yes'
        });
      }).catch(e => {
        console.log("error returned - ", e);
      });
    firebase
      .database()
      .ref("taluk")
      .once("value")
      .then(snapshot => {
        const talukdata = firebaseLooper(snapshot);
        var talukcount = 0;
        for (var i = 0; i < talukdata.length; i++) {
          if (talukdata[i].id == this.state.cdpotaluk) {
            talukcount++;
          }
        }
        this.setState({
          talukacount: talukcount
        });
      }).catch(e => {
        console.log("error returned - ", e);
      });
    firebase
      .database()
      .ref("village")
      .once("value")
      .then(snapshot => {
        const villagedata = firebaseLooper(snapshot);

        var villagecount = 0;
        for (var i = 0; i < villagedata.length; i++) {
          if (villagedata[i].talukid == this.state.cdpotaluk) {
            villagecount++;
          }
        }
        this.setState({
          villagecount: villagecount
        });
      }).catch(e => {
        console.log("error returned - ", e);
      }).catch(e => {
        console.log("error returned - ", e);
      });

    firebase
      .database()
      .ref("awcplace")
      .once("value")
      .then(snapshot => {
        const awcplacedata = firebaseLooper(snapshot);
        var awccount = 0;
        for (var i = 0; i < awcplacedata.length; i++) {
          if (awcplacedata[i].talukid == this.state.cdpotaluk) {
            awccount++;
          }
        }
        const finaldata = this.datatablecreator(snapshot);
        var filteredarray = Object.values(finaldata);
        var datatotables = filteredarray.map(el => Object.values(el));
        console.log(awcplacedata);
        this.setState({
          datatotables: datatotables,
          awcplacecount: awccount
        });
        this.callDataTable();
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
        { title: "TALUK NAME" },
        { title: "VILLAGE NAME" },
        { title: "AWC PLACE NAME" }
      ]
    });
  }
  render() {
    console.log(this.state.data);
    if (!this.state.data) {
      return <div />
  }
    return (
      <CDPO_ACDPOLayout>
        <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

        <Grid container spacing={24}>
          {/* <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={SubLocation}
              color="#f7c744"
              title="No of talukas"
              value={this.state.talukacount}
            />
          </Grid> */}
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={SubLocation}
              color="#D3D3D3"
              title="No of villages"
              value={this.state.villagecount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={SubLocation}
              color="#ADD8E6"
              title="No of awcplaces"
              value={this.state.awcplacecount}
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

          <Link to="/cdpoacdpo/login" style={{ textDecoration: "none" }}>  
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
      </CDPO_ACDPOLayout>
    );
  }
}
