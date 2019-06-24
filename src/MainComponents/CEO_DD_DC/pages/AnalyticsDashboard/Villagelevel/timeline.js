import "../../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";
import firebase from "../../../../../Firebase";
import Select from "react-select"; // v 1.3.0
import "react-select/dist/react-select.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import CEO_DD_DCLayout from "../../../../../OtherComponents/Layout/CEO_DD_DCLayout";
import refershicon from "../../../../../Resources/Images/elements/refresh.png";
import "./styles.css";
const $ = require("jquery");
$.DataTable = require("datatables.net");

const datatypeoption = [
  {
    value: "Chart",
    label: "Chart"
  },
  {
    value: "Table",
    label: "Table"
  }
];
let options = [];
let index = 4;
options[0] = {};
options[0].value = "All";
options[0].label = "All";
options[1] = {};
options[1].value = "Today";
options[1].label = "Today";
options[2] = {};
options[2].label = "This Month";
options[2].value = "This Month";
options[3] = {};
options[3].value = "Last 3 Month";
options[3].label = "Last 3 Month";

const dt = new Date();
const year = dt.getFullYear() - 10;
for (let i = dt.getFullYear(); i > year; i--) {
  options[index] = {};
  options[index].value = i;
  options[index].label = i;
  index++;
}
const chartselectoptions = [
  {
    value: "Food Consumption in anganwadi's (Year)",
    label: "Food Consumption in anganwadi's (Year)"
  },
  {
    value: "Beneficieries of food services",
    label: "Beneficieries of food services"
  },
  {
    value: "Current Stock in anganwadi's",
    label: "Current Stock in anganwadi's"
  },
  {
    value: "Daily attendance of children",
    label: "Daily attendance of children"
  },
  {
    value: "Last Recorded Usage in anganwadi's",
    label: "Last Recorded Usage in anganwadi's"
  }
];
const tableselectoptions = [
  {
    value: "Food Consumption in anganwadi's & Beneficieries of food services",
    label: "Food Consumption in anganwadi's & Beneficieries of food services"
  },
  {
    value: "Current Stock in anganwadi's",
    label: "Current Stock in anganwadi's"
  },
  {
    value: "Children's Attendance",
    label: "Children's Attendance"
  },
  {
    value: "Check Pictures",
    label: "Check Pictures"
  }
];

const yearselectoptions = [
  {
    value: "2017",
    label: "2017"
  },
  {
    value: "2018",
    label: "2018"
  },
  {
    value: "2019",
    label: "2019"
  }
];
const pieOptions = {
  //is3D: true,
  pieHole: 0.6,
  slices: [
    {
      color: "#f7c744"
    },
    {
      color: "#275DAD"
    },
    {
      color: "#007fad"
    },
    {
      color: "#e9a227"
    }
  ],
  legend: {
    position: "bottom",
    alignment: "center",
    textStyle: {
      color: "233238",
      fontSize: 14
    }
  },
  tooltip: {
    showColorCode: true
  },
  chartArea: {
    left: 0,
    top: 20,
    width: "100%",
    height: "80%"
  },
  fontName: "Roboto"
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
export default class Timeline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      selectedOptionplace: "",
      selectedchartoption: "",
      currentsupervisorid: "",
      optionsplace: "",
      optionsanganwadicode: "",
      yearselectedfromdropdown: 0,
      stockdata: [],
      stockdata1: [],
      dailyusagedata1: [],
      dailystockdata: [],
      attendancedata: [],
      benficiariesdata: [],
      imagerecordsdata: [],
      dailyattendancedata: [],
      selectedTableoption: "",
      selecteddatatypeoption: "",
      selectedOptionanganwadicode: ""
    };
  }
  componentWillMount() {
    let optionsanganwadicode = [];

    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);
        var i;
        for (i = 0; i < data.length; i++) {
          optionsanganwadicode[i] = {};
          optionsanganwadicode[i].value = data[i].anganwadicode;
          optionsanganwadicode[i].label =
            data[i].anganwadicode +
            "   (" +
            data[i].anganwadidetails.awcplace +
            ")";
        }
        console.log(optionsanganwadicode);
        this.setState({ optionsanganwadicode: optionsanganwadicode });
      });

    // dailyattendancedata.push({
    //   date: datefromdb,
    //   daycount: Attendancedata[index].daycount
    // });
    // var dailyattendancedatafilteredarray = Object.values(dailyattendancedata);

    // var dailyattendancedatadatatotables = dailyattendancedatafilteredarray.map(
    //   dailyattendancedatael => Object.values(dailyattendancedatael)
    // );

    let optionsplace = [];
    let j = 1;
    optionsplace[0] = {};
    optionsplace[0].value = "All Places";
    optionsplace[0].label = "All Places";

    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);
        var i;
        for (i = 0; i < data.length; i++) {
          if (
            //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].anganwadidetails.villagename
          ) {
            optionsplace[j] = {};
            optionsplace[j].value = data[i].anganwadidetails.villagename;
            optionsplace[j].label = data[i].anganwadidetails.villagename;
            j++;
          }
        }
        var array = [];
        var index = 0;
        var optionsplace1 = [];
        for (i = 0; i < optionsplace.length; i++) {
          if (array.indexOf(optionsplace[i].value) === -1) {
            array.push(optionsplace[i].value);
            optionsplace1[index] = {};
            optionsplace1[index].value = optionsplace[i].value;
            optionsplace1[index].label = optionsplace[i].value;
            index++;
          }
        }
        this.setState({ optionsplace: optionsplace1 });
      });
  }
  componentDidUpdate() {}
  handleChange = selectedchartoption => this.setState({ selectedchartoption });

  handleChangeplace = selectedOptionplace => {
    this.setState({ selectedOptionplace });
  };

  handleChangeYear = selectedOption => {
    let stockdata = [];
    let dailystockdata = [];
    let attendancedata = [];
    let dailyattendancedata = [];
    let imagerecordsdata = [];
    // var currentsupervisorid = this.props.user.uid;
    this.setState({ selectedOption });

    const selectedplace = this.state.selectedOptionplace.value;
    if (selectedplace === "All Places") {
      if (selectedOption.value === "none" || selectedOption.value === "All") {
        //plus

        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var childcount = 0;
            var mothercount = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (data[i].Timeline) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  imagerecordsdata.push({
                    date: imagedata[index].date,
                    anganwadicode: data[i].anganwadicode,
                    awcplace: data[i].anganwadidetails.awcplace,
                    imagetype: imagedata[index].imagetype
                      ? imagedata[index].imagetype
                      : "Others",
                    comment: imagedata[index].comment,
                    UPicture: imagedata[index].UPicture
                  });
                }
              }
              //done with image data

              if (data[i].Attendance) {
                const Attendancedata = data[i].Attendance.Count;
                var total = Attendancedata.length;
                for (let index in Attendancedata) {
                  var datefromdb = Attendancedata[index].date;

                  attendancedata.push({
                    date: datefromdb,
                    awccode: data[i].anganwadicode,
                    awcplace: data[i].anganwadidetails.awcplace,
                    daycount: Attendancedata[index].daycount
                  });
                }
              }

              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline
              ) {
                //  console.log(Attendancedata);
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;

                for (let index in subdata1) {
                  stockdata.push({
                    //donot delete the below comment
                    //  ...childSnapshot.val(),
                    stockanganwadicode: data[i].anganwadicode,
                    placename: data[i].anganwadidetails.awcplace,
                    DPickdob: subdata1[index].DPickdobStock,
                    amalice_rich: subdata1[index].amalice_rich,
                    mustard_seeds: subdata1[index].mustard_seeds,
                    grams: subdata1[index].grams,
                    chilli: subdata1[index].chilli,
                    jaggery: subdata1[index].jaggery,
                    rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                    wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                    salt: subdata1[index].salt,
                    oil: subdata1[index].oil,
                    green_gram: subdata1[index].green_gram,
                    egg: subdata1[index].egg
                  });
                }
                for (let index in subdata) {
                  // if (
                  //   subdata[index].DPickdobStock.getFullYear() ===
                  //   this.state.selectedyearoption.value
                  // ) {
                  totalamalice_rich =
                    totalamalice_rich + parseFloat(subdata[index].amalice_rich);
                  totalchilli = totalchilli + parseFloat(subdata[index].chilli);
                  totalegg = totalegg + parseFloat(subdata[index].egg); //converts into kg * 0.001
                  totalgrams = totalgrams + parseFloat(subdata[index].grams);
                  totalgreen_gram =
                    totalgreen_gram + parseFloat(subdata[index].green_gram);
                  totaljaggery =totaljaggery  +parseFloat(subdata[index].jaggery);
                  totalmustard_seeds =
                    totalmustard_seeds +
                    parseFloat(subdata[index].mustard_seeds);
                  totaloil = totaloil + parseFloat(subdata[index].oil);
                  if (subdata[index].rice != undefined) {
                    totalrice = totalrice + parseInt(subdata[index].rice);
                  }
                  if (subdata[index].wheat != undefined) {
                    totalwheat = totalwheat + parseInt(subdata[index].wheat);
                  }

                  totalsalt = totalsalt + parseFloat(subdata[index].salt);
                  childcount = subdata[index].total1;
                  mothercount = subdata[index].total2;
                  dailystockdata.push({
                    stockanganwadicode: data[i].anganwadicode,
                    placename: data[i].anganwadidetails.awcplace,
                    DPickdob: subdata[index].DPickdob,
                    amalice_rich: subdata[index].amalice_rich,
                    mustard_seeds: subdata[index].mustard_seeds,
                    grams: subdata[index].grams,
                    chilli: subdata[index].chilli,
                    jaggery: subdata[index].jaggery,
                    rice: !subdata[index].rice ? 0 : subdata[index].rice,
                    wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                    salt: subdata[index].salt,
                    oil: subdata[index].oil,
                    green_gram: subdata[index].green_gram,
                    egg: subdata[index].egg,
                    bchild: subdata[index].total1,
                    bmother: subdata[index].total2
                  });
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );

            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );

            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );

            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables

              //       dailyattendancedata:dailyattendancedatadatatotables
            });
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();
            this.setState({
              childcount: childcount,
              mothercount: mothercount,
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Today") {
        //plus
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (data[i].Timeline) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = yyyy + "-" + mm + "-" + dd;
                  var dobyear = imagedata[index].date;
                  if (dobyear == today) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //done with image data
              //Attendance
              if (data[i].Attendance) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  today = yyyy + "-" + mm + "-" + dd;

                  //from db
                  var datefromdb = Attendancedata[index].date;

                  if (datefromdb == today) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }

              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = yyyy + "-" + mm + "-" + dd;
                  var dobyear = subdata1[index].DPickdobStock;
                  if (dobyear == today) {
                    stockdata.push({
                      //donot delete the below comment
                      //  ...childSnapshot.val(),
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = yyyy + "-" + mm + "-" + dd;
                  var dobyear = subdata[index].DPickdob;
                  if (dobyear == today) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            console.log(dailystockdatatotables, "hello");
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            // this.callDataTableImage();

            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });
            this.callDataTableImage();
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Last 3 Month") {
        var today = new Date();
        var dt1 = 0;
        var dt2 = 0;
        var dt3 = 0;
        var c = 0;
        var mm = today.getMonth() + 1;
        var todayyear = today.getFullYear();
        if (mm < 10) {
          mm = "0" + mm;
        }

        var array = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for (var i = array.length - 1; i >= 0; i--) {
          if (array[i] == mm) {
            for (var j = i - 1; j > i - 4; j--) {
              if (c === 0) {
                dt1 = array[j];
              }
              if (c === 1) {
                dt2 = array[j];
              }
              if (c === 2) {
                dt3 = array[j];
              }
              c++;
            }
            break;
          }
        }
        var todaya = new Date();
        var dt1a = 0;
        var dt2a = 0;
        var dt3a = 0;
        var ca = 0;
        var mma = todaya.getMonth() + 1;
        var todayyeara = todaya.getFullYear();
        // if (mma < 10) {
        //   mma = "0" + mma;
        // }

        var arraya = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for (var i = arraya.length - 1; i >= 0; i--) {
          if (arraya[i] == mma) {
            for (var j = i - 1; j > i - 4; j--) {
              if (ca === 0) {
                dt1a = arraya[j];
              }
              if (ca === 1) {
                dt2a = arraya[j];
              }
              if (ca === 2) {
                dt3a = arraya[j];
              }
              ca++;
            }
            break;
          }
        }
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (data[i].Timeline) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  var str = imagedata[index].date;
                  var dobmonth = str.substring(5, 6);
                  var dyear = str.substring(0, 4);
                  console.log(dobmonth, dyear, dt1, "helllo");
                  if (
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    todayyear == dyear
                  ) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //Attendance
              if (data[i].Attendance) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  //from db

                  var datefromdb = Attendancedata[index].date;

                  // console.log(str);
                  var dobmonth = datefromdb.substring(5, 6);
                  var dobyear = datefromdb.substring(0, 4);
                  console.log(dt1a, dobmonth, dt2a, dt3a, dobyear, todayyeara);
                  if (
                    (dobmonth == dt1a ||
                      dobmonth == dt2a ||
                      dobmonth == dt3a) &&
                    dobyear == todayyeara
                  ) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var str = subdata1[index].DPickdobStock;
                  var dobmonth = str.substring(5, 7);
                  console.log(dobmonth, dyear, dt1, "helllo DPickdobStock");
                  if (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) {
                    stockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  // if (
                  //   subdata[index].DPickdobStock.getFullYear() ===
                  //   this.state.selectedyearoption.value
                  // ) {
                  var str = subdata[index].DPickdob;
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );

            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            console.log(dailystockdatatotables, "hello");
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });

            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "This Month") {
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (data[i].Timeline) {
                var imagedata = data[i].Timeline.image;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();

                for (let index in imagedata) {
                  datefromdb = imagedata[index].date;
                  var dobmonth = datefromdb.substring(5, 6);
                  var dobyear = datefromdb.substring(0, 4);
                  console.log(dobmonth, mm, dobyear, yyyy);
                  if (dobmonth == mm && dobyear == yyyy) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //done with image data
              //Attendance
              if (data[i].Attendance) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  //from db
                  var datefromdb = Attendancedata[index].date;

                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  // if (dd < 10) {
                  //   dd = "0" + dd;
                  // }
                  // if (mm < 10) {
                  //   mm = "0" + mm;
                  // }
                  var dobmonth = datefromdb.substring(5, 6);
                  var dobyear = datefromdb.substring(0, 4);
                  console.log(dobmonth, mm, dobyear, yyyy);
                  if (dobmonth == mm && dobyear == yyyy) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }

                  var str = subdata1[index].DPickdobStock;
                  var dobyear = str.substring(0, 4);
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == mm && dobyear == yyyy) {
                    stockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }

                  var str = subdata[index].DPickdob;
                  var dobyear = str.substring(0, 4);
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == mm && dobyear == yyyy) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            console.log(dailystockdatatotables, "hello");
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else {
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (data[i].Timeline) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  //from db
                  var datefromdb = imagedata[index].date;
                  var dobyear = datefromdb.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //done with image data

              //Attendance
              if (data[i].Attendance) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  //from db
                  var datefromdb = Attendancedata[index].date;
                  var dobyear = datefromdb.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var str = subdata1[index].DPickdobStock;
                  var dobyear = str.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    stockdata.push({
                      //donot delete the below comment
                      //  ...childSnapshot.val(),
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  // if (
                  //   subdata[index].DPickdobStock.getFullYear() ===
                  //   this.state.selectedyearoption.value
                  // ) {
                  var str = subdata[index].DPickdob;
                  var dobyear = str.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            console.log(dailystockdatatotables, "hello");
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      }
    } else if (!(selectedplace === "All Places")) {
      if (selectedOption.value === "none" || selectedOption.value === "All") {
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  imagerecordsdata.push({
                    date: imagedata[index].date,
                    anganwadicode: data[i].anganwadicode,
                    awcplace: data[i].anganwadidetails.awcplace,
                    imagetype: imagedata[index].imagetype
                      ? imagedata[index].imagetype
                      : "Others",
                    comment: imagedata[index].comment,
                    UPicture: imagedata[index].UPicture
                  });
                }
              }
              //done with image data
              if (
                data[i].Attendance &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  var datefromdb = Attendancedata[index].date;
                  attendancedata.push({
                    date: datefromdb,
                    awccode: data[i].anganwadicode,
                    awcplace: data[i].anganwadidetails.awcplace,
                    daycount: Attendancedata[index].daycount
                  });
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  stockdata.push({
                    //donot delete the below comment
                    //  ...childSnapshot.val(),
                    stockanganwadicode: data[i].anganwadicode,
                    placename: data[i].anganwadidetails.awcplace,
                    DPickdob: subdata1[index].DPickdobStock,
                    amalice_rich: subdata1[index].amalice_rich,
                    mustard_seeds: subdata1[index].mustard_seeds,
                    grams: subdata1[index].grams,
                    chilli: subdata1[index].chilli,
                    jaggery: subdata1[index].jaggery,
                    rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                    wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                    salt: subdata1[index].salt,
                    oil: subdata1[index].oil,
                    green_gram: subdata1[index].green_gram,
                    egg: subdata1[index].egg
                  });
                }
                for (let index in subdata) {
                  // if (
                  //   subdata[index].DPickdobStock.getFullYear() ===
                  //   this.state.selectedyearoption.value
                  // ) {
                  totalamalice_rich =
                    totalamalice_rich + parseFloat(subdata[index].amalice_rich);
                  totalchilli = totalchilli + parseFloat(subdata[index].chilli);
                  totalegg = totalegg + parseFloat(subdata[index].egg); //converts into kg * 0.001
                  totalgrams = totalgrams + parseFloat(subdata[index].grams);
                  totalgreen_gram =
                    totalgreen_gram + parseFloat(subdata[index].green_gram);
                  totaljaggery =totaljaggery  +parseFloat(subdata[index].jaggery);
                  totalmustard_seeds =
                    totalmustard_seeds +
                    parseFloat(subdata[index].mustard_seeds);
                  totaloil = totaloil + parseFloat(subdata[index].oil);
                  if (subdata[index].rice != undefined) {
                    totalrice = totalrice + parseInt(subdata[index].rice);
                  }
                  if (subdata[index].wheat != undefined) {
                    totalwheat = totalwheat + parseInt(subdata[index].wheat);
                  }

                  totalsalt = totalsalt + parseFloat(subdata[index].salt);

                  dailystockdata.push({
                    stockanganwadicode: data[i].anganwadicode,
                    placename: data[i].anganwadidetails.awcplace,
                    DPickdob: subdata[index].DPickdob,
                    amalice_rich: subdata[index].amalice_rich,
                    mustard_seeds: subdata[index].mustard_seeds,
                    grams: subdata[index].grams,
                    chilli: subdata[index].chilli,
                    jaggery: subdata[index].jaggery,
                    rice: !subdata[index].rice ? 0 : subdata[index].rice,
                    wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                    salt: subdata[index].salt,
                    oil: subdata[index].oil,
                    green_gram: subdata[index].green_gram,
                    egg: subdata[index].egg,
                    bchild: subdata[index].total1,
                    bmother: subdata[index].total2
                  });
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );

            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();

            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Today") {
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //today notall imagedata
              if (
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = yyyy + "-" + mm + "-" + dd;
                  var dobyear = imagedata[index].date;
                  if (dobyear == today) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //Attendance
              if (
                data[i].Attendance &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  // if (dd < 10) {
                  //   dd = "0" + dd;
                  // }
                  // if (mm < 10) {
                  //   mm = "0" + mm;
                  // }
                  today = yyyy + "-" + mm + "-" + dd;
                  //from db
                  var datefromdb = Attendancedata[index].date;
                  console.log(datefromdb, today);
                  if (datefromdb == today) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = yyyy + "-" + mm + "-" + dd;
                  var dobyear = subdata1[index].DPickdobStock;
                  if (dobyear == today) {
                    stockdata.push({
                      //donot delete the below comment
                      //  ...childSnapshot.val(),
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }
                  today = yyyy + "-" + mm + "-" + dd;
                  var dobyear = subdata[index].DPickdob;
                  if (dobyear == today) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            console.log(dailystockdatatotables, "hello");
            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            // this.callDataTableImage();
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });

            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Last 3 Month") {
        var today = new Date();
        var dt1 = 0;
        var dt2 = 0;
        var dt3 = 0;
        var c = 0;
        var mm = today.getMonth() + 1;
        var todayyear = today.getFullYear();
        if (mm < 10) {
          mm = "0" + mm;
        }

        var array = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for (var i = array.length - 1; i >= 0; i--) {
          if (array[i] == mm) {
            for (var j = i - 1; j > i - 4; j--) {
              if (c === 0) {
                dt1 = array[j];
              }
              if (c === 1) {
                dt2 = array[j];
              }
              if (c === 2) {
                dt3 = array[j];
              }
              c++;
            }
            break;
          }
        }
        var todaya = new Date();
        var dt1a = 0;
        var dt2a = 0;
        var dt3a = 0;
        var ca = 0;
        var mma = todaya.getMonth() + 1;
        var todayyeara = todaya.getFullYear();
        // if (mm < 10) {
        //   mm = "0" + mm;
        // }

        var arraya = [10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        for (var i = arraya.length - 1; i >= 0; i--) {
          if (arraya[i] == mma) {
            for (var j = i - 1; j > i - 4; j--) {
              if (ca === 0) {
                dt1a = arraya[j];
              }
              if (ca === 1) {
                dt2a = arraya[j];
              }
              if (ca === 2) {
                dt3a = arraya[j];
              }
              ca++;
            }
            break;
          }
        }
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              if (
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  var str = imagedata[index].date;
                  var dobmonth = str.substring(5, 6);
                  var dyear = str.substring(0, 4);
                  console.log(dobmonth, dyear, dt1, "helllo not");
                  if (
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    todayyear == dyear
                  ) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              if (
                data[i].Attendance &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  //from db
                  var datefromdb = Attendancedata[index].date;

                  var dobmonth = datefromdb.substring(5, 6);
                  var dobyear = datefromdb.substring(0, 4);
                  if (
                    (dobmonth == dt1a ||
                      dobmonth == dt2a ||
                      dobmonth == dt3a) &&
                    todayyeara == dobyear
                  ) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var str = subdata1[index].DPickdobStock;
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) {
                    stockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  // if (
                  //   subdata[index].DPickdobStock.getFullYear() ===
                  //   this.state.selectedyearoption.value
                  // ) {
                  var str = subdata[index].DPickdob;
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            console.log(dailystockdatatotables, "hello");
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });

            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();

            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "This Month") {
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                var imagedata = data[i].Timeline.image;
                var today = new Date();
                var dd = today.getDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getFullYear();

                for (let index in imagedata) {
                  datefromdb = imagedata[index].date;
                  var dobmonth = datefromdb.substring(5, 6);
                  var dobyear = datefromdb.substring(0, 4);
                  console.log(dobmonth, mm, dobyear, yyyy);
                  if (dobmonth == mm && dobyear == yyyy) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //done with image data
              if (
                data[i].Attendance &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  //from db
                  var datefromdb = Attendancedata[index].date;

                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  // if (dd < 10) {
                  //   dd = "0" + dd;
                  // }
                  // if (mm < 10) {
                  //   mm = "0" + mm;
                  // }
                  var dmonth = datefromdb.substring(5, 6);
                  var dyear = datefromdb.substring(0, 4);
                  //   var datefromdb = year + "-" + day + "-" + month;
                  if (dmonth == mm && dyear == yyyy) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }

                  var str = subdata1[index].DPickdobStock;
                  var dobyear = str.substring(0, 4);
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == mm && dobyear == yyyy) {
                    stockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  var today = new Date();
                  var dd = today.getDate();
                  var mm = today.getMonth() + 1;
                  var yyyy = today.getFullYear();
                  if (dd < 10) {
                    dd = "0" + dd;
                  }
                  if (mm < 10) {
                    mm = "0" + mm;
                  }

                  var str = subdata[index].DPickdob;
                  var dobyear = str.substring(0, 4);
                  var dobmonth = str.substring(5, 7);
                  if (dobmonth == mm && dobyear == yyyy) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            console.log(dailystockdatatotables, "hello");
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.callDataTableImage();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else {
        firebase
          .database()
          .ref(`users`)
          .once("value")
          .then(snapshot => {
            var count = 0;
            const data = firebaseLooper(snapshot);

            var totalamalice_rich = 0;
            var totalchilli = 0;
            var totalegg = 0;
            var totalgrams = 0;
            var totalgreen_gram = 0;
            var totaljaggery = 0;
            var totalmustard_seeds = 0;
            var totaloil = 0;
            var totalrice = 0;
            var totalwheat = 0;
            var totalsalt = 0;
            var i;
            for (i = 0; i < data.length; i++) {
              //image data
              if (
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                var imagedata = data[i].Timeline.image;
                for (let index in imagedata) {
                  //from db
                  var datefromdb = imagedata[index].date;
                  var dobyear = datefromdb.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    imagerecordsdata.push({
                      date: imagedata[index].date,
                      anganwadicode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      imagetype: imagedata[index].imagetype
                        ? imagedata[index].imagetype
                        : "Others",
                      comment: imagedata[index].comment,
                      UPicture: imagedata[index].UPicture
                    });
                  }
                }
              }
              //done with image data
              if (
                data[i].Attendance &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const Attendancedata = data[i].Attendance.Count;
                for (let index in Attendancedata) {
                  //from db
                  var datefromdb = Attendancedata[index].date;
                  var dobyear = datefromdb.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    attendancedata.push({
                      date: datefromdb,
                      awccode: data[i].anganwadicode,
                      awcplace: data[i].anganwadidetails.awcplace,
                      daycount: Attendancedata[index].daycount
                    });
                  }
                }
              }
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Timeline &&
                data[i].anganwadidetails.villagename == selectedplace
              ) {
                const subdata = data[i].Timeline.DailyUsagePeople;
                const subdata1 = data[i].Timeline.DailyUsageStock;
                for (let index in subdata1) {
                  var str = subdata1[index].DPickdobStock;
                  var dobyear = str.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    stockdata.push({
                      //donot delete the below comment
                      //  ...childSnapshot.val(),
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata1[index].DPickdobStock,
                      amalice_rich: subdata1[index].amalice_rich,
                      mustard_seeds: subdata1[index].mustard_seeds,
                      grams: subdata1[index].grams,
                      chilli: subdata1[index].chilli,
                      jaggery: subdata1[index].jaggery,
                      rice: !subdata1[index].rice ? 0 : subdata1[index].rice,
                      wheat: !subdata1[index].wheat ? 0 : subdata1[index].wheat,
                      salt: subdata1[index].salt,
                      oil: subdata1[index].oil,
                      green_gram: subdata1[index].green_gram,
                      egg: subdata1[index].egg
                    });
                  }
                }
                for (let index in subdata) {
                  // if (
                  //   subdata[index].DPickdobStock.getFullYear() ===
                  //   this.state.selectedyearoption.value
                  // ) {
                  var str = subdata[index].DPickdob;
                  var dobyear = str.substring(0, 4);
                  if (dobyear == selectedOption.value) {
                    totalamalice_rich =
                      totalamalice_rich + parseInt(subdata[index].amalice_rich);
                    totalchilli = totalchilli + parseInt(subdata[index].chilli);
                    totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                    totalgrams = totalgrams + parseInt(subdata[index].grams);
                    totalgreen_gram =
                      totalgreen_gram + parseInt(subdata[index].green_gram);
                    totaljaggery =totaljaggery  +parseInt(subdata[index].jaggery);
                    totalmustard_seeds =
                      totalmustard_seeds +
                      parseInt(subdata[index].mustard_seeds);
                    totaloil = totaloil + parseInt(subdata[index].oil);
                    if (subdata[index].rice != undefined) {
                      totalrice = totalrice + parseInt(subdata[index].rice);
                    }
                    if (subdata[index].wheat != undefined) {
                      totalwheat = totalwheat + parseInt(subdata[index].wheat);
                    }
                    totalsalt = totalsalt + parseInt(subdata[index].salt);
                    dailystockdata.push({
                      stockanganwadicode: data[i].anganwadicode,
                      placename: data[i].anganwadidetails.awcplace,
                      DPickdob: subdata[index].DPickdob,
                      amalice_rich: subdata[index].amalice_rich,
                      mustard_seeds: subdata[index].mustard_seeds,
                      grams: subdata[index].grams,
                      chilli: subdata[index].chilli,
                      jaggery: subdata[index].jaggery,
                      rice: !subdata[index].rice ? 0 : subdata[index].rice,
                      wheat: !subdata[index].wheat ? 0 : subdata[index].wheat,
                      salt: subdata[index].salt,
                      oil: subdata[index].oil,
                      green_gram: subdata[index].green_gram,
                      egg: subdata[index].egg,
                      bchild: subdata[index].total1,
                      bmother: subdata[index].total2
                    });
                  }
                }
              }
            }
            var dailystockfilteredarray = Object.values(dailystockdata);

            var dailystockdatatotables = dailystockfilteredarray.map(
              dailyfoodstockel => Object.values(dailyfoodstockel)
            );
            var stockfilteredarray = Object.values(stockdata);

            var stockdatatotables = stockfilteredarray.map(foodstockel =>
              Object.values(foodstockel)
            );
            //    attendancedata
            var attendancedatafilteredarray = Object.values(attendancedata);

            var attendancedatadatatotables = attendancedatafilteredarray.map(
              attendancedatael => Object.values(attendancedatael)
            );
            //image data
            var imagerecordsdatafilteredarray = Object.values(imagerecordsdata);

            var imagerecordsdatatotables = imagerecordsdatafilteredarray.map(
              imagerecordsdatael => Object.values(imagerecordsdatael)
            );
            //imagerecordsdata: imagerecordsdatatotables
            //         this.callDataTableImage();
            console.log(dailystockdatatotables, "hello");
            this.setState({
              dailystockdata: dailystockdatatotables,
              stockdata: stockdatatotables,
              attendancedata: attendancedatadatatotables,
              imagerecordsdata: imagerecordsdatatotables
            });
            this.callDataTableImage();
            this.callDataTableDailyStock();
            this.callDataTableAttendance();
            this.callDataTableStock();
            this.setState({
              totalamalice_rich: totalamalice_rich,
              totalchilli: totalchilli,
              totalegg: totalegg,
              totalgrams: totalgrams,
              totalgreen_gram: totalgreen_gram,
              totaljaggery: totaljaggery,
              totalmustard_seeds: totalmustard_seeds,
              totaloil: totaloil,
              totalrice: totalrice,
              totalwheat: totalwheat,
              totalsalt: totalsalt
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      }
    }
  };

  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });

  handleChange2 = selectedyeartoption => this.setState({ selectedyeartoption });
  handleChangeanganwadicode_stock = selectedOptionanganwadicodestock => {
    this.setState({ selectedOptionanganwadicodestock });
    let stockdata1 = [
      [
        "Last Recorded Date",
        "Amalice Rich - Milk Powder (Kg's)",
        "Mustard Seeds (Kg's)",
        "Grams (Kg's)",
        "Chilli (Kg's)",
        "Jaggery (Kg's)",
        "Rice (Kg's)",
        "Wheat (Kg's)",
        "Salt (Kg's)",
        "Oil (Litre's)",
        "Green Gram (Kg's)",
        "Egg (Kg's)"
      ]
    ];
    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);

        var i;
        for (i = 0; i < data.length; i++) {
          if (
            // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].Timeline
          ) {
            const subdata1 = data[i].Timeline.DailyUsageStock;
            if (
              selectedOptionanganwadicodestock.value == data[i].anganwadicode
            ) {
              for (let index in subdata1) {
                console.log(subdata1);

                stockdata1.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  // stockanganwadicode: data[i].anganwadicode,
                  // placename: data[i].anganwadidetails.awcplace,
                  //DPickdob: subdata1[index].DPickdobStock,
                  year: subdata1[index].DPickdobStock,
                  amalice_rich: parseFloat(subdata1[index].amalice_rich),
                  mustard_seeds: parseFloat(subdata1[index].mustard_seeds),
                  grams: parseFloat(subdata1[index].grams),
                  chilli: parseFloat(subdata1[index].chilli),
                  jaggery: parseFloat(subdata1[index].jaggery),
                  rice: parseFloat(
                    !subdata1[index].rice ? 0 : subdata1[index].rice
                  ),
                  wheat: parseFloat(
                    !subdata1[index].wheat ? 0 : subdata1[index].wheat
                  ),
                  salt: parseFloat(subdata1[index].salt),
                  oil: parseFloat(subdata1[index].oil),
                  green_gram: parseFloat(subdata1[index].green_gram),
                  egg: parseFloat(subdata1[index].egg)
                });
              }
            }
          }
          console.log(stockdata1, "I AM HERE");
          var stockdattemp = [];
          stockdattemp[0] = stockdata1[0];
          stockdattemp[stockdata1.length - 1] =
            stockdata1[stockdata1.length - 1];

          var stockdata1filteredarray = Object.values(stockdattemp);
          // console.log(stockdata1datatotables);
          var stockdata1datatotables = stockdata1filteredarray.map(
            stockdata1el => Object.values(stockdata1el)
          );

          this.setState({
            stockdata1: stockdata1datatotables
          });
          // stockdata1: stockdata1datatotables
        }
      });
  };
  handleChangeanganwadicode_du = selectedOptionanganwadicodedu => {
    this.setState({ selectedOptionanganwadicodedu });
    let dailyusagedata1 = [
      [
        "Last Recorded Date",
        "Amalice Rich - Milk Powder (Kg's)",
        "Mustard Seeds (Kg's)",
        "Grams (Kg's)",
        "Chilli (Kg's)",
        "Jaggery (Kg's)",
        "Rice (Kg's)",
        "Wheat (Kg's)",
        "Salt (Kg's)",
        "Oil (Litre's)",
        "Green Gram (Kg's)",
        "Egg (Kg's)"
      ]
    ];
    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);

        var i;
        for (i = 0; i < data.length; i++) {
          if (
            // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].Timeline
          ) {
            const subdata1 = data[i].Timeline.DailyUsagePeople;
            if (selectedOptionanganwadicodedu.value == data[i].anganwadicode) {
              for (let index in subdata1) {
                console.log(subdata1);

                dailyusagedata1.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  // stockanganwadicode: data[i].anganwadicode,
                  // placename: data[i].anganwadidetails.awcplace,
                  //DPickdob: subdata1[index].DPickdobStock,
                  year: subdata1[index].DPickdob,
                  amalice_rich: parseFloat(subdata1[index].amalice_rich),
                  mustard_seeds: parseFloat(subdata1[index].mustard_seeds),
                  grams: parseFloat(subdata1[index].grams),
                  chilli: parseFloat(subdata1[index].chilli),
                  jaggery: parseFloat(subdata1[index].jaggery),
                  rice: parseFloat(
                    !subdata1[index].rice ? 0 : subdata1[index].rice
                  ),
                  wheat: parseFloat(
                    !subdata1[index].wheat ? 0 : subdata1[index].wheat
                  ),
                  salt: parseFloat(subdata1[index].salt),
                  oil: parseFloat(subdata1[index].oil),
                  green_gram: parseFloat(subdata1[index].green_gram),
                  egg: parseFloat(subdata1[index].egg)
                });
              }
            }
          }
          console.log(dailyusagedata1, "I AM HERE");
          var dailyusagedata1temp = [];
          dailyusagedata1temp[0] = dailyusagedata1[0];
          dailyusagedata1temp[dailyusagedata1.length - 1] =
            dailyusagedata1[dailyusagedata1.length - 1];

          var dailyusagedata1filteredarray = Object.values(dailyusagedata1temp);
          // console.log(stockdata1datatotables);
          var dailyusagedata1datatotables = dailyusagedata1filteredarray.map(
            dailyusagedata1el => Object.values(dailyusagedata1el)
          );

          this.setState({
            dailyusagedata1: dailyusagedata1datatotables
          });
        }
      });
  };
  handleChangeanganwadicode_benficiaries;
  handleChangeanganwadicode_benficiaries = selectedOptionanganwadicodebenficiaries => {
    this.setState({ selectedOptionanganwadicodebenficiaries });
    let benficiariesdata = [
      [
        "Last Recorded Date",
        "Number of Children using food services today",
        "Number of women using food services today"
      ]
    ];
    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);

        var i;
        for (i = 0; i < data.length; i++) {
          if (
            // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].Timeline
          ) {
            const subdata1 = data[i].Timeline.DailyUsagePeople;
            if (
              selectedOptionanganwadicodebenficiaries.value ==
              data[i].anganwadicode
            ) {
              for (let index in subdata1) {
                console.log(subdata1);

                benficiariesdata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  // stockanganwadicode: data[i].anganwadicode,
                  // placename: data[i].anganwadidetails.awcplace,
                  //DPickdob: subdata1[index].DPickdobStock,
                  year: subdata1[index].DPickdob,
                  total1: subdata1[index].total1,
                  total2: subdata1[index].total2
                });
              }
            }
          }
          console.log(benficiariesdata, "I AM HERE");
          var benficiariesdatatemp = [];
          benficiariesdatatemp[0] = benficiariesdata[0];
          benficiariesdatatemp[benficiariesdata.length - 1] =
            benficiariesdata[benficiariesdata.length - 1];

          var benficiariesdatafilteredarray = Object.values(
            benficiariesdatatemp
          );
          // console.log(stockdata1datatotables);
          var benficiariesdatadatatotables = benficiariesdatafilteredarray.map(
            benficiariesdatael => Object.values(benficiariesdatael)
          );

          this.setState({
            benficiariesdata: benficiariesdatadatatotables
          });
        }
      });
  };
  handleChangeanganwadicode = selectedOptionanganwadicode => {
    this.setState({ selectedOptionanganwadicode });
    let dailyattendancedata = [
      [{ type: "date", id: "Date" }, { type: "number", id: "Won/Loss" }]
    ];
    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);
        var i;
        for (i = 0; i < data.length; i++) {
          if (
            // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].Attendance
          ) {
            const dailyAttendancedata = data[i].Attendance.Count;

            for (let index in dailyAttendancedata) {
              console.log(dailyAttendancedata[index].date, "h");
              if (selectedOptionanganwadicode.value == data[i].anganwadicode) {
                dailyattendancedata.push({
                  date: new Date(dailyAttendancedata[index].date),
                  daycount: parseInt(dailyAttendancedata[index].daycount)
                });
              }
            }
          }
          var dailyattendancedatafilteredarray = Object.values(
            dailyattendancedata
          );

          var dailyattendancedatadatatotables = dailyattendancedatafilteredarray.map(
            dailyattendancedatael => Object.values(dailyattendancedatael)
          );
          console.log(dailyattendancedatadatatotables, "u");
          this.setState({
            dailyattendancedata: dailyattendancedatadatatotables
          });
        }
      });
  };
  //imagerecordsdata

  callDataTableImage() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.stockdata, "this.state.stockdata");
    if (!this.imagerecordsdatael) return;
    this.$imagerecordsdatael = $(this.imagerecordsdatael);
    this.$imagerecordsdatael.DataTable({
      data: this.state.imagerecordsdata,
      columns: [
        { title: "Date" },
        { title: "Anganwadi Code" },
        { title: "Anganwadi Place" },
        { title: "Image Type" },
        { title: "Comment" },
        {
          title: "Picture",
          render: function(data) {
            return '<img height=180 width=300 src="' + data + '">';
          }
        }
      ],
      destroy: true
      //  ordering: false
    });
    //}
  }

  callDataTableAttendance() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.stockdata, "this.state.stockdata");
    if (!this.attendancedatael) return;
    this.$attendancedatael = $(this.attendancedatael);
    this.$attendancedatael.DataTable({
      data: this.state.attendancedata,
      columns: [
        {
          title: "Date",
          render(data) {
            //data.substring(5,6);
            // data.substring(0,4);
            return (
              data.substring(7, 9) +
              "-" +
              data.substring(5, 6) +
              "-" +
              data.substring(0, 4)
            );
          }
        },
        { title: "Anganwadi Code" },
        { title: "Anganwadi Place" },
        { title: "Attendance Count" }
      ],
      destroy: true
      //  ordering: false
    });
    //}
  }
  callDataTableDailyStock() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.stockdata, "this.state.stockdata");
    if (!this.dailyfoodstockel) return;
    this.$dailyfoodstockel = $(this.dailyfoodstockel);
    this.$dailyfoodstockel.DataTable({
      data: this.state.dailystockdata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Anganwadi place" },
        { title: "Date" },
        { title: "Amalice Rich(Milk Powder) (Kgs)" },
        { title: "Mustard seeds (Kgs)" },
        { title: "Grams (Kgs)" },
        { title: "Chilli (Kgs)" },
        { title: "Jaggery (Kgs)" },
        { title: "Rice (Kgs)" },
        { title: "Wheat (Kgs)" },
        { title: "Salt (Kgs)" },
        { title: "Oil (Litres)" },
        { title: "Green Grams (Kgs)" },
        { title: "Eggs (units)" },
        { title: "Number of beneficiaries (Children)" },
        { title: "Number of beneficiaries (Women)" }
      ],
      destroy: true
      //  ordering: false
    });
    //}
  }
  callDataTableStock() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.stockdata, "this.state.stockdata");
    if (!this.foodstockel) return;
    this.$foodstockel = $(this.foodstockel);
    this.$foodstockel.DataTable({
      data: this.state.stockdata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Anganwadi place" },
        { title: "Date" },
        { title: "Amalice Rich(Milk Powder) (Kgs)" },
        { title: "Mustard seeds (Kgs)" },
        { title: "Grams (Kgs)" },
        { title: "Chilli (Kgs)" },
        { title: "Jaggery (Kgs)" },
        { title: "Rice (Kgs)" },
        { title: "Wheat (Kgs)" },
        { title: "Salt (Kgs)" },
        { title: "Oil (Litres)" },
        { title: "Green Grams (Kgs)" },
        { title: "Eggs (units)" }
      ],
      destroy: true
      //  ordering: false
    });
    //}
  }
  handleSubmit() {
    window.location.reload();
  }

  render() {
    console.log(this.state.dailyattendancedata);
    return (
      <CEO_DD_DCLayout>
        {/* <h3 style={globalStyles.navigation}>
          Application / Add ceo/dd/dc Analytics Dashboard(Timeline)
        </h3> */}

        <button>
          <img
            id="refershicon"
            src={refershicon}
            height={35}
            width={35}
            alt="REFRESH"
            onClick={this.handleSubmit.bind(this)}
          />
        </button>

        <Select
          onChange={this.handleChangedatatype}
          value={this.state.selecteddatatypeoption}
          options={datatypeoption}
          disabled={!this.state.selecteddatatypeoption ? false : true}
        />
        <br />
        {this.state.selecteddatatypeoption.value === "Chart" ? (
          <Select
            onChange={this.handleChange}
            value={this.state.selectedchartoption}
            options={chartselectoptions}
            disabled={!this.state.selectedchartoption ? false : true}
          />
        ) : null}

        {this.state.selecteddatatypeoption.value === "Table" ? (
          <Select
            onChange={this.handleChangeTable}
            value={this.state.selectedTableoption}
            options={tableselectoptions}
            disabled={!this.state.selectedTableoption ? false : true}
          />
        ) : null}

        <br />
        {console.log(
          this.state.selecteddatatypeoption.value,
          this.state.selectedTableoption.value
        )}
        {this.state.selectedTableoption.value ===
          "Food Consumption in anganwadi's & Beneficieries of food services" &&
        this.state.selecteddatatypeoption.value === "Table" ? (
          <div>
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangeplace}
              options={this.state.optionsplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <table
              className="display"
              width="100%"
              ref={dailyfoodstockel =>
                (this.dailyfoodstockel = dailyfoodstockel)
              }
            />
          </div>
        ) : null}

        {this.state.selectedTableoption.value === "Children's Attendance" &&
        this.state.selecteddatatypeoption.value === "Table" ? (
          <div>
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangeplace}
              options={this.state.optionsplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <table
              className="display"
              width="100%"
              ref={attendancedatael =>
                (this.attendancedatael = attendancedatael)
              }
            />
          </div>
        ) : null}
        {this.state.selectedTableoption.value === "Check Pictures" &&
        this.state.selecteddatatypeoption.value === "Table" ? (
          <div>
            {" "}
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangeplace}
              options={this.state.optionsplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <table
              className="display"
              width="100%"
              ref={imagerecordsdatael =>
                (this.imagerecordsdatael = imagerecordsdatael)
              }
            />
          </div>
        ) : null}
        {this.state.selectedTableoption.value ===
          "Current Stock in anganwadi's" &&
        this.state.selecteddatatypeoption.value === "Table" ? (
          <div>
            {" "}
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangeplace}
              options={this.state.optionsplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <table
              className="display"
              width="100%"
              ref={foodstockel => (this.foodstockel = foodstockel)}
            />
          </div>
        ) : null}

        {this.state.selectedchartoption.value ===
          "Food Consumption in anganwadi's (Year)" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangeplace}
              options={this.state.optionsplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              width={"700px"}
              height={"400px"}
              chartType="BarChart"
              chartPackages={["corechart", "controls"]}
              loader={<div>Loading Chart</div>}
              data={[
                [
                  "Food Item",
                  "Quantity",
                  { role: "style" },
                  {
                    sourceColumn: 0,
                    role: "annotation",
                    type: "string",
                    calc: "stringify"
                  }
                ],
                [
                  "Amalice rich (kgs)",
                  parseInt(this.state.totalamalice_rich),
                  "color: #003f5c",
                  null
                ],
                [
                  "Chilli's (kgs)",
                  parseInt(this.state.totalchilli),
                  "color: #2f4b7c",
                  null
                ],
                [
                  "Egg's (units)",
                  parseInt(this.state.totalegg),
                  "color: #665191",
                  null
                ],
                [
                  "Grams (kgs)",
                  parseInt(this.state.totalgrams),
                  "color: #a05195",
                  null
                ],
                [
                  "Green Gram's(kgs)",
                  parseInt(this.state.totalgreen_gram),
                  "color: #d45087",
                  null
                ],
                [
                  "Jaggery(kgs)",
                  parseInt(this.state.totaljaggery),
                  "color: #f95d6a",
                  null
                ],
                [
                  "Mustard seeds (kgs)",
                  parseInt(this.state.totalmustard_seeds),
                  "color: #ff7c43",
                  null
                ],
                [
                  "Oil (litres)",
                  parseInt(this.state.totaloil),
                  "color: #ffa600",
                  null
                ],
                [
                  "Rice (kgs)",
                  parseInt(this.state.totalrice),
                  "color:#FF0000",
                  null
                ],
                [
                  "Wheat (kgs)",
                  parseInt(this.state.totalwheat),
                  "color:#FFFF00",
                  null
                ],
                [
                  "Salt (kgs)",
                  parseInt(this.state.totalsalt),
                  "color:grey",
                  null
                ]
              ]}
              controls={[
                {
                  controlType: "StringFilter",
                  options: {
                    filterColumnIndex: 0,
                    matchType: "any", // 'prefix' | 'exact',
                    ui: {
                      label: "Search by name"
                    }
                  }
                }
              ]}
              rootProps={{ "data-testid": "6" }}
            />
          </div>
        ) : null}
        {this.state.selectedchartoption.value ===
          "Daily attendance of children" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            SELECT ANGANWADI
            <Select
              value={this.state.selectedOptionanganwadicode}
              onChange={this.handleChangeanganwadicode}
              options={this.state.optionsanganwadicode}
            />
            <br />
            {this.state.selectedOptionanganwadicode ? (
              <div class="divbox">
                (Day wise attendance count in anganwadis)
                <br />
                <Chart
                  width={1000}
                  height={350}
                  chartType="Calendar"
                  loader={<div>Loading Chart</div>}
                  data={this.state.dailyattendancedata}
                  options={{
                    title: "Daily Attendance "
                  }}
                  rootProps={{ "data-testid": "1" }}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <br />

        {this.state.selectedchartoption.value ===
          "Last Recorded Usage in anganwadi's" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            SELECT ANGANWADI
            <Select
              value={this.state.selectedOptionanganwadicodedu}
              onChange={this.handleChangeanganwadicode_du}
              options={this.state.optionsanganwadicode}
            />
            <br />
            {this.state.selectedOptionanganwadicodedu ? (
              <div class="divbox">
                <Chart
                  width={"550px"}
                  height={"450px"}
                  chartType="Bar"
                  loader={<div>Loading Chart</div>}
                  data={this.state.dailyusagedata1}
                  options={{
                    // Material design options
                    chart: {
                      title: "Last Recorded Usage(Consumption)",
                      subtitle: "Last Recorded Usage in anganwadi"
                    }
                  }}
                  // For tests
                  rootProps={{ "data-testid": "2" }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        <br />

        {this.state.selectedchartoption.value ===
          "Beneficieries of food services" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            SELECT ANGANWADI
            <Select
              value={this.state.selectedOptionanganwadicodebenficiaries}
              onChange={this.handleChangeanganwadicode_benficiaries}
              options={this.state.optionsanganwadicode}
            />
            <br />
            {this.state.selectedOptionanganwadicodebenficiaries ? (
              <div class="divbox">
                <Chart
                  width={"550px"}
                  height={"450px"}
                  chartType="Bar"
                  loader={<div>Loading Chart</div>}
                  data={this.state.benficiariesdata}
                  options={{
                    // Material design options
                    chart: {
                      title: "Last Recorded Number Of Benficiaries",
                      subtitle: "Last Recorded Number Of Benficiaries in Selected Anganwadi "
                    }
                  }}
                  // For tests
                  rootProps={{ "data-testid": "2" }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        <br />
        {this.state.selectedchartoption.value ===
          "Current Stock in anganwadi's" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            SELECT ANGANWADI
            <Select
              value={this.state.selectedOptionanganwadicodestock}
              onChange={this.handleChangeanganwadicode_stock}
              options={this.state.optionsanganwadicode}
            />
            <br />
            {this.state.selectedOptionanganwadicodestock ? (
              <div class="divbox">
                <Chart
                  width={"550px"}
                  height={"450px"}
                  chartType="Bar"
                  loader={<div>Loading Chart</div>}
                  data={this.state.stockdata1}
                  options={{
                    // Material design options
                    chart: {
                      title: "Last Recorded Usage",
                      subtitle: "Last Recorded Usage in Selected Anganwadi "
                    }
                  }}
                  // For tests
                  rootProps={{ "data-testid": "2" }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
        <br />
        {this.state.selecteddatatypeoption ? (
          <p id="note">
            Note: Click on the refresh button to refresh charts and tables
          </p>
        ) : null}
      </CEO_DD_DCLayout>
    );
  }
}


