import React, { Component } from "react";
import Location from "@material-ui/icons/AddLocationOutlined";
import FlashOn from "@material-ui/icons/FlashOn";
import Home from "@material-ui/icons/Home";
import EventSeat from "@material-ui/icons/EventSeat";
import RecentActors from "@material-ui/icons/RecentActors";
import Whatshot from "@material-ui/icons/Whatshot";
import CheckBoxOutlineBlank from "@material-ui/icons/CheckBoxOutlineBlank";
// import Store from "@material-ui/icons/Store";
import SupervisorLayout from "../../../../OtherComponents/Layout/SupervisorLayout";

import firebase from "../../../../Firebase";
import InfoBox from "./InfoBox";
import Grid from "@material-ui/core/Grid";
const style = {
  height: 420,
  width: 100
};
export const firebaseLooper = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot.val(),
      anganwadicode: childSnapshot.key
    });
  });
  return data;
};
export default class anganwadidetails extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    //.log(this.props.match.params.id);
    //const anganwadicode = "29569020816";
    const anganwadicode = this.props.match.params.id;
    firebase
      .database()
      .ref("users")
      .once("value")
      .then(snapshot => {
        if (snapshot) {
          return snapshot;
        }
      })

      .then(result => {
        var i = 0;
        var attendancecluster = "";
        var infracluster1 = "";
        var infracluster2 = "";
        var infracluster3 = "";
        const data = firebaseLooper(result);
        for (i = 0; i < data.length; i++) {
          if (data[i].anganwadicode === anganwadicode) {
            // console.log(data[i]);

            //collects attendance
            if (data[i].Attendance) {
              var subdata = data[i].Attendance.Count;
              for (let index in subdata) {
                attendancecluster = subdata[index];
              }
            }
            //facilities
            if (data[i].Infrastructure) {
              var subdata = data[i].Infrastructure.facilities;

              for (let index in subdata) {
                infracluster1 = subdata[index];
              }
              // console.log(infracluster1);
            }

            //building status
            if (data[i].Infrastructure) {
              var subdata = data[i].Infrastructure.buildingstatus;

              for (let index in subdata) {
                infracluster2 = subdata[index];
              }
              // console.log(infracluster2);
            }

            //buildingImage
            if (data[i].Infrastructure) {
              var subdata = data[i].Infrastructure.buildingImage;

              for (let index in subdata) {
                infracluster3 = subdata[index];
              }
              // console.log(infracluster3);
            }

            if (data[i].Timeline) {
              var subdata = data[i].Timeline.DailyUsageStock;

              for (let index in subdata) {
                infracluster3 = subdata[index];
              }
              // console.log(infracluster3);
            }
            var todaysDate = new Date();
            var day1 = todaysDate.getDate();
            var month1 = todaysDate.getMonth() + 1;
            var year1 = todaysDate.getFullYear();
            var todaysDatefinal = day1 + "/" + month1 + "/" + year1;
            if (attendancecluster.date) {
              var d = attendancecluster.date;

              d = d.split(" ")[0];

              var attendanceclusterDate = d;
            }

            var enteredDatefinal = attendanceclusterDate;

            this.setState({
              attendance_date:
                todaysDatefinal === enteredDatefinal
                  ? enteredDatefinal
                  : "DATA NOT AVAILABLE",
              attendance_count: attendancecluster.daycount
                ? attendancecluster.daycount
                : "DATA NOT AVAILABLE",
              infra_powerfacility: infracluster1.Power
                ? infracluster1.Power
                : "DATA NOT AVAILABLE",
              infra_toiletfacility: infracluster1.Toilet
                ? infracluster1.Toilet
                : "DATA NOT AVAILABLE",
              infra_playfacility: infracluster1.Play
                ? infracluster1.Play
                : "DATA NOT AVAILABLE",
              infra_waterfacility: infracluster1.Water
                ? infracluster1.Water
                : "DATA NOT AVAILABLE",
              infra_btypefacility: infracluster2.option
                ? infracluster2.option
                : "DATA NOT AVAILABLE",
              infra_imageurl: infracluster3.BPicture
                ? infracluster3.BPicture
                : "DATA NOT AVAILABLE"
            });
          }
        }
      })
      .catch(error => {
        this.setState({ error, isLoading: false });
        console.log("Error! " + error);
        alert("Error! " + error);
      });
  }

  render() {
    //  console.log(this.state);
    return (
      <SupervisorLayout>
        {/* <CardMedia>
          <img src={this.state.infra_imageurl} style={style} />
        </CardMedia> */}

        <Grid container spacing={24}>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={RecentActors}
              color={
                !(this.state.attendance_count === "DATA NOT AVAILABLE") &&
                this.state.attendance_count
                  ? "#27ae60"
                  : this.state.attendance_count === "DATA NOT AVAILABLE"
                  ? "#1B9CFC"
                  : "#c0392b"
              }
              title="Today's Attendance"
              value={this.state.attendance_count}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={FlashOn}
              color={
                !(this.state.infra_powerfacility === "DATA NOT AVAILABLE") &&
                this.state.infra_powerfacility === "Yes"
                  ? "#27ae60"
                  : this.state.infra_powerfacility === "DATA NOT AVAILABLE"
                  ? "#1B9CFC"
                  : "#c0392b"
              }
              title="Electricity Facility?"
              value={this.state.infra_powerfacility}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={CheckBoxOutlineBlank}
              color={
                !(this.state.infra_playfacility === "DATA NOT AVAILABLE") &&
                this.state.infra_playfacility === "Yes"
                  ? "#27ae60"
                  : this.state.infra_playfacility === "DATA NOT AVAILABLE"
                  ? "#1B9CFC"
                  : "#c0392b"
              }
              title="Playground Facility?"
              value={this.state.infra_playfacility}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={Whatshot}
              color={
                !(this.state.infra_waterfacility === "DATA NOT AVAILABLE") &&
                this.state.infra_waterfacility === "Yes"
                  ? "#27ae60"
                  : this.state.infra_waterfacility === "DATA NOT AVAILABLE"
                  ? "#1B9CFC"
                  : "#c0392b"
              }
              title="Water Facility?"
              value={this.state.infra_waterfacility}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={EventSeat}
              color={
                !(this.state.infra_toiletfacility === "DATA NOT AVAILABLE") &&
                this.state.infra_toiletfacility
                  ? "#27ae60"
                  : this.state.infra_toiletfacility === "DATA NOT AVAILABLE"
                  ? "#1B9CFC"
                  : "#c0392b"
              }
              title="Toilet Facility?"
              value={this.state.infra_toiletfacility}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InfoBox
              Icon={Home}
              color="#f7c744"
              title="Building Type"
              value={this.state.infra_btypefacility}
            />
          </Grid>
        </Grid>
      </SupervisorLayout>
    );
  }
}
