import "../../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import CEO_DD_DCLayout from "../../../../../OtherComponents/Layout/CEO_DD_DCLayout";
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
    label: "Well as Water Source"
  },
  {
    value: 10,
    label: "Punchayath as Water Source"
  },
  {
    value: 11,
    label: "Borewell as Water Source"
  },
  {
    value: 12,
    label: "Building Status"
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
export default class Infrastructure extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      currentsupervisorid: "",
      selectedOption: "",
      selectedTableoption: "",
      selecteddatatypeoption: "",
      options: "",
      infradata: []
    };
  }
  componentWillMount() {
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
            //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].anganwadidetails.talukname
          ) {
            options[j] = {};
            options[j].value = data[i].anganwadidetails.talukname;
            options[j].label = data[i].anganwadidetails.talukname;
            j++;
          }
        }
        var array = [];
        var index = 0;
        var options1 = [];
        for (i = 0; i < options.length; i++) {
          if (array.indexOf(options[i].value) === -1) {
            array.push(options[i].value);
            options1[index] = {};
            options1[index].value = options[i].value;
            options1[index].label = options[i].value;
            index++;
          }
        }
        this.setState({ options: options1 });

        console.log(array);
      });
    //console.log('hai 2');
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
    this.setState({ selectedOption });
    let infradata = [];
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
    var punchaythcountYes = 0;
    var wellcountYes = 0;
    var borecoutYes = 0;
    var punchaythcountNo = 0;
    var wellcountNo = 0;
    var borecoutNo = 0;
    var bstatusRent = 0;
    var bstatusGift = 0;
    var bstatusOwn = 0;
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
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 1
        ) {
          console.log("comming here");
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
              // }
            }
          }
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 2
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 2
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 3
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 3
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 4
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 4
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 5
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 5
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 6
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 6
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 7
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 7
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 8
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 8
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
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
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 9
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].Infrastructure) {
              const subdata = data[i].Infrastructure.facilities;
              for (let index in subdata) {
                if (subdata[index].well === true) {
                  wellcountYes++;
                } else if (subdata[index].well === false) {
                  wellcountNo++;
                }
              }
            }
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 9
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].well === true) {
                    wellcountYes++;
                  } else if (subdata[index].well === false) {
                    wellcountNo++;
                  }
                }
              }
            }
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 10
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].Infrastructure) {
              const subdata = data[i].Infrastructure.facilities;
              for (let index in subdata) {
                if (subdata[index].Panchayath === true) {
                  punchaythcountYes++;
                } else if (subdata[index].Panchayath === false) {
                  punchaythcountNo++;
                }
              }
            }
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 10
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Panchayath === true) {
                    punchaythcountYes++;
                  } else if (subdata[index].Panchayath === false) {
                    punchaythcountNo++;
                  }
                }
              }
            }
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 11
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].Infrastructure) {
              const subdata = data[i].Infrastructure.facilities;
              for (let index in subdata) {
                if (subdata[index].Borewell === true) {
                  borecoutYes++;
                } else if (subdata[index].Borewell === false) {
                  borecoutNo++;
                }
              }
            }
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 11
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.facilities;
                for (let index in subdata) {
                  if (subdata[index].Borewell === true) {
                    borecoutYes++;
                  } else if (subdata[index].Borewell === false) {
                    borecoutNo++;
                  }
                }
              }
            }
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value === "All Places" &&
          this.state.selectedchartoption.value === 12
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].Infrastructure) {
              const subdata = data[i].Infrastructure.buildingstatus;
              for (let index in subdata) {
                if (subdata[index].option === "Owned") {
                  bstatusOwn++;
                } else if (subdata[index].option === "Rented") {
                  bstatusRent++;
                } else if (subdata[index].option === "Gifted") {
                  bstatusGift++;
                }
              }
            }
            // }
          }
          console.log("All chartplace  here Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Chart" &&
          selectedOption.value !== "All Places" &&
          this.state.selectedchartoption.value === 12
        ) {
          var i;
          for (i = 0; i < data.length; i++) {
            // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
            if (data[i].anganwadidetails.talukname === selectedOption.value) {
              if (data[i].Infrastructure) {
                const subdata = data[i].Infrastructure.buildingstatus;
                for (let index in subdata) {
                  if (subdata[index].option === "Owned") {
                    bstatusOwn++;
                  } else if (subdata[index].option === "Rented") {
                    bstatusRent++;
                  } else if (subdata[index].option === "Gifted") {
                    bstatusGift++;
                  }
                }
              }
            }
            // }
          }
          console.log("specific place chart Playground");
        } else if (
          this.state.selecteddatatypeoption.value === "Table" &&
          selectedOption.value === "All Places"
        ) {
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Infrastructure
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
          console.log("All place table ");
          this.callDataTableInfra();
        } else if (
          this.state.selecteddatatypeoption.value === "Table" &&
          selectedOption.value !== "All Places"
        ) {
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].anganwadidetails.talukname === selectedOption.value
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
          Infra_wellcountYes: wellcountYes,
          Infra_wellcountNo: wellcountNo,
          Infra_borecoutYes: borecoutYes,
          Infra_borecoutNo: borecoutNo,
          Infra_punchaythcountYes: punchaythcountYes,
          Infra_punchaythcountNo: punchaythcountNo,
          Infra_bstatusRent: bstatusRent,
          Infra_bstatusGift: bstatusGift,
          Infra_bstatusOwn: bstatusOwn
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
      <CEO_DD_DCLayout>
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
            this.state.selectedOption.value !== undefined ? (
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
          </div>
        ) : null}
        {/* building type facility */}

        {/* Well water type facility */}
        {this.state.selectedchartoption.value === 9 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Well water Source</div>
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
            this.state.selectedOption.value !== undefined ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Well water Source",
                      this.state.Infra_wellcountYes
                    ],
                    [
                      "Number of Anganwadi's with out Well water Source",
                      this.state.Infra_wellcountNo
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
          </div>
        ) : null}
        {/* Well water  facility */}

        {/* punchayath water  facility */}
        {this.state.selectedchartoption.value === 10 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Punchayath water Source</div>
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
            this.state.selectedOption.value !== undefined ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Punchayath water Source",
                      this.state.Infra_punchaythcountYes
                    ],
                    [
                      "Number of Anganwadi's with without Punchayath water Source",
                      this.state.Infra_punchaythcountNo
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
          </div>
        ) : null}
        {/* punchayath water facility */}

        {/* borewell water  facility */}
        {this.state.selectedchartoption.value === 11 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Borewell water Source</div>
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
            {this.state.selectedchartoption.value === 11 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== undefined ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Borewell water Source",
                      this.state.Infra_borecoutYes
                    ],
                    [
                      "Number of Anganwadi's with No BreWell water Source",
                      this.state.Infra_borecoutNo
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
          </div>
        ) : null}
        {/* borewell water facility */}

        {/* Bstatus   facility */}
        {this.state.selectedchartoption.value === 12 &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <div className="heading"> Building Status</div>
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
            {this.state.selectedchartoption.value === 12 &&
            this.state.selecteddatatypeoption.value === "Chart" &&
            this.state.selectedOption.value !== undefined ? (
              <div class="divbox">
                <Chart
                  chartType="PieChart"
                  data={[
                    ["title", "value"],
                    [
                      "Number of Anganwadi's with Rented Building",
                      this.state.Infra_bstatusRent
                    ],
                    [
                      "Number of Anganwadi's with Own  Building",
                      this.state.Infra_bstatusOwn
                    ],
                    [
                      "Number of Anganwadi's with  Gifted Building",
                      this.state.Infra_bstatusGift
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
          </div>
        ) : null}
        {/* Bstatus  facility */}

        <br />
      </CEO_DD_DCLayout>
    );
  }
}


