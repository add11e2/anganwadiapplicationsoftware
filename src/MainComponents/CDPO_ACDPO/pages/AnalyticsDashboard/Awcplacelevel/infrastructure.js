import "../../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import CDPO_ACDPOLayout from "../../../../../OtherComponents/Layout/CDPO_ACDPOLayout";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";
import firebase from "../../../../../Firebase";
import Select from "react-select"; // v 1.3.0
import "react-select/dist/react-select.css";
import "./styles.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
//require("jszip");
window.JSZip = require("jszip");
require("pdfmake");
require("datatables.net-dt");
require("datatables.net-buttons-dt");
require("datatables.net-buttons/js/buttons.flash.js");
require("datatables.net-buttons/js/buttons.html5.js");
const $ = require("jquery");
$.DataTable = require("datatables.net");

$("#diseasetable").DataTable({
  dom: "B",
  buttons: ["excelhtml5"]
});

const chartselectoptions = [
  {
    value: 1,
    label: "Water Facility in Anganwadi's"
  },
  {
    value: 2,
    label: "Playground Facility in Anganwadi's"
  },
  {
    value: 3,
    label: "Toilet Facility in Anganwadi's"
  },
  {
    value: 4,
    label: "Power Facility in Anganwadi's"
  },
  {
    value: 5,
    label: "Weighing scale for infant"
  },
  {
    value: 6,
    label: "Weighing scale for mother"
  },
  {
    value: 7,
    label: "Medicine Facility in Anganwadi's"
  },
  {
    value: 8,
    label: "Building Type"
  },
  {
    value: 9,
    label: "Water Resource"
  },
  {
    value: 10,
    label: "Bulidng Status"
  }
];
const pieOptions = {
  is3D: true,
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
export const subdatacreator = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      ...childSnapshot,
      id: childSnapshot.key
    });
  });
  return data;
};
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
export default class Infra extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      currentsupervisorid: "",
      selectedOption: "",
      selectedTableoption: "",
      selecteddatatypeoption: "",
      options: "",
      infradata: [],
      water: 0,
      play: 0,
      toilet: 0,
      power: 0,
      winfant: 0,
      wmother: 0,
      medicine: 0,
      btype: 0
    };
  }
  componentWillMount() {
    var cdpoAcdpo = this.props.user.uid;
    let options = [];
    let j = 1;
    options[0] = {};
    options[0].value = "All Places";
    options[0].label = "All Places";

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
            data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo &&
            data[i].anganwadidetails.awcplace
          ) {
            options[j] = {};
            options[j].value = data[i].anganwadidetails.awcplace;
            options[j].label = data[i].anganwadidetails.awcplace;
            j++;
          }
        }
        this.setState({ options: options });
      });
  }

  callDataTableInfra() {
    // if (this.state.stockdata != null) {
    console.log(this.state.infradata, "this.state.stockdata");
    if (!this.infrael) return;
    this.$infrael = $(this.infrael);
    this.$infrael.DataTable({
      data: this.state.infradata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "power" },
        { title: "medicine " },
        { title: "playground" },
        { title: "toilet" },
        { title: "weighing scale for mother" },
        { title: "weighing scale for infant" },
        { title: "Btype" },
        { title: "water" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  handleChangeYear = selectedOption => {
    var cdpoAcdpo = this.props.user.uid;
    this.setState({ selectedOption });
    let infradata = [];
    var water = 0;
    var play = 0;
    var toilet = 0;
    var power = 0;
    var winfant = 0;
    var wmother = 0;
    var medicine = 0;
    var btype = 0;
    var watercountYes = 0;
    var watercountNo = 0;
    var powercountYes = 0;
    var powercountNo = 0;
    var weighingscaleinfantcountYes = 0;
    var weighingscaleinfantcountNo = 0;
    var weighingscalemothercountYes = 0;
    var weighingscalemothercountNo = 0;
    var countTile = 0;
    var countRCC = 0;
    var toiletcountYes = 0;
    var toiletcountNo = 0;
    var playcountYes = 0;
    var playcountNo = 0;
    var medicinecountYes = 0;
    var medicinecountNo = 0;
    var borecount = 0;
    var wellcount = 0;
    var punchayathcount = 0;
    var bore = false;
    var well = false;
    var punch = false;
    var giftcount = 0;
    var owncount = 0;
    var rentcount = 0;
    var bstatus = "";
    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        const data = firebaseLooper(snapshot);
        if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 1
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Water === "Yes") {
                    watercountYes++;
                  } else if (subdata[index].Water === "No") {
                    watercountNo++;
                  }
                }
              }
            }
          }
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 1
        ) {
          water = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Water === "Yes"
                  ) {
                    water++;
                  }
                }
              }
            }
          }
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 2
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Play === "Yes") {
                    playcountYes++;
                  } else if (subdata[index].Play === "No") {
                    playcountNo++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 2
        ) {
          play = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Play === "Yes"
                  ) {
                    play++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 3
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Toilet === "Yes") {
                    toiletcountYes++;
                  } else if (subdata[index].Toilet === "No") {
                    toiletcountNo++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 3
        ) {
          toilet = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Toilet === "Yes"
                  ) {
                    toilet++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 4
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Power === "Yes") {
                    powercountYes++;
                  } else if (subdata[index].Power === "No") {
                    powercountNo++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 4
        ) {
          power = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Power === "Yes"
                  ) {
                    power++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 5
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Infant === "Yes") {
                    weighingscaleinfantcountYes++;
                  } else if (subdata[index].Infant === "No") {
                    weighingscaleinfantcountNo++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 5
        ) {
          winfant = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Infant === "Yes"
                  ) {
                    winfant++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 6
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Mother === "Yes") {
                    weighingscalemothercountYes++;
                  } else if (subdata[index].Mother === "No") {
                    weighingscalemothercountNo++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 6
        ) {
          wmother = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Mother === "Yes"
                  ) {
                    wmother++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 7
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Medicine === "Yes") {
                    medicinecountYes++;
                  } else if (subdata[index].Medicine === "No") {
                    medicinecountNo++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 7
        ) {
          medicine = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Medicine === "Yes"
                  ) {
                    medicine++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 8
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Btype === "Tile") {
                    countTile++;
                  } else if (subdata[index].Btype === "RCC") {
                    countRCC++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 8
        ) {
          btype = 0;
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Btype === "RCC"
                  ) {
                    btype++;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 9
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Borewell === true) {
                    borecount++;
                  } else if (subdata[index].well === true) {
                    wellcount++;
                  } else if (subdata[index].Panchayath === true) {
                    punchayathcount++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 9
        ) {
          well = false;
          bore = false;
          punch = false;

          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].well === true
                  ) {
                    well = true;
                  } else if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Borewell === true
                  ) {
                    bore = true;
                  } else if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].Panchayath === true
                  ) {
                    punch = true;
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 10
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.buildingstatus;
                for (let index in subdata) {
                  if (subdata[index].option === "Gifted") {
                    giftcount++;
                  } else if (subdata[index].option === "Owned") {
                    owncount++;
                  } else if (subdata[index].option === "Rented") {
                    rentcount++;
                  }
                }
              }
            }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 10
        ) {
          var i;
          bstatus = "";
          for (i = 0; i < data.length; i++) {
            if (data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.buildingstatus;
                for (let index in subdata) {
                  if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].option === "Gifted"
                  ) {
                    bstatus = "Gifted";
                  } else if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].option === "Owned"
                  ) {
                    bstatus = "Owned";
                  } else if (
                    data[i].anganwadidetails.awcplace ===
                      selectedOption.value &&
                    subdata[index].option === "Rented"
                  ) {
                    bstatus = "Rented";
                  }
                }
              }
            }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Table" &&
          selectedOption.value === "All Places"
        ) {
          for (i = 0; i < data.length; i++) {
            if (
              data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo &&
              data[i].Infrastructure
            ) {
              const subdata = data[i].Infrastructure.facilities;

              for (let index in subdata) {
                infradata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  stockanganwadicode: data[i].anganwadicode,
                  power: subdata[index].Power,
                  medicine: subdata[index].Medicine,
                  playground: subdata[index].Play,
                  toilet: subdata[index].Toilet,
                  wmother: subdata[index].Mother,
                  winfant: subdata[index].Infant,
                  Btype: subdata[index].Btype,
                  water: subdata[index].Water
                });
              }
            }
          }
          var infrafilteredarray = Object.values(infradata);

          var infradatatotables = infrafilteredarray.map(infrael =>
            Object.values(infrael)
          );
          this.setState({
            infradata: infradatatotables
          });
          console.log("All place table ");
          this.callDataTableInfra();
        } else if (
          this.state.selecteddatatypeoption.value === "Table" &&
          selectedOption.value !== "All Places"
        ) {
          for (i = 0; i < data.length; i++) {
            if (
              data[i].anganwadidetails.cdpoAcdpo === cdpoAcdpo &&
              data[i].anganwadidetails.awcplace === selectedOption.value
            ) {
              // console.log(data[i].anganwadicode, data[i].Timeline);
              const subdata = data[i].Infrastructure.facilities;

              for (let index in subdata) {
                infradata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  stockanganwadicode: data[i].anganwadicode,
                  power: subdata[index].Power,
                  medicine: subdata[index].Medicine,
                  playground: subdata[index].Play,
                  toilet: subdata[index].Toilet,
                  wmother: subdata[index].Mother,
                  winfant: subdata[index].Infant,
                  Btype: subdata[index].Btype,
                  water: subdata[index].Water
                });
              }
            }
          }
          var infrafilteredarray = Object.values(infradata);

          var infradatatotables = infrafilteredarray.map(infrael =>
            Object.values(infrael)
          );
          this.setState({
            infradata: infradatatotables
          });
          console.log("Specific place table ");
          this.callDataTableInfra();
        }

        this.setState({
          water: water,
          play: play,
          toilet: toilet,
          power: power,
          winfant: winfant,
          wmother: wmother,
          medicine: medicine,
          btype: btype,
          Infra_Water_Facility_Yes: watercountYes,
          Infra_Water_Facility_No: watercountNo,
          Infra_Btype_Tile: countTile,
          Infra_Btype_RCC: countRCC,
          Infra_Weighing_Scale_Infant_Yes: weighingscaleinfantcountYes,
          Infra_Weighing_Scale_Infant_No: weighingscaleinfantcountNo,
          Infra_Weighing_Scale_Mother_Yes: weighingscalemothercountYes,
          Infra_Weighing_Scale_Mother_No: weighingscalemothercountNo,
          Infra_power_Yes: powercountYes,
          Infra_power_No: powercountNo,
          Infra_toilet_Yes: toiletcountYes,
          Infra_toilet_No: toiletcountNo,
          Infra_play_Yes: playcountYes,
          Infra_play_No: playcountNo,
          Infra_medicine_Yes: medicinecountYes,
          Infra_medicine_No: medicinecountNo,
          Infra_wellcount: wellcount,
          Infra_borecount: borecount,
          Infra_punchayathcount: punchayathcount,
          Infra_bore: bore,
          Infra_well: well,
          Infra_punch: punch,
          Infra_rentcount: rentcount,
          Infra_owncount: owncount,
          Infra_giftcount: giftcount,
          Infra_bstatus: bstatus
        });
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  };
  // handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });
  render() {
    return (
      <CDPO_ACDPOLayout>
        <Select
          onChange={this.handleChangedatatype}
          value={this.state.selecteddatatypeoption}
          options={datatypeoption}
        />
        <br />
        {this.state.selecteddatatypeoption.value === "Chart" ? (
          <Select
            onChange={this.handleChange}
            value={this.state.selectedchartoption}
            options={chartselectoptions}
          />
        ) : null}

        {this.state.selecteddatatypeoption.value === "Table" ? (
          <div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={infrael => (this.infrael = infrael)}
            />
          </div>
        ) : null}

        <br />
        <br />
        {/* water facility */}
        {this.state.selectedchartoption.value === 1 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Water Facility</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            <br /> <br />
            {this.state.selectedchartoption.value === 1 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Water Facility",
                      this.state.Infra_Water_Facility_Yes
                    ],
                    [
                      "Number of Anganwadi's with No Water Facility",
                      this.state.Infra_Water_Facility_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            <br />
            <br />
            {this.state.selectedchartoption.value === 1 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Drinking Water Facility?
                </div>
                {this.state.water === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* water facility */}

        {/* Playground facility */}
        {this.state.selectedchartoption.value === 2 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Playground facility</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 2 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Playground Facility",
                      this.state.Infra_play_Yes
                    ],
                    [
                      "Number of Anganwadi's with No Playground Facility",
                      this.state.Infra_play_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 2 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Playground Facility?
                </div>
                {this.state.play === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* Playground facility */}

        {/* Toilet facility */}
        {this.state.selectedchartoption.value === 3 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Toilet facility</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 3 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                {" "}
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Toilet Facility",
                      this.state.Infra_toilet_Yes
                    ],
                    [
                      "Number of Anganwadi's with No Toilet Facility",
                      this.state.Infra_toilet_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 3 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Toilet Facility?
                </div>
                {this.state.toilet === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* toilet facility */}

        {/* power facility */}
        {this.state.selectedchartoption.value === 4 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Electricity Facility</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 4 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                {" "}
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Electricity Facility",
                      this.state.Infra_power_Yes
                    ],
                    [
                      "Number of Anganwadi's with No Electricity Facility",
                      this.state.Infra_power_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 4 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Electricity Facility?
                </div>
                {this.state.power === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* power facility */}

        {/* Weight infnat facility */}
        {this.state.selectedchartoption.value === 5 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> weighing scale for infant</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 5 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                {" "}
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with weighing scale for infant",
                      this.state.Infra_Weighing_Scale_Infant_Yes
                    ],
                    [
                      "Number of Anganwadi's without weighing scale for infant",
                      this.state.Infra_Weighing_Scale_Infant_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 5 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Weighing scale for Infant
                </div>
                {this.state.winfant === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* weigh infnat facility */}

        {/* Weight mother facility */}
        {this.state.selectedchartoption.value === 6 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> weighing scale for Mother</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 6 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with weighing scale for mother",
                      this.state.Infra_Weighing_Scale_Mother_Yes
                    ],
                    [
                      "Number of Anganwadi's without weighing scale for mother",
                      this.state.Infra_Weighing_Scale_Mother_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 6 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Weighing scale for Mother
                </div>
                {this.state.wmother === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* weigh mother facility */}

        {/* medicine facility */}
        {this.state.selectedchartoption.value === 7 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Medicine Kit facilities</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 7 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Medicine Facility",
                      this.state.Infra_medicine_Yes
                    ],
                    [
                      "Number of Anganwadi's with No Medicine Facility",
                      this.state.Infra_medicine_No
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 7 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  Does {this.state.selectedOption.value} Anganwadi center has
                  Medicine Kit Facility
                </div>
                {this.state.medicine === 0 ? (
                  <div className="divindbox1">No</div>
                ) : (
                  <div className="divindbox2">Yes</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* medicine facility */}

        {/* Building type facility */}
        {this.state.selectedchartoption.value === 8 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Building Type</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 8 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Tile Building",
                      this.state.Infra_Btype_Tile
                    ],
                    [
                      "Number of Anganwadi's with RCC Building",
                      this.state.Infra_Btype_RCC
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 8 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  What type of Building {this.state.selectedOption.value}{" "}
                  Anganwadi center has
                </div>
                {this.state.btype === 0 ? (
                  <div className="divindbox1">Tile</div>
                ) : (
                  <div className="divindbox2">RCC</div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* building type facility */}

        {/* Water Resource */}
        {this.state.selectedchartoption.value === 9 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Building Type</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 9 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Well Water",
                      this.state.Infra_wellcount
                    ],
                    [
                      "Number of Anganwadi's with BoreWell Water",
                      this.state.Infra_borecount
                    ],
                    [
                      "Number of Anganwadi's with Punchayath Water",
                      this.state.Infra_punchayathcount
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 9 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  {this.state.selectedOption.value} Anganwadi center has these
                  water Resources:
                </div>
                {this.state.Infra_bore === false &&
                this.state.Infra_well === false &&
                this.state.Infra_punch === false ? (
                  <div className="divindbox1">No Water resourses</div>
                ) : this.state.Infra_bore === true ? (
                  <div className="divindbox1">Borewell</div>
                ) : null}
                {this.state.Infra_bore === false &&
                this.state.Infra_well === false &&
                this.state.Infra_punch === false ? (
                  <div className="divindbox1">No Water resourses</div>
                ) : this.state.Infra_well === true ? (
                  <div className="divindbox1">Well</div>
                ) : null}
                {this.state.Infra_bore === false &&
                this.state.Infra_well === false &&
                this.state.Infra_punch === false ? (
                  <div className="divindbox1">No Water resourses</div>
                ) : this.state.Infra_punch === true ? (
                  <div className="divindbox1">Punchayath</div>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
        {/*  Water Resource */}

        {/* Building Status */}
        {this.state.selectedchartoption.value === 10 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading">Building Status</div>
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={this.state.options}
            />
            {console.log(
              this.state.selectedOption.value,
              "seleted chart value here"
            )}
            <br />
            <br />
            {this.state.selectedchartoption.value === 10 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value === "All Places" ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Own Building",
                      this.state.Infra_owncount
                    ],
                    [
                      "Number of Anganwadi's with Gifted Building ",
                      this.state.Infra_giftcount
                    ],
                    [
                      "Number of Anganwadi's with Rented Building",
                      this.state.Infra_rentcount
                    ]
                  ]}
                  options={pieOptions}
                  graph_id="PieChart"
                  width={"100%"}
                  height={"400px"}
                  legend_toggle
                />
              </div>
            ) : null}
            {this.state.selectedchartoption.value === 10 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== "All Places" &&
            this.state.selectedOption.value !== undefined ? (
              <div className="divbox">
                <div className="text">
                  What type of Building {this.state.selectedOption.value}{" "}
                  Anganwadi center has:
                </div>
                {this.state.Infra_bstatus === "" ? null : (
                  <div className="divindbox1">{this.state.Infra_bstatus} </div>
                )}
              </div>
            ) : null}
          </div>
        ) : null}
        {/* Building Status */}

        <br />
      </CDPO_ACDPOLayout>
    );
  }
}
