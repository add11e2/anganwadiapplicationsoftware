import React from "react";
import { cyan, pink, purple, orange } from "@material-ui/core/colors";
import Assessment from "@material-ui/icons/Assessment";
import Face from "@material-ui/icons/Face";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ShoppingCart from "@material-ui/icons/ShoppingCart";
import InfoBox from "./InfoBox";
import globalStyles from "../styles";
import Grid from "@material-ui/core/Grid";
import Data from "./AdminComponents/admindata";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AdminLayout from "../../OtherComponents/Layout/AdminLayout";
import firebase from "../../Firebase";
import Location from "@material-ui/icons/AddLocationOutlined";
import SubLocation from "@material-ui/icons/AddLocationOutlined";
import SubSubLocation from "@material-ui/icons/AddLocationOutlined";

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

export default class AdminDash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      talukacount: 0,
      villagecount: 0,
      awcplacecount: 0,
      currentuserflag:"",
      data:""
    };
  }
  componentDidMount() {
    console.log(this.props.user.uid, "CURRENT UID");
    const currentuser=this.props.user.uid;


    firebase
      .database()
      .ref("admin")
      .once("value")
      .then(snapshot => {
        const admindata = firebaseLooper(snapshot);
        var currentuserflag=0;     
        for (var b = 0; b < admindata.length; b++) {
         
          if(admindata[b]){
            console.log(currentuser,admindata[b].id,currentuser===admindata[b].id,currentuser.toString()===admindata[b].id.toString());
          if(currentuser.toString()==admindata[b].id.toString())
          {
         //   console.log(admindata[b].role,"ROLE");
            currentuserflag++;
          }
        }
         
        }

        this.setState({
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
        this.setState({
          talukacount: talukdata.length
        });
      });
    firebase
      .database()
      .ref("village")
      .once("value")
      .then(snapshot => {
        const villagedata = firebaseLooper(snapshot);
        this.setState({
          villagecount: villagedata.length
        });
      });
    firebase
      .database()
      .ref("awcplace")
      .once("value")
      .then(snapshot => {
        const awcplacedata = firebaseLooper(snapshot);
        this.setState({
          awcplacecount: awcplacedata.length
        });
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }
  render() {
    if (!this.state.data) {
      return <div />
  }
    return (
      <AdminLayout>
        <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

        <Grid container spacing={24}>
        <h3 style={{ fontWeight:'bold',fontSize:30,textAlign:'center'}}>Welcome to admin dashboard</h3>
          {/* <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={Location}
              color="#f7c744"
              title="No of talukas"
              value={this.state.talukacount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={Location}
              color="#D3D3D3"
              title="No of villages"
              value={this.state.villagecount}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={Location}
              color="#ADD8E6"
              title="No of awcplaces"
              value={this.state.awcplacecount}
            />
          </Grid> */}
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

          <Link to="/admin/login" style={{ textDecoration: "none" }}>  
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
      </AdminLayout>
    );
  }
}
