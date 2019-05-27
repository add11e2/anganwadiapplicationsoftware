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
import AdminLayout from "../../OtherComponents/Layout/AdminLayout";
import firebase from "../../Firebase";
import Location from "@material-ui/icons/AddLocationOutlined";
import SubLocation from "@material-ui/icons/AddLocationOutlined";
import SubSubLocation from "@material-ui/icons/AddLocationOutlined";

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
      awcplacecount: 0
    };
  }
  componentDidMount() {
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
    return (
      <AdminLayout>
        <h3 style={globalStyles.navigation}>Application / Dashboard</h3>

        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={3}>
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
          </Grid>
        </Grid>
      </AdminLayout>
    );
  }
}
