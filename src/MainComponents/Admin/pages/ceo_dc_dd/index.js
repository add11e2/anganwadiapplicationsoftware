import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import AdminLayout from "../../../../OtherComponents/Layout/AdminLayout";
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
        console.log("Log out succesfull");
      },
      error => {
        console.log("Error logging out");
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
export const datatablecreator = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ceo_dd_dc_name: childSnapshot.val().ceo_dd_dc_name,
      ceo_dd_dc_emailid: childSnapshot.val().ceo_dd_dc_emailid,
      //  ceo_dd_dc_dateofbirth: childSnapshot.val().ceo_dd_dc_dateofbirth,
      ceo_dd_dc_mobileno: childSnapshot.val().ceo_dd_dc_mobileno,
      ceo_dd_dc_password: childSnapshot.val().ceo_dd_dc_password,
      ceo_dd_dc_id: "ceodcddShow/" + childSnapshot.key
    });
  });
  return data;
};

export default class cdodcdd extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ceo_dd_dcs: [],
      datatotables: [],
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
      .ref("ceo_dd_dc")
      .once("value")
      .then(snapshot => {
        const orignaldata = firebaseLooper(snapshot);
        const filteredata = datatablecreator(snapshot);
        var filteredarray = Object.values(filteredata);
        var datatotables = filteredarray.map(el => Object.values(el));
        console.log(orignaldata);
        this.setState({
          ceo_dd_dcs: orignaldata,
          datatotables: datatotables
        });
        this.callDataTable();
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }
  // ceo_dd_dc_name: childSnapshot.val().ceo_dd_dc_name,
  // ceo_dd_dc_emailid: childSnapshot.val().ceo_dd_dc_emailid,
  // ceo_dd_dc_mobileno: childSnapshot.val().ceo_dd_dc_mobileno,
  // ceo_dd_dc_password: childSnapshot.val().ceo_dd_dc_password,
  // ceo_dd_dc_id: "ceodcddShow/" + childSnapshot.key
  callDataTable() {
    if (!this.el) return;
    this.$el = $(this.el);
    this.$el.DataTable({
      data: this.state.datatotables,
      columns: [
        { title: "CEO/DC/DD NAME" },
        { title: "CEO/DC/DD EMAIL ID" },
        { title: "CEO/DC/DD MOBILE NO" },
        { title: "CEO/DC/DD PASSWORD" },
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
      <AdminLayout>
        <h3 style={globalStyles.navigation}>Application / Add CEO/DC/DD</h3>
        <br />
        <Link to="ceodcddCreate" style={{ textDecoration: "none" }}>
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
          >
            <img src={plusImage} height="25" width="25" />
            &nbsp;&nbsp;&nbsp; Click here to add new CEO/DC/DD
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
