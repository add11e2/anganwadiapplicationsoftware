import "../../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import CEO_DD_DCLayout from "../../../../../OtherComponents/Layout/CEO_DD_DCLayout";
import ReactDOM from "react-dom";
import Chart from "react-google-charts";
import firebase from "../../../../../Firebase";
import Select from "react-select"; // v 1.3.0
import "react-select/dist/react-select.css";
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

let options = [];
let index = 1;
options[0] = {};
options[0].value = "All";
options[0].label = "All";

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
    value: "Child sex ratio",
    label: "Child sex ratio"
  },
  {
    value: "Child mortality rate",
    label: "Child mortality rate"
  },
  {
    value: "Stunting in children",
    label: "Stunting in children"
  },
  {
    value: "Institutional and Non-Institutional Deliveries",
    label: "Institutional and Non-Institutional Deliveries"
  },
  {
    value: "Prevalence of wasting",
    label: "Prevalence of wasting"
  },
  {
    value: "Prevalence of underweight",
    label: "Prevalence of underweight"
  },
  {
    value: "Healthy and unhealthy children",
    label: "Healthy and unhealthy children"
  },
  {
    value: "Very Low Birthweight (less than 2,500 grams)",
    label: "Very Low Birthweight (less than 2,500 grams)"
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
export default class Maternal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      currentsupervisorid: "",
      selectedOption: "",
      childsexratiodata: [],
      selectedTableoption: "",
      selecteddatatypeoption: "",
      stunt1: [],
      underweight1: [],
      childmortality: [],
      Ideliveries: [],
      Wasting: [],
      ChildHealth: [],
      lowbirthweight: []
    };
  }
  componentWillMount() {}

  callDataTableChildSexRatio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childsexratioel) return;
    this.$childsexratioel = $(this.childsexratioel);
    this.$childsexratioel.DataTable({
      data:
        this.state.childsexratiodata === ""
          ? "No data available"
          : this.state.childsexratiodata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Male" },
        { title: "Female" }
      ],
      ordering: false
    });
    //}
  }

  callDataTablestunt() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.stunt1el) return;
    this.$stunt1el = $(this.stunt1el);
    this.$stunt1el.DataTable({
      data: this.state.stunt1 === "" ? "No data available" : this.state.stunt1,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }
  callDataTableunder() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childunderratioel) return;
    this.$childunderratioel = $(this.childunderratioel);
    this.$childunderratioel.DataTable({
      data:
        this.state.underweight1 === ""
          ? "No data available"
          : this.state.underweight1,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }

  callDataTableChildMortalityRatio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childmortalityratioel) return;
    this.$childmortalityratioel = $(this.childmortalityratioel);
    this.$childmortalityratioel.DataTable({
      data:
        this.state.childmortality === ""
          ? "No data available"
          : this.state.childmortality,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }

  callDataTableChildIDeliveryRatio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childideliveryratioel) return;
    this.$childideliveryratioel = $(this.childideliveryratioel);
    this.$childideliveryratioel.DataTable({
      data:
        this.state.Ideliveries === ""
          ? "No data available"
          : this.state.Ideliveries,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }

  callDataTableChildWastingRatio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.wastingel) return;
    this.$wastingel = $(this.wastingel);
    this.$wastingel.DataTable({
      data:
        this.state.Wasting === "" ? "No data available" : this.state.Wasting,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }

  callDataTableHealth() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childhealthratioel) return;
    this.$childhealthratioel = $(this.childhealthratioel);
    this.$childhealthratioel.DataTable({
      data:
        this.state.ChildHealth === ""
          ? "No data available"
          : this.state.ChildHealth,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }
  //callDataTableLowBirthWeight
  callDataTableLowBirthWeight() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childlowbirthweightratioel) return;
    this.$childlowbirthweightratioel = $(this.childlowbirthweightratioel);
    this.$childlowbirthweightratioel.DataTable({
      data:
        this.state.lowbirthweight === ""
          ? "No data available"
          : this.state.lowbirthweight,
      columns: [{ title: "Anganwadi Code" }, { title: "Yes" }, { title: "No" }],
      ordering: false
    });
    //}
  }

  handleChangeYear = selectedOption => {
    this.setState({ selectedOption });
    // var currentsupervisorid = this.props.user.uid;
    let childsexrationdata = [];
    if (selectedOption.value === "none" || selectedOption.value === "All") {
      var gendercountMale = 0;
      var gendercountFemale = 0;

      var borncount = 0;
      var diedcount = 0;
      var Institutionalcount = 0;
      var NonInstitutionalcount = 0;
      var stuntcountyes = 0;
      var stuntcountno = 0;
      var undercountyes = 0;
      var undercountno = 0;
      var wastingcountyes = 0;
      var wastingcountno = 0;
      var healthy = 0;
      var unhealthy = 0;
      var lowbirthcountyes = 0;
      var lowbirthcountno = 0;

      firebase
        .database()
        .ref(`users`)
        .once("value")
        .then(snapshot => {
          var count = 0;
          const data = firebaseLooper(snapshot);

          var i;
          //gender
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var gendercountMale1 = 0;
              var gendercountFemale1 = 0;
              const subdata = data[i].Maternal.ChildRegistration;

              for (let index in subdata) {
                if (subdata[index].option === "Male") {
                  gendercountMale++;
                  gendercountMale1++;
                } else if (subdata[index].option === "Female") {
                  gendercountFemale++;
                  gendercountFemale1++;
                }
              }

              childsexrationdata.push({
                childsexanganwadicode: data[i].anganwadicode,
                Male: gendercountMale1,
                Female: gendercountFemale1
              });
            }
            var childsexratiofilteredarray = Object.values(childsexrationdata);

            var childsexratiodatatotables = childsexratiofilteredarray.map(
              childsexratioel => Object.values(childsexratioel)
            );
            // console.log(stockdatatotables);
            this.setState({
              childsexratiodata: childsexratiodatatotables
            });
          }

          this.callDataTableChildSexRatio();

          //child mortality
          let childmortality = [];
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var borncount1 = 0;
              var diedcount1 = 0;
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                if (subdata[index].status === "Born") {
                  borncount++;
                  borncount1++;
                } else if (subdata[index].status === "Died") {
                  diedcount++;
                  diedcount1++;
                }
              }
              childmortality.push({
                childsexanganwadicode: data[i].anganwadicode,
                bornCount: borncount1,
                diedCount: diedcount1
              });
            }
            var childmortalityfilteredarray = Object.values(childmortality);

            var childmortalityratiodatatotables = childmortalityfilteredarray.map(
              childmortalityratioel => Object.values(childmortalityratioel)
            );
            // console.log(stockdatatotables);
            this.setState({
              childmortality: childmortalityratiodatatotables
            });
          }
          this.callDataTableChildMortalityRatio();

          //delivery type
          let Ideliveries = [];
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var Institutionalcount1 = 0;
              var NonInstitutionalcount1 = 0;
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].ideli === "Yes") {
                  Institutionalcount++;
                  Institutionalcount1++;
                } else if (subdata[index].ideli === "No") {
                  NonInstitutionalcount++;
                  NonInstitutionalcount1++;
                }
              }
              Ideliveries.push({
                childsexanganwadicode: data[i].anganwadicode,
                IBCount: Institutionalcount1,
                IDCount: NonInstitutionalcount1
              });
            }
            var childideliveryfilteredarray = Object.values(Ideliveries);

            var childideliveryratiodatatotables = childideliveryfilteredarray.map(
              childideliveryratioel => Object.values(childideliveryratioel)
            );
            // console.log(stockdatatotables);
            this.setState({
              Ideliveries: childideliveryratiodatatotables
            });
          }
          this.callDataTableChildIDeliveryRatio();
          //Stunting in children
          let stunt1 = [];
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var stuntcountyes1 = 0;
              var stuntcountno1 = 0;
              const subdata = data[i].Maternal.Nutrition;

              for (let index in subdata) {
                if (subdata[index].stunt === "Yes") {
                  stuntcountyes++;
                  stuntcountyes1++;
                } else if (subdata[index].stunt === "No") {
                  stuntcountno++;
                  stuntcountno1++;
                }
              }

              stunt1.push({
                stuntanganwadicode: data[i].anganwadicode,
                StuntYes: stuntcountyes1,
                StuntNo: stuntcountno1
              });
            }
            var stunt1filteredarray = Object.values(stunt1);

            var stunt1datatotables = stunt1filteredarray.map(stunt1el =>
              Object.values(stunt1el)
            );
            // console.log(stockdatatotables);
            this.setState({
              stunt1: stunt1datatotables
            });
          }

          this.callDataTablestunt();

          //Prevalence of wasting
          let Wasting = [];
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var wastingcountyes1 = 0;
              var wastingcountno1 = 0;
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].wast === "Yes") {
                  wastingcountyes++;
                  wastingcountyes1++;
                } else if (subdata[index].wast === "No") {
                  wastingcountno++;
                  wastingcountno1++;
                }
              }
              Wasting.push({
                wastinganganwadicode: data[i].anganwadicode,
                WastingYes: wastingcountyes1,
                WastingNo: wastingcountno1
              });
            }
            var wastingfilteredarray = Object.values(Wasting);

            var wastingdatatotables = wastingfilteredarray.map(wastingel =>
              Object.values(wastingel)
            );
            // console.log(stockdatatotables);
            this.setState({
              Wasting: wastingdatatotables
            });
          }

          this.callDataTableChildWastingRatio();
          //Prevalence of underweight
          let underweight1 = [];
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var undercountyes1 = 0;
              var undercountno1 = 0;
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].under === "Yes") {
                  undercountyes++;
                  undercountyes1++;
                } else if (subdata[index].under === "No") {
                  undercountno++;
                  undercountno1++;
                }
              }
              underweight1.push({
                childunderanganwadicode: data[i].anganwadicode,
                UnderYes: undercountyes1,
                UnderNo: undercountno1
              });
            }
            var childunderfilteredarray = Object.values(underweight1);

            var childsunderdatatotables = childunderfilteredarray.map(
              childunderratioel => Object.values(childunderratioel)
            );
            // console.log(stockdatatotables);
            this.setState({
              underweight1: childsunderdatatotables
            });
          }
          this.callDataTableunder();

          //Healthy and unhealthy children
          let ChildHealth = [];
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var healthy1 = 0;
              var unhealthy1 = 0;
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                if (subdata[index].health === "healthy") {
                  healthy++;
                  healthy1++;
                } else if (subdata[index].health === "unhealthy") {
                  unhealthy++;
                  unhealthy1++;
                }
              }
              ChildHealth.push({
                childhealthanganwadicode: data[i].anganwadicode,
                HealthYes: healthy1,
                HealthNo: unhealthy1
              });
            }
            var childhealthfilteredarray = Object.values(ChildHealth);

            var childhealthdatatotables = childhealthfilteredarray.map(
              childhealthratioel => Object.values(childhealthratioel)
            );
            // console.log(stockdatatotables);
            this.setState({
              ChildHealth: childhealthdatatotables
            });
          }
          this.callDataTableHealth();

          //lowbirthweight
          let lowbirthweight = [];
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              var lowbirthcountyes1 = 0;
              var lowbirthcountno1 = 0;
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].lowbirth === "Yes") {
                  lowbirthcountyes++;
                  lowbirthcountyes1++;
                } else if (subdata[index].lowbirth === "No") {
                  lowbirthcountno++;
                  lowbirthcountno1++;
                }
              }
              lowbirthweight.push({
                childhealthanganwadicode: data[i].anganwadicode,
                HealthYes: healthy1,
                HealthNo: unhealthy1
              });
            }
            var childlowbirthweightfilteredarray = Object.values(
              lowbirthweight
            );

            var childlowbirthweightdatatotables = childlowbirthweightfilteredarray.map(
              childlowbirthweightratioel =>
                Object.values(childlowbirthweightratioel)
            );
            // console.log(stockdatatotables);
            this.setState({
              lowbirthweight: childlowbirthweightdatatotables
            });
          }
          this.callDataTableLowBirthWeight();

          this.setState({
            M_C_gender_Male: gendercountMale,
            M_C_gender_Female: gendercountFemale,
            M_C_status_birth: borncount,
            M_C_status_death: diedcount,
            M_C_Institutional: Institutionalcount,
            M_C_NonInstitutional: NonInstitutionalcount,
            M_C_Stunting_yes: stuntcountyes,
            M_C_Stunting_no: stuntcountno,
            M_C_wasting_yes: wastingcountyes,
            M_C_wasting_no: wastingcountno,
            M_C_underweight_yes: undercountyes,
            M_C_underweight_no: undercountno,
            M_C_healthy: healthy,
            M_C_unhealthy: unhealthy,
            M_C_VL_Birthweight: lowbirthcountyes,
            M_C_NORMAL_Birthweight: lowbirthcountno
          });
        })
        .catch(e => {
          console.log("error returned - ", e);
        });
    } else {
      var gendercountMale = 0;
      var gendercountFemale = 0;
      var borncount = 0;
      var diedcount = 0;
      var Institutionalcount = 0;
      var NonInstitutionalcount = 0;
      var stuntcountyes = 0;
      var stuntcountno = 0;
      var undercountyes = 0;
      var undercountno = 0;
      var wastingcountyes = 0;
      var wastingcountno = 0;
      var healthy = 0;
      var unhealthy = 0;
      var lowbirthcountyes = 0;
      var lowbirthcountno = 0;
      firebase
        .database()
        .ref(`users`)
        .once("value")
        .then(snapshot => {
          var count = 0;
          const data = firebaseLooper(snapshot);

          var i;
          //gender
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                var str = subdata[index].DPickdob;

                var dobyear = str.substring(0, 4);
                console.log(dobyear, selectedOption.value);
                if (
                  subdata[index].option === "Male" &&
                  dobyear == selectedOption.value
                ) {
                  gendercountMale++;
                } else if (
                  subdata[index].option === "Female" &&
                  dobyear == selectedOption.value
                ) {
                  gendercountFemale++;
                }
              }
            }
          }
          //child mortality

          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                var str = subdata[index].DPickdob;

                var dobyear = str.substring(0, 4);
                console.log(dobyear, selectedOption.value);
                if (
                  subdata[index].status === "Born" &&
                  dobyear == selectedOption.value
                ) {
                  borncount++;
                } else if (
                  subdata[index].status === "Died" &&
                  dobyear == selectedOption.value
                ) {
                  diedcount++;
                }
              }
            }
          }
          //delivery type
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].ideli === "Yes") {
                  Institutionalcount++;
                } else if (subdata[index].ideli === "No") {
                  NonInstitutionalcount++;
                }
              }
            }
          }
          //Stunting in children
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].stunt === "Yes") {
                  stuntcountyes++;
                } else if (subdata[index].stunt === "No") {
                  stuntcountno++;
                }
              }
            }
          }
          //Prevalence of wasting
          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].wast === "Yes") {
                  wastingcountyes++;
                } else if (subdata[index].wast === "No") {
                  wastingcountno++;
                }
              }
            }
          }
          //Prevalence of underweight
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].under === "Yes") {
                  undercountyes++;
                } else if (subdata[index].under === "No") {
                  undercountno++;
                }
              }
            }
          }
          //Healthy and unhealthy children
          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                var str = subdata[index].DPickdob;

                var dobyear = str.substring(0, 4);
                console.log(dobyear, selectedOption.value);
                if (
                  subdata[index].health === "healthy" &&
                  dobyear == selectedOption.value
                ) {
                  healthy++;
                } else if (
                  subdata[index].health === "unhealthy" &&
                  dobyear == selectedOption.value
                ) {
                  unhealthy++;
                }
              }
            }
          }

          for (i = 0; i < data.length; i++) {
            if (
              //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.Nutrition;
              for (let index in subdata) {
                if (subdata[index].lowbirth === "Yes") {
                  lowbirthcountyes++;
                } else if (subdata[index].lowbirth === "No") {
                  lowbirthcountno++;
                }
              }
            }
          }
          this.setState({
            M_C_gender_Male: gendercountMale,
            M_C_gender_Female: gendercountFemale,
            M_C_status_birth: borncount,
            M_C_status_death: diedcount,
            M_C_Institutional: Institutionalcount,
            M_C_NonInstitutional: NonInstitutionalcount,
            M_C_Stunting_yes: stuntcountyes,
            M_C_Stunting_no: stuntcountno,
            M_C_wasting_yes: wastingcountyes,
            M_C_wasting_no: wastingcountno,
            M_C_underweight_yes: undercountyes,
            M_C_underweight_no: undercountno,
            M_C_healthy: healthy,
            M_C_unhealthy: unhealthy,
            M_C_VL_Birthweight: lowbirthcountyes,
            M_C_NORMAL_Birthweight: lowbirthcountno
          });
        })
        .catch(e => {
          console.log("error returned - ", e);
        });
    }
  };
  // handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });
  render() {
    const { selectedOption } = this.state;
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
          <Select
            onChange={this.handleChangeTable}
            value={this.state.selectedTableoption}
            options={chartselectoptions}
          />
        ) : null}

        <br />
        <br />
        {/* child sex ratio */}
        {this.state.selectedchartoption.value === "Child sex ratio" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Number of Male and Female children
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Number of Male Child", this.state.M_C_gender_Male],
                ["Number of Female child", this.state.M_C_gender_Female]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Child sex ratio" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value === "Child sex ratio" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                ref={childsexratioel =>
                  (this.childsexratioel = childsexratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {/* Child mortality rate*/}
        {this.state.selectedchartoption.value === "Child mortality rate" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Child mortality rate
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Child birth rate", this.state.M_C_status_birth],
                ["Child death rate", this.state.M_C_status_death]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Child mortality rate" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value === "Child mortality rate" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childmortalityratioel =>
                  (this.childmortalityratioel = childmortalityratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {/*Institutional and Non-Institutional Deliveries*/}
        {this.state.selectedchartoption.value ===
          "Institutional and Non-Institutional Deliveries" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Institutional and Non-Institutional Deliveries
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Institutional Deliveries",
                  this.state.M_C_Institutional
                ],
                [
                  "Number of Non-Institutional Deliveries",
                  this.state.M_C_NonInstitutional
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

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Institutional and Non-Institutional Deliveries" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value ===
              "Institutional and Non-Institutional Deliveries" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childideliveryratioel =>
                  (this.childideliveryratioel = childideliveryratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {/* Stunting in children */}
        {this.state.selectedchartoption.value === "Stunting in children" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Stunting in children
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of children who are stunted",
                  this.state.M_C_Stunting_yes
                ],
                [
                  "Number of children who are non-stunted",
                  this.state.M_C_Stunting_no
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

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Stunting in children" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value === "Stunting in children" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                ref={stunt1el => (this.stunt1el = stunt1el)}
              />
            ) : null}
          </div>
        ) : null}

        {/* Prevalence of wasting */}
        {this.state.selectedchartoption.value === "Prevalence of wasting" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Prevalence of wasting
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of children who are wasted",
                  this.state.M_C_wasting_yes
                ],
                [
                  "Number of children who are non-wasted",
                  this.state.M_C_wasting_no
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

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Prevalence of wasting" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value === "Prevalence of wasting" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                ref={wastingel => (this.wastingel = wastingel)}
              />
            ) : null}
          </div>
        ) : null}

        {/* Prevalence of underweight */}
        {this.state.selectedchartoption.value === "Prevalence of underweight" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Prevalence of underweight
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Underweight Children",
                  this.state.M_C_underweight_yes
                ],
                [
                  "Number of Non-underweight Children",
                  this.state.M_C_underweight_no
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

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Prevalence of underweight" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value ===
              "Prevalence of underweight" && this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childunderratioel =>
                  (this.childunderratioel = childunderratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {/* healthy and unhealthy children */}
        {this.state.selectedchartoption.value ===
          "Healthy and unhealthy children" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Number of healthy and unhealthy children
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Number of healthy Children", this.state.M_C_healthy],
                ["Number of unhealthy Children", this.state.M_C_unhealthy]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Healthy and unhealthy children" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value ===
              "Healthy and unhealthy children" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childhealthratioel =>
                  (this.childhealthratioel = childhealthratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {/* Very Low Birthweight (less than 2,500 grams) */}
        {this.state.selectedchartoption.value ===
          "Very Low Birthweight (less than 2,500 grams)" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Number of Very Low Birth Weight Children
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Very Low Birthweight Children",
                  this.state.M_C_VL_Birthweight
                ],
                [
                  "Number of Normal Weight Children",
                  this.state.M_C_NORMAL_Birthweight
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

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Very Low Birthweight (less than 2,500 grams" ? (
          <div>
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            {this.state.selectedTableoption.value ===
              "Very Low Birthweight (less than 2,500 grams" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childlowbirthweightratioel =>
                  (this.childlowbirthweightratioel = childlowbirthweightratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        <br />
      </CEO_DD_DCLayout>
    );
  }
}


