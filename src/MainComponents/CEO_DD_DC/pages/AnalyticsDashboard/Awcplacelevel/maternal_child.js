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
  },
  {
    value: "Polio Dates",
    label: "Polio Dates"
  },
  {
    value: "BCG Dates",
    label: "BCG Dates"
  },
  {
    value: "Hepatitis Dates",
    label: "Hepatitis Dates"
  },
  {
    value: "DPT1 Dates",
    label: "DPT1 Dates"
  },
  {
    value: "DPT2 Dates",
    label: "DPT2 Dates"
  },
  {
    value: "DPT3 Dates",
    label: "DPT3 Dates"
  },
  {
    value: "OPV1 Dates",
    label: "OPV1 Dates"
  },
  {
    value: "OPV2 Dates",
    label: "OPV2 Dates"
  },
  {
    value: "OPV3 Dates",
    label: "OPV3 Dates"
  },
  {
    value: "Dptbooster Dates",
    label: "Dptbooster Dates"
  },
  {
    value: "Hepatitis1 Dates",
    label: "Hepatitis1 Dates"
  },
  {
    value: "Dadara1 Dates",
    label: "Dadara1 Dates"
  },
  {
    value: "Dadara2 Dates",
    label: "Dadara2 Dates"
  },
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
export default class Maternal extends Component{
  constructor(props) {
    super(props);
    this.state = {
      optionsplace: "",
      selectedchartoption: "",
      currentsupervisorid: "",
      selectedOption: "",
      selectedOptionplace: "",
      childsexratiodata: [],
      selectedTableoption: "",
      selecteddatatypeoption: "",
      stunt1: [],
      underweight1: [],
      childmortality: [],
      Ideliveries: [],
      Wasting: [],
      ChildHealth: [],
      lowbirthweight: [],
      poliodates: [],
      bcgdates: [],
      hepadates: [],
      dpt1dates: [],
      dpt2dates: [],
      dpt3dates: [],
      opv1dates: [],
      opv2dates: [],
      opv3dates: [],
      hepa1dates:[],
      dadara1dates:[],
      dadara2dates:[],
      dptboosterdates:[]
    };
  }
  //today here
  componentWillMount() {
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
            data[i].anganwadidetails.awcplace
          ) {
            optionsplace[j] = {};
            optionsplace[j].value = data[i].anganwadidetails.awcplace;
            optionsplace[j].label = data[i].anganwadidetails.awcplace;
            j++;
          }
        }
        this.setState({ optionsplace: optionsplace });
      });
  }
  //to here
  callDataTableChildSexRatio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childsexratioel) return;
    this.$childsexratioel = $(this.childsexratioel);
    this.$childsexratioel.DataTable({
      data:
        this.state.childsexratiodata === ""
          ? "No data availableooo"
          : this.state.childsexratiodata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Male" },
        { title: "Female" }
      ],
      ordering: false,
      destroy: true
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
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Yes" },
        { title: "No" }
      ],
      ordering: false,
      destroy: true
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
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Underweight" },
        { title: "Normal Weight" }
      ],
      ordering: false,
      destroy: true
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
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Born" },
        { title: "Died" }
      ],
      ordering: false,
      destroy: true
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
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Yes" },
        { title: "No" }
      ],
      ordering: false,
      destroy: true
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
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Yes" },
        { title: "No" }
      ],
      ordering: false,
      destroy: true
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
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Healthy Children" },
        { title: "Unhealthy Children" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }
  //callDataTableLowBirthWeight
  callDataTableLowBirthWeight() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childlowbirthweightratioels) return;
    this.$childlowbirthweightratioel = $(this.childlowbirthweightratioel);
    this.$childlowbirthweightratioel.DataTable({
      data:
        this.state.lowbirthweight === ""
          ? "No data available"
          : this.state.lowbirthweight,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "LowBirthWeight" },
        { title: "NormalWeight" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }
  callDataTablePolio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childpolioratioel) return;
    this.$childpolioratioel = $(this.childpolioratioel);
    this.$childpolioratioel.DataTable({
      data:
        this.state.poliodates === ""
          ? "No data available"
          : this.state.poliodates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }
  callDataTableBcg() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childbcgratioel) return;
    this.$childbcgratioel = $(this.childbcgratioel);
    this.$childbcgratioel.DataTable({
      data:
        this.state.bcgdates === "" ? "No data available" : this.state.bcgdates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableHepa() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childheparatioel) return;
    this.$childheparatioel = $(this.childheparatioel);
    this.$childheparatioel.DataTable({
      data:
        this.state.hepadates === ""
          ? "No data available"
          : this.state.hepadates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableDPT1() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childdpt1ratioel) return;
    this.$childdpt1ratioel = $(this.childdpt1ratioel);
    this.$childdpt1ratioel.DataTable({
      data:
        this.state.dpt1dates === ""
          ? "No data available"
          : this.state.dpt1dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }
  callDataTableDPT2() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childdpt2ratioel) return;
    this.$childdpt2ratioel = $(this.childdpt2ratioel);
    this.$childdpt2ratioel.DataTable({
      data:
        this.state.dpt2dates === ""
          ? "No data available"
          : this.state.dpt2dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableDPT3() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childdpt3ratioel) return;
    this.$childdpt3ratioel = $(this.childdpt3ratioel);
    this.$childdpt3ratioel.DataTable({
      data:
        this.state.dpt3dates === ""
          ? "No data available"
          : this.state.dpt3dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  //Opv1 dates

  callDataTableOPV1() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childopv1ratioel) return;
    this.$childopv1ratioel = $(this.childopv1ratioel);
    this.$childopv1ratioel.DataTable({
      data:
        this.state.opv1dates === ""
          ? "No data available"
          : this.state.opv1dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  //OPv2 dates

  callDataTableOPV2() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childopv2ratioel) return;
    this.$childopv2ratioel = $(this.childopv2ratioel);
    this.$childopv2ratioel.DataTable({
      data:
        this.state.opv2dates === ""
          ? "No data available"
          : this.state.opv2dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableOPV3() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childopv3ratioel) return;
    this.$childopv3ratioel = $(this.childopv3ratioel);
    this.$childopv3ratioel.DataTable({
      data:
        this.state.opv3dates === ""
          ? "No data available"
          : this.state.opv3dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableHepa1() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childhepa1ratioel) return;
    this.$childhepa1ratioel = $(this.childhepa1ratioel);
    this.$childhepa1ratioel.DataTable({
      data:
        this.state.hepa1dates === ""
          ? "No data available"
          : this.state.hepa1dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableDadara1() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childdadara1ratioel) return;
    this.$childdadara1ratioel = $(this.childdadara1ratioel);
    this.$childdadara1ratioel.DataTable({
      data:
        this.state.dadara1dates === ""
          ? "No data available"
          : this.state.dadara1dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableDadara2() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childdadara2ratioel) return;
    this.$childdadara2ratioel = $(this.childdadara2ratioel);
    this.$childdadara2ratioel.DataTable({
      data:
        this.state.dadara2dates === ""
          ? "No data available"
          : this.state.dadara2dates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }

  callDataTableDptbooster() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childdptboosterratioel) return;
    this.$childdptboosterratioel = $(this.childdptboosterratioel);
    this.$childdptboosterratioel.DataTable({
      data:
        this.state.dptboosterdates === ""
          ? "No data available"
          : this.state.dptboosterdates,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total" },
        { title: "Given" },
        { title: "Not Given" }
      ],
      ordering: false,
      destroy: true
    });
    //}
  }
  handleChangeYear = selectedOption => {
    this.setState({ selectedOption });
    // var currentsupervisorid = this.props.user.uid;
    let childsexrationdata = [];
    let childmortality = [];
    let Ideliveries = [];
    let ChildHealth = [];
    let stunt1 = [];
    let Wasting = [];
    let poliodates = [];
    let bcgdates = [];
    let lowbirthweight = [];

    let underweight1 = [];
    let hepadates = [];
    let dpt1dates = [];
    let dpt2dates = [];
    let dpt3dates = [];
    let opv1dates = [];
    let opv2dates = [];
    let opv3dates = [];
    let hepa1dates=[];
    let dadara1dates=[];
    let dadara2dates=[];
    let dptboosterdates=[];

    const selectedplace = this.state.selectedOptionplace.value;
    if (selectedplace === "All Places") {
      console.log("selected place", selectedplace, "----");
      if (selectedOption.value === "none" || selectedOption.value === "All") {
        //  if( this.state.selecteddatatypeoption.value === "Chart" &&
        //  selectedOption.value === "All Places" && selectedOption.value === "All" &&
        //  this.state.selectedchartoption.value === 1){
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;

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
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadidetails.awcplace,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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
                totalchild = borncount1 + diedcount1;
                // TotalChild: totalchild,
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                totalchild = Institutionalcount1 + NonInstitutionalcount1;

                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  lowbirthweightanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  LowBirthCountYes: lowbirthcountyes1,
                  LowBirthCountNo: lowbirthcountno1
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

            //polio date
            let poliodates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var poliocount1 = 0;
                var poliocountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].poliodate !== undefined) {
                    var polio = subdata[index].poliodate;
                    console.log("poliosdad", polio);
                    poliocount++;
                    poliocount1++;
                  } else if (subdata[index].poliodate == undefined) {
                    poliocountno++;
                    poliocountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = poliocount1 + poliocountno1;
                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            //BCG DATES
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].BCG !== undefined) {
                    var polio = subdata[index].BCG;
                    console.log("poliosdad", polio);
                    bcgcount++;
                    bcgcount1++;
                  } else if (subdata[index].BCG == undefined) {
                    bcgcountno++;
                    bcgcountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            // Hepatitis date
            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa !== undefined) {
                    hepacount++;
                    hepacount1++;
                  } else if (subdata[index].hepa == undefined) {
                    hepacountno++;
                    hepacountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            //DPT1
            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT1 !== undefined) {
                    dpt1count++;
                    dpt1count1++;
                  } else if (subdata[index].DPT1 == undefined) {
                    dpt1countno++;
                    dpt1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            //DPT2
            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT2 !== undefined) {
                    dpt2count++;
                    dpt2count1++;
                  } else if (subdata[index].DPT2 == undefined) {
                    dpt2countno++;
                    dpt2countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            //DPT3
            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT3 !== undefined) {
                    dpt3count++;
                    dpt3count1++;
                  } else if (subdata[index].DPT3 == undefined) {
                    dpt3countno++;
                    dpt3countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1 dates

            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV1 !== undefined) {
                    opv1count++;
                    opv1count1++;
                  } else if (subdata[index].OPV1 == undefined) {
                    opv1countno++;
                    opv1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

             //opv2 dates

             let opv2dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal
               ) {
                 var totalchild;
                 var opv2count1 = 0;
                 var opv2countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV2 !== undefined) {
                     opv2count++;
                     opv2count1++;
                   } else if (subdata[index].OPV2 == undefined) {
                     opv2countno++;
                     opv2countno1++;
                     //undercountyes1++;
                   }
                 }
                 totalchild = opv2count1 + opv2countno1;
                 opv2dates.push({
                   childdpt3anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv2Count: opv2count1,
                   Opv2CountNo: opv2countno1
                 });
               }
               var childopv2filteredarray = Object.values(opv2dates);
 
               var childopv2datatotables = childopv2filteredarray.map(
                 childopv2ratioel => Object.values(childopv2ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv2dates: childopv2datatotables
               });
             }
             this.callDataTableOPV2();

              //opv3 dates

              let opv3dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal
                ) {
                  var totalchild;
                  var opv3count1 = 0;
                  var opv3countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].OPV3 !== undefined) {
                      opv3count++;
                      opv3count1++;
                    } else if (subdata[index].OPV3 == undefined) {
                      opv3countno++;
                      opv3countno1++;
                      //undercountyes1++;
                    }
                  }
                  totalchild = opv3count1 + opv3countno1;
                  opv3dates.push({
                    childdpt3anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Opv3Count: opv3count1,
                    Opv3CountNo: opv3countno1
                  });
                }
                var childopv3filteredarray = Object.values(opv3dates);
  
                var childopv3datatotables = childopv3filteredarray.map(
                  childopv3ratioel => Object.values(childopv3ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  opv3dates: childopv3datatotables
                });
              }
              this.callDataTableOPV3();

               // Hepatitis1 date
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa1 !== undefined) {
                    hepa1count++;
                    hepa1count1++;
                  } else if (subdata[index].hepa1 == undefined) {
                    hepa1countno++;
                    hepa1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

               // Dadara1
               let dadara1dates = [];
               for (i = 0; i < data.length; i++) {
                 if (
                   //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                   data[i].Maternal
                 ) {
                   var totalchild;
                   var dadara1count1 = 0;
                   var dadara1countno1 = 0;
                   const subdata = data[i].Maternal.ChildRegistration;
                   for (let index in subdata) {
                     if (subdata[index].dadara1 !== undefined) {
                      dadara1count++;
                       dadara1count1++;
                     } else if (subdata[index].dadara1 == undefined) {
                      dadara1countno++;
                       dadara1countno1++;
                       //undercountyes1++;
                     }
                   }
                   totalchild = dadara1count1 + dadara1countno1;
                   dadara1dates.push({
                     childdadara1anganwadicode: data[i].anganwadicode,
                     TotalChild: totalchild,
                     Dadara1Count: dadara1count1,
                     Dadara1CountNo: dadara1countno1
                   });
                 }
                 var childdadara1filteredarray = Object.values(dadara1dates);
   
                 var childdadara1datatotables = childdadara1filteredarray.map(
                   childdadara1ratioel => Object.values(childdadara1ratioel)
                 );
                 // console.log(stockdatatotables);
                 this.setState({
                  dadara1dates: childdadara1datatotables
                 });
               }
               this.callDataTableDadara1();

               
                // Dadara2
                let dadara2dates = [];
                for (i = 0; i < data.length; i++) {
                  if (
                    //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                    data[i].Maternal
                  ) {
                    var totalchild;
                    var dadara2count1 = 0;
                    var dadara2countno1 = 0;
                    const subdata = data[i].Maternal.ChildRegistration;
                    for (let index in subdata) {
                      if (subdata[index].dadara2 !== undefined) {
                       dadara2count++;
                        dadara2count1++;
                      } else if (subdata[index].dadara2 == undefined) {
                       dadara2countno++;
                        dadara2countno1++;
                        //undercountyes1++;
                      }
                    }
                    totalchild = dadara2count1 + dadara2countno1;
                    dadara2dates.push({
                      childdadara2anganwadicode: data[i].anganwadicode,
                      TotalChild: totalchild,
                      Dadara2Count: dadara2count1,
                      Dadara2CountNo: dadara2countno1
                    });
                  }
                  var childdadara2filteredarray = Object.values(dadara2dates);
    
                  var childdadara2datatotables = childdadara2filteredarray.map(
                    childdadara2ratioel => Object.values(childdadara2ratioel)
                  );
                  // console.log(stockdatatotables);
                  this.setState({
                   dadara2dates: childdadara2datatotables
                  });
                }
                this.callDataTableDadara2();

                //dptbooster
                let dptboosterdates = [];
                for (i = 0; i < data.length; i++) {
                  if (
                    //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                    data[i].Maternal
                  ) {
                    var totalchild;
                    var dptboostercount1 = 0;
                    var dptboostercountno1 = 0;
                    const subdata = data[i].Maternal.ChildRegistration;
                    for (let index in subdata) {
                      if (subdata[index].dptbooster !== undefined) {
                        dptboostercount++;
                       dptboostercount1++;
                      } else if (subdata[index].dptbooster == undefined) {
                        dptboostercountno++;
                       dptboostercountno1++;
                        //undercountyes1++;
                      }
                    }
                    totalchild = dptboostercount1 + dptboostercountno1;
                    dptboosterdates.push({
                      childdadara2anganwadicode: data[i].anganwadicode,
                      TotalChild: totalchild,
                      DptboosterCount: dptboostercount1,
                      DptboosterCountNo: dptboostercountno1
                    });
                  }
                  var childdptboosterdatesfilteredarray = Object.values(dptboosterdates);
    
                  var childdptboosterdatesdatatotables = childdptboosterdatesfilteredarray.map(
                    childdptboosterratioel => Object.values(childdptboosterratioel)
                  );
                  // console.log(stockdatatotables);
                  this.setState({
                    dptboosterdates: childdptboosterdatesdatatotables
                  });
                }
                this.callDataTableDptbooster();


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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Today") {
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;

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
                  // from here *********************************
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
                  // to here *********************************

                  if (subdata[index].option === "Male" && dobyear == today) {
                    gendercountMale++;
                    gendercountMale1++;
                  } else if (
                    subdata[index].option === "Female" &&
                    dobyear == today
                  ) {
                    gendercountFemale++;
                    gendercountFemale1++;
                  }
                }

                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var borncount1 = 0;
                var diedcount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // var str = subdata[index].DPickdob;

                  // var dobyear = str.substring(0, 4);
                  // console.log(dobyear, selectedOption.value);
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
                  if (subdata[index].status === "Born" && dobyear == today) {
                    borncount++;
                    borncount1++;
                  } else if (
                    subdata[index].status === "Died" &&
                    dobyear == today
                  ) {
                    diedcount++;
                    diedcount1++;
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            // delivery type

            let Ideliveries = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].ideli === "Yes" && cdob == today) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (subdata[index].ideli === "No" && cdob == today) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;

                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].stunt === "Yes" && cdob == today) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (subdata[index].stunt === "No" && cdob == today) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  console.log("today", today);
                  if (subdata[index].wast === "Yes" && cdob == today) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (subdata[index].wast === "No" && cdob == today) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();
            //Prevalence of underweight
            var cdob = "";
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].under === "Yes" && cdob == today) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (subdata[index].under === "No" && cdob == today) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].health === "healthy" && dobyear == today) {
                    healthy++;
                    healthy1++;
                  } else if (
                    subdata[index].health === "unhealthy" &&
                    dobyear == today
                  ) {
                    unhealthy++;
                    unhealthy1++;
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            //Lowbirth
            var cdob = "";
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].lowbirth === "Yes" && cdob == today) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    cdob == today
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].poliodate;
                  if (
                    subdata[index].poliodate !== undefined &&
                    dobyear == today
                  ) {
                    var polio = subdata[index].poliodate;
                    console.log("poliosdad", polio);
                    poliocount++;
                    poliocount1++;
                  } else if (
                    subdata[index].poliodate == undefined &&
                    dobyear == today
                  ) {
                    poliocountno++;
                    poliocountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = poliocount1 + poliocountno1;
                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            //Bcg Dates
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].BCG;
                  if (subdata[index].BCG !== undefined && dobyear == today) {
                    var polio = subdata[index].BCG;
                    console.log("poliosdad", polio);
                    bcgcount++;
                    bcgcount1++;
                  } else if (
                    subdata[index].BCG == undefined &&
                    dobyear == today
                  ) {
                    bcgcountno++;
                    bcgcountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            //Hepatitis date

            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].hepa;
                  if (subdata[index].hepa !== undefined && dobyear == today) {
                    hepacount++;
                    hepacount1++;
                  } else if (
                    subdata[index].hepa == undefined &&
                    dobyear == today
                  ) {
                    hepacountno++;
                    hepacountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            //dpt1
            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].DPT1;
                  if (subdata[index].DPT1 !== undefined && dobyear == today) {
                    dpt1count++;
                    dpt1count1++;
                  } else if (
                    subdata[index].DPT1 == undefined &&
                    dobyear == today
                  ) {
                    dpt1countno++;
                    dpt1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].DPT2;
                  if (subdata[index].DPT2 !== undefined && dobyear == today) {
                    dpt2count++;
                    dpt2count1++;
                  } else if (
                    subdata[index].DPT2 == undefined &&
                    dobyear == today
                  ) {
                    dpt2countno++;
                    dpt2countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            //dpt3
            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].DPT3;
                  if (subdata[index].DPT3 !== undefined && dobyear == today) {
                    dpt3count++;
                    dpt3count1++;
                  } else if (
                    subdata[index].DPT3 == undefined &&
                    dobyear == today
                  ) {
                    dpt3countno++;
                    dpt3countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1

            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].OPV1;
                  if (subdata[index].OPV1 !== undefined && dobyear == today) {
                    opv1count++;
                    opv1count1++;
                  } else if (
                    subdata[index].OPV1 == undefined &&
                    dobyear == today
                  ) {
                    opv1countno++;
                  opv1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

            //Opv2
            let opv2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv2count1 = 0;
                var opv2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].OPV2;
                  if (subdata[index].OPV2 !== undefined && dobyear == today) {
                    opv2count++;
                    opv2count1++;
                  } else if (
                    subdata[index].OPV2 == undefined &&
                    dobyear == today
                  ) {
                    opv2countno++;
                  opv2countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv2count1 + opv2countno1;
                opv2dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv2Count: opv2count1,
                  Opv2CountNo: opv2countno1
                });
              }
              var childopv2filteredarray = Object.values(opv2dates);

              var childopv2datatotables = childopv2filteredarray.map(
                childopv2ratioel => Object.values(childopv2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv2dates: childopv2datatotables
              });
            }
            this.callDataTableOPV2();

//opv3
            let opv3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv3count1 = 0;
                var opv3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].OPV3;
                  if (subdata[index].OPV3 !== undefined && dobyear == today) {
                    opv3count++;
                    opv3count1++;
                  } else if (
                    subdata[index].OPV3 == undefined &&
                    dobyear == today
                  ) {
                    opv3countno++;
                  opv3countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv3count1 + opv3countno1;
                opv2dates.push({
                  childopv3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv3Count: opv3count1,
                  Opv3CountNo: opv3countno1
                });
              }
              var childopv3filteredarray = Object.values(opv3dates);

              var childopv3datatotables = childopv3filteredarray.map(
                childopv3ratioel => Object.values(childopv3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv3dates: childopv3datatotables
              });
            }
            this.callDataTableOPV3();

            //Hepatitis1 dates
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].hepa1;
                  if (subdata[index].hepa1 !== undefined && dobyear == today) {
                    hepa1count++;
                    hepa1count1++;
                  } else if (
                    subdata[index].hepa1 == undefined &&
                    dobyear == today
                  ) {
                    hepa1countno++;
                    hepa1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

            //dadara1 dates
            let dadara1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dadara1count1 = 0;
                var  dadara1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].dadara1;
                  if (subdata[index].dadara1 !== undefined && dobyear == today) {
                    dadara1count++;
                    dadara1count1++;
                  } else if (
                    subdata[index].dadara1 == undefined &&
                    dobyear == today
                  ) {
                    dadara1countno++;
                    dadara1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dadara1count1 +dadara1countno1;
                dadara1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dadara1Count: dadara1count1,
                  Dadara1CountNo: dadara1countno1
                });
              }
              var childdadara1filteredarray = Object.values(dadara1dates);

              var childdadara1datatotables = childdadara1filteredarray.map(
                childdadara1ratioel => Object.values(childdadara1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dadara1dates: childdadara1datatotables
              });
            }
            this.callDataTableDadara1();

              //dadara2 dates
              let dadara2dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal
                ) {
                  var totalchild;
                  var dadara2count1 = 0;
                  var  dadara2countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
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
                    var dobyear = subdata[index].dadara2;
                    if (subdata[index].dadara2 !== undefined && dobyear == today) {
                      dadara2count++;
                      dadara2count1++;
                    } else if (
                      subdata[index].dadara2 == undefined &&
                      dobyear == today
                    ) {
                      dadara2countno++;
                      dadara2countno1++;
                      //undercountyes1++;
                    }
                  }
                  totalchild = dadara2count1 +dadara2countno1;
                  dadara2dates.push({
                    childhepa2anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara2Count: dadara2count1,
                    Dadara2CountNo: dadara2countno1
                  });
                }
                var childdadara2filteredarray = Object.values(dadara2dates);
  
                var childdadara2datatotables = childdadara2filteredarray.map(
                  childdadara2ratioel => Object.values(childdadara2ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara2dates: childdadara2datatotables
                });
              }
              this.callDataTableDadara2();
            
              //dptbooster dates
              let dptboosterdates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal
                ) {
                  var totalchild;
                  var dptboostercount1 = 0;
                  var  dptboostercountno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
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
                    var dobyear = subdata[index].dptbooster;
                    if (subdata[index].dptbooster !== undefined && dobyear == today) {
                      dptboostercount++;
                      dptboostercount1++;
                    } else if (
                      subdata[index].dptbooster == undefined &&
                      dobyear == today
                    ) {
                      dptboostercountno++;
                      dptboostercountno1++;
                      //undercountyes1++;
                    }
                  }
                  totalchild = dptboostercount1 +dptboostercountno1;
                  dptboosterdates.push({
                    childdptboosteranganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    DptboosterCount: dptboostercount1,
                    DptboosterCountNo: dptboostercountno1
                  });
                }
                var childdptboosterfilteredarray = Object.values(dptboosterdates);
  
                var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                  childdptboosterratioel => Object.values(childdptboosterratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dptboosterdates: childdptboosterdatatotables
                });
              }
              this.callDataTableDptbooster();
            


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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "This Month") {
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;

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
                var cdob = "";
                var gendercountMale1 = 0;
                var gendercountFemale1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // from here *********************************
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
                  if (subdata[index].DPickdob) {
                    cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    // to here *********************************
                    if (
                      subdata[index].option === "Male" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      gendercountMale++;
                      gendercountMale1++;
                    } else if (
                      subdata[index].option === "Female" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      gendercountFemale++;
                      gendercountFemale1++;
                    }
                  }
                }
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

              var childsexratiodatatotables = childsexratiofilteredarray.map(
                childsexratioel => Object.values(childsexratioel)
              );

              this.setState({
                childsexratiodata: childsexratiodatatotables
              });
            }

            this.callDataTableChildSexRatio();

            //child mortality

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var cdob = "";
                var diedcount1 = 0;
                var borncount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;

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

                  if (subdata[index].DPickdob) {
                    cdob = subdata[index].DPickdob;

                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].status === "Born" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      borncount++;
                      borncount1++;
                    } else if (
                      subdata[index].status === "Died" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      diedcount++;
                      diedcount1++;
                    }
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  bornCount: borncount1,
                  diedCount: diedcount1
                });
              }
              var childmortalityfilteredarray = Object.values(childmortality);

              var childmortalityratiodatatotables = childmortalityfilteredarray.map(
                childmortalityratioel => Object.values(childmortalityratioel)
              );

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
                var cdob = "";
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);

                  if (
                    subdata[index].ideli === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (
                    subdata[index].ideli === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].stunt === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (
                    subdata[index].stunt === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: stuntcountyes1,
                  StuntNo: stuntcountno1
                });
              }
              var stunt1filteredarray = Object.values(stunt1);

              var stunt1datatotables = stunt1filteredarray.map(stunt1el =>
                Object.values(stunt1el)
              );

              this.setState({
                stunt1: stunt1datatotables
              });
            }
            this.callDataTablestunt();

            //Prevalence of wasting
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].wast === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (
                    subdata[index].wast === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();

            //Prevalence of underweight

            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].under === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (
                    subdata[index].under === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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

                  if (subdata[index].DPickdob) {
                    cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].health === "healthy" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      healthy++;
                      healthy1++;
                    } else if (
                      subdata[index].health === "unhealthy" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      unhealthy++;
                      unhealthy1++;
                    }
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var cdob = "";
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
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

                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].lowbirth === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].poliodate !== undefined) {
                    var str = subdata[index].poliodate;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].poliodate &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      // var polio=subdata[index].poliodate;
                      // console.log('poliosdad',polio);
                      poliocount++;
                      poliocount1++;
                    } else if (
                      subdata[index].poliodate &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      poliocountno++;
                      poliocountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = poliocount1 + poliocountno1;
                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            //Bcg
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].BCG !== undefined) {
                    var str = subdata[index].BCG;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].BCG !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      var polio = subdata[index].BCG;
                      console.log("poliosdad", polio);
                      bcgcount++;
                      bcgcount1++;
                    } else if (
                      subdata[index].BCG == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      bcgcountno++;
                      bcgcountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            //Hepatitis dates

            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].hepa !== undefined) {
                    var str = subdata[index].hepa;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepacount++;
                      hepacount1++;
                    } else if (
                      subdata[index].hepa == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepacountno++;
                      hepacountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            //dpt1

            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].DPT1 !== undefined) {
                    var str = subdata[index].DPT1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt1count++;
                      dpt1count1++;
                    } else if (
                      subdata[index].DPT1 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt1countno++;
                      dpt1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].DPT2 !== undefined) {
                    var str = subdata[index].DPT2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT2 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt2count++;
                      dpt2count1++;
                    } else if (
                      subdata[index].DPT2 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt2countno++;
                      dpt2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            //dpt3

            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].DPT3 !== undefined) {
                    var str = subdata[index].DPT3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT3 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt3count++;
                      dpt3count1++;
                    } else if (
                      subdata[index].DPT3 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt3countno++;
                      dpt3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1
            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].OPV1 !== undefined) {
                    var str = subdata[index].OPV1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv1count++;
                      opv1count1++;
                    } else if (
                      subdata[index].DPT3 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv1countno++;
                      opv1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

           // opv2
            let opv2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv2count1 = 0;
                var opv2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].OPV2 !== undefined) {
                    var str = subdata[index].OPV2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV2 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv2count++;
                      opv2count1++;
                    } else if (
                      subdata[index].OPV2 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv2countno++;
                      opv2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv2count1 + opv2countno1;
                opv2dates.push({
                  childopv2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv2Count: opv2count1,
                  Opv2CountNo: opv2countno1
                });
              }
              var childopv2filteredarray = Object.values(opv2dates);

              var childopv2datatotables = childopv2filteredarray.map(
                childopv2ratioel => Object.values(childopv2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv2dates: childopv2datatotables
              });
            }
            this.callDataTableOPV2();

            //opv2
            let opv3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv3count1 = 0;
                var opv3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].OPV3 !== undefined) {
                    var str = subdata[index].OPV3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV3 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv3count++;
                      opv3count1++;
                    } else if (
                      subdata[index].OPV3 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv3countno++;
                      opv3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv3count1 + opv3countno1;
                opv3dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv3Count: opv3count1,
                  Opv3CountNo: opv3countno1
                });
              }
              var childopv3filteredarray = Object.values(opv3dates);

              var childopv3datatotables = childopv3filteredarray.map(
                childopv3ratioel => Object.values(childopv3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv3dates: childopv3datatotables
              });
            }
            this.callDataTableOPV3();

            //Hepatitis1 dates

            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].hepa1 !== undefined) {
                    var str = subdata[index].hepa1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepa1count++;
                      hepa1count1++;
                    } else if (
                      subdata[index].hepa1 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepa1countno++;
                      hepa1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

            //dadara1
            let dadara1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dadara1count1 = 0;
                var dadara1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].dadara1 !== undefined) {
                    var str = subdata[index].dadara1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].dadara1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dadara1count++;
                      dadara1count1++;
                    } else if (
                      subdata[index].dadara1 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dadara1countno++;
                      dadara1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dadara1count1 +dadara1countno1;
                dadara1dates.push({
                  childdadara1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dadara1Count:dadara1count1,
                  Dadara1CountNo: dadara1countno1
                });
              }
              var childdadara1filteredarray = Object.values(dadara1dates);

              var childdadara1datatotables = childdadara1filteredarray.map(
                childdadara1ratioel => Object.values(childdadara1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dadara1dates: childdadara1datatotables
              });
            }
            this.callDataTableDadara1();

             //dadara2
             let dadara2dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal
               ) {
                 var totalchild;
                 var dadara2count1 = 0;
                 var dadara2countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
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
                   if (subdata[index].dadara2 !== undefined) {
                     var str = subdata[index].dadara2;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].dadara2 !== undefined &&
                       dobmonth == mm &&
                       dobyear == yyyy
                     ) {
                       dadara2count++;
                       dadara2count1++;
                     } else if (
                       subdata[index].dadara2 == undefined &&
                       dobmonth == mm &&
                       dobyear == yyyy
                     ) {
                       dadara2countno++;
                       dadara2countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = dadara2count1 +dadara2countno1;
                 dadara2dates.push({
                   childdadara2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Dadara2Count:dadara2count1,
                   Dadara2CountNo: dadara2countno1
                 });
               }
               var childdadara2filteredarray = Object.values(dadara2dates);
 
               var childdadara2datatotables = childdadara2filteredarray.map(
                 childdadara2ratioel => Object.values(childdadara2ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                dadara2dates: childdadara2datatotables
               });
             }
             this.callDataTableDadara2();

               //dptbooster
               let dptboosterdates = [];
               for (i = 0; i < data.length; i++) {
                 if (
                   //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                   data[i].Maternal
                 ) {
                   var totalchild;
                   var dptboostercount1 = 0;
                   var dptboostercountno1 = 0;
                   const subdata = data[i].Maternal.ChildRegistration;
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
                     if (subdata[index].dptbooster !== undefined) {
                       var str = subdata[index].dptbooster;
                       console.log("ssss", str);
                       var dobyear = str.substring(0, 4);
                       var dobmonth = str.substring(5, 7);
                       if (
                         subdata[index].dptbooster !== undefined &&
                         dobmonth == mm &&
                         dobyear == yyyy
                       ) {
                        dptboostercount++;
                        dptboostercount1++;
                       } else if (
                         subdata[index].dptbooster == undefined &&
                         dobmonth == mm &&
                         dobyear == yyyy
                       ) {
                        dptboostercountno++;
                        dptboostercountno1++;
                         //undercountyes1++;
                       }
                     }
                   }
                   totalchild = dptboostercount1 +dptboostercountno1;
                   dptboosterdates.push({
                     childdptboosteranganwadicode: data[i].anganwadicode,
                     TotalChild: totalchild,
                     DptboosterCount:dptboostercount1,
                     DptboosterCountNo: dptboostercountno1
                   });
                 }
                 var childdptboosterfilteredarray = Object.values(dptboosterdates);
   
                 var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                   childdptboosterratioel => Object.values(childdptboosterratioel)
                 );
                 // console.log(stockdatatotables);
                 this.setState({
                  dptboosterdates: childdptboosterdatatotables
                 });
               }
               this.callDataTableDptbooster();



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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Last 3 Month") {
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;


        // from here ******************************************
        var today = new Date();
        var dt1 = 0;
        var dt2 = 0;
        var dt3 = 0;
        var c = 0;
        var y = today.getFullYear();
        var mm = today.getMonth() + 1;
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
        // to  here *******************************************

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
                var cdob = "";
                var gendercountMale1 = 0;
                var gendercountFemale1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // from here ****************************
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    // to here ******************************

                    if (
                      subdata[index].option === "Male" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      gendercountMale++;
                      gendercountMale1++;
                    } else if (
                      subdata[index].option === "Female" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      gendercountFemale++;
                      gendercountFemale1++;
                    }
                  }
                }
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var borncount1 = 0;
                var diedcount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].status === "Born" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      borncount++;
                      borncount1++;
                    } else if (
                      subdata[index].status === "Died" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      diedcount++;
                      diedcount1++;
                    }
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                var cdob = "";
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);

                  if (
                    subdata[index].ideli === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (
                    subdata[index].ideli === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].stunt === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (
                    subdata[index].stunt === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            // //Prevalence of wasting
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].wast === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (
                    subdata[index].wast === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();

            //Prevalence of underweight
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].under === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (
                    subdata[index].under === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].health === "healthy" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      healthy++;
                      healthy1++;
                    } else if (
                      subdata[index].health === "unhealthy" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      unhealthy++;
                      unhealthy1++;
                    }
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            //lowbirth
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  //var str = subdata[index].DPickdob;
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].lowbirth === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].poliodate !== undefined) {
                    var str = subdata[index].poliodate;
                    var dobyear = str.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);
                    if (
                      subdata[index].poliodate &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      // var polio=subdata[index].poliodate;
                      // console.log('poliosdad',polio);
                      poliocount++;
                      poliocount1++;
                    } else if (
                      subdata[index].poliodate &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      poliocountno++;
                      poliocountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = poliocount1 + poliocountno1;

                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            // //BCG
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].BCG !== undefined) {
                    var str = subdata[index].BCG;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].BCG !== undefined &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      var polio = subdata[index].BCG;
                      console.log("poliosdad", polio);
                      bcgcount++;
                      bcgcount1++;
                    } else if (
                      subdata[index].BCG == undefined &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      bcgcountno++;
                      bcgcountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            // //hepatis dates
            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa !== undefined) {
                    var str = subdata[index].hepa;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepacount++;
                      hepacount1++;
                    } else if (
                      subdata[index].hepa &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepacountno++;
                      hepacountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            // //dpt1

            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT1 !== undefined) {
                    var str = subdata[index].DPT1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt1count++;
                      dpt1count1++;
                    } else if (
                      subdata[index].DPT1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt1countno++;
                      dpt1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            // //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT2 !== undefined) {
                    var str = subdata[index].DPT2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt2count++;
                      dpt2count1++;
                    } else if (
                      subdata[index].DPT2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt2countno++;
                      dpt2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            // //dpt3

            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT3 !== undefined) {
                    var str = subdata[index].DPT3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT3 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt3count++;
                      dpt3count1++;
                    } else if (
                      subdata[index].DPT3 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt3countno++;
                      dpt3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1
            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV1 !== undefined) {
                    var str = subdata[index].OPV1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      opv1count++;
                      opv1count1++;
                    } else if (
                      subdata[index].OPV1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                    opv1countno++;
                      opv1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

            //OPV2
            let opv2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv2count1 = 0;
                var opv2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV2 !== undefined) {
                    var str = subdata[index].OPV2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      opv2count++;
                      opv2count1++;
                    } else if (
                      subdata[index].OPV2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                    opv2countno++;
                      opv2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv2count1 + opv2countno1;
                opv2dates.push({
                  childopv2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv2Count: opv2count1,
                  Opv2CountNo: opv2countno1
                });
              }
              var childopv2filteredarray = Object.values(opv2dates);

              var childopv2datatotables = childopv2filteredarray.map(
                childopv2ratioel => Object.values(childopv2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv2dates: childopv2datatotables
              });
            }
            this.callDataTableOPV2();

            //opv3
             let opv3dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal
               ) {
                 var totalchild;
                 var opv3count1 = 0;
                 var opv3countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV3 !== undefined) {
                     var str = subdata[index].OPV3;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].OPV3 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                       opv3count++;
                       opv3count1++;
                     } else if (
                       subdata[index].OPV3 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                     opv3countno++;
                       opv3countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = opv3count1 + opv3countno1;
                 opv3dates.push({
                   childopv2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv3Count: opv3count1,
                   Opv3CountNo: opv3countno1
                 });
               }
               var childopv3filteredarray = Object.values(opv3dates);
 
               var childopv3datatotables = childopv3filteredarray.map(
                 childopv3ratioel => Object.values(childopv3ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv3dates: childopv3datatotables
               });
             }
             this.callDataTableOPV3();

           //hepatis dates1
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa1 !== undefined) {
                    var str = subdata[index].hepa1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepa1count++;
                      hepa1count1++;
                    } else if (
                      subdata[index].hepa1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepa1countno++;
                      hepa1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

             //dadara1 dates1
             let dadara1dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal
               ) {
                 var totalchild;
                 var dadara1count1 = 0;
                 var dadara1countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].dadara1 !== undefined) {
                     var str = subdata[index].dadara1;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].dadara1 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                      dadara1count++;
                      dadara1count1++;
                     } else if (
                       subdata[index].dadara1 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                      dadara1countno++;
                      dadara1countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = dadara1count1 +dadara1countno1;
                 dadara1dates.push({
                   childdadara1anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Dadara1Count: dadara1count1,
                   Dadara1CountNo: dadara1countno1
                 });
               }
               var childdadara1filteredarray = Object.values(dadara1dates);
 
               var childdadara1datatotables = childdadara1filteredarray.map(
                 childdadara1ratioel => Object.values(childdadara1ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                dadara1dates: childdadara1datatotables
               });
             }
             this.callDataTableDadara1();

              //dadara2 dates1
              let dadara2dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal
                ) {
                  var totalchild;
                  var dadara2count1 = 0;
                  var dadara2countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].dadara2 !== undefined) {
                      var str = subdata[index].dadara2;
                      console.log("ssss", str);
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      if (
                        subdata[index].dadara2 &&
                        (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                        dobyear == y
                      ) {
                       dadara2count++;
                       dadara2count1++;
                      } else if (
                        subdata[index].dadara2 &&
                        (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                        dobyear == y
                      ) {
                       dadara2countno++;
                       dadara2countno1++;
                        //undercountyes1++;
                      }
                    }
                  }
                  totalchild = dadara2count1 +dadara2countno1;
                  dadara2dates.push({
                    childdadara2anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara2Count: dadara2count1,
                    Dadara2CountNo: dadara2countno1
                  });
                }
                var childdadara2filteredarray = Object.values(dadara2dates);
  
                var childdadara2datatotables = childdadara2filteredarray.map(
                  childdadara2ratioel => Object.values(childdadara2ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara2dates: childdadara2datatotables
                });
              }
              this.callDataTableDadara2();

                 //dptbooster dates1
                 let dptboosterdates = [];
                 for (i = 0; i < data.length; i++) {
                   if (
                     //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                     data[i].Maternal
                   ) {
                     var totalchild;
                     var dptboostercount1 = 0;
                     var dptboostercountno1 = 0;
                     const subdata = data[i].Maternal.ChildRegistration;
                     for (let index in subdata) {
                       if (subdata[index].dptbooster !== undefined) {
                         var str = subdata[index].dptbooster;
                         console.log("ssss", str);
                         var dobyear = str.substring(0, 4);
                         var dobmonth = str.substring(5, 7);
                         if (
                           subdata[index].dptbooster &&
                           (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                           dobyear == y
                         ) {
                          dptboostercount++;
                          dptboostercount1++;
                         } else if (
                           subdata[index].dptbooster &&
                           (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                           dobyear == y
                         ) {
                          dptboostercountno++;
                          dptboostercountno1++;
                           //undercountyes1++;
                         }
                       }
                     }
                     totalchild = dptboostercount1 +dptboostercountno1;
                     dptboosterdates.push({
                       childdadara2anganwadicode: data[i].anganwadicode,
                       TotalChild: totalchild,
                       DptboosterCount: dptboostercount1,
                       DptboosterCountNo: dptboostercountno1
                     });
                   }
                   var childdptboosterfilteredarray = Object.values(dptboosterdates);
     
                   var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                     childdptboosterratioel => Object.values(childdptboosterratioel)
                   );
                   // console.log(stockdatatotables);
                   this.setState({
                    dptboosterdates: childdptboosterdatatotables
                   });
                 }
                 this.callDataTableDptbooster();
 

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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;
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
                  if (subdata[index].DPickdob) {
                    var str = subdata[index].DPickdob;

                    var dobyear = str.substring(0, 4);

                    console.log(dobyear, selectedOption.value);
                    if (
                      subdata[index].option === "Male" &&
                      dobyear == selectedOption.value
                    ) {
                      gendercountMale++;
                      gendercountMale1++;
                    } else if (
                      subdata[index].option === "Female" &&
                      dobyear == selectedOption.value
                    ) {
                      gendercountFemale++;
                      gendercountFemale1++;
                    }
                  }
                }
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var borncount1 = 0;
                var diedcount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var str = subdata[index].DPickdob;

                    var dobyear = str.substring(0, 4);
                    console.log(dobyear, selectedOption.value);
                    if (
                      subdata[index].status === "Born" &&
                      dobyear == selectedOption.value
                    ) {
                      borncount++;
                      borncount1++;
                    } else if (
                      subdata[index].status === "Died" &&
                      dobyear == selectedOption.value
                    ) {
                      diedcount++;
                      diedcount1++;
                    }
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                var cdob = "";
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);

                  if (
                    subdata[index].ideli === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (
                    subdata[index].ideli === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            //Stunting in children
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].stunt === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (
                    subdata[index].stunt === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            // //Prevalence of wasting
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].wast === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (
                    subdata[index].wast === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();

            //Prevalence of underweight
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].under === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (
                    subdata[index].under === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].health === "healthy" &&
                      dobyear == selectedOption.value
                    ) {
                      healthy++;
                      healthy1++;
                    } else if (
                      subdata[index].health === "unhealthy" &&
                      dobyear == selectedOption.value
                    ) {
                      unhealthy++;
                      unhealthy1++;
                    }
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            //lowbirth
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  //var str = subdata[index].DPickdob;
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].lowbirth === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }

                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].poliodate !== undefined) {
                    var str = subdata[index].poliodate;
                    var dobyear = str.substring(0, 4);
                    if (
                      subdata[index].poliodate &&
                      dobyear == selectedOption.value
                    ) {
                      // var polio=subdata[index].poliodate;
                      // console.log('poliosdad',polio);
                      poliocount++;
                      poliocount1++;
                    } else if (
                      subdata[index].poliodate &&
                      dobyear == selectedOption.value
                    ) {
                      poliocountno++;
                      poliocountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = poliocount1 + poliocountno1;

                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            // //BCG
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].BCG !== undefined) {
                    var str = subdata[index].BCG;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].BCG !== undefined &&
                      dobyear == selectedOption.value
                    ) {
                      var polio = subdata[index].BCG;
                      console.log("poliosdad", polio);
                      bcgcount++;
                      bcgcount1++;
                    } else if (
                      subdata[index].BCG == undefined &&
                      dobyear == selectedOption.value
                    ) {
                      bcgcountno++;
                      bcgcountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            // //hepatis dates
            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa !== undefined) {
                    var str = subdata[index].hepa;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa &&
                      dobyear == selectedOption.value
                    ) {
                      hepacount++;
                      hepacount1++;
                    } else if (
                      subdata[index].hepa &&
                      dobyear == selectedOption.value
                    ) {
                      hepacountno++;
                      hepacountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            // //dpt1

            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT1 !== undefined) {
                    var str = subdata[index].DPT1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT1 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt1count++;
                      dpt1count1++;
                    } else if (
                      subdata[index].DPT1 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt1countno++;
                      dpt1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            // //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT2 !== undefined) {
                    var str = subdata[index].DPT2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT2 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt2count++;
                      dpt2count1++;
                    } else if (
                      subdata[index].DPT2 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt2countno++;
                      dpt2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            // //dpt3

            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT3 !== undefined) {
                    var str = subdata[index].DPT3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT3 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt3count++;
                      dpt3count1++;
                    } else if (
                      subdata[index].DPT3 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt3countno++;
                      dpt3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1
            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV1 !== undefined) {
                    var str = subdata[index].OPV1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV1 &&
                      dobyear == selectedOption.value
                    ) {
                      opv1count++;
                      opv1count1++;
                    } else if (
                      subdata[index].OPV1 &&
                      dobyear == selectedOption.value
                    ) {
                      opv1countno++;
                      opv1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

             //opv2
             let opv2dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal
               ) {
                 var totalchild;
                 var opv2count1 = 0;
                 var opv2countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV2 !== undefined) {
                     var str = subdata[index].OPV2;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].OPV2 &&
                       dobyear == selectedOption.value
                     ) {
                       opv2count++;
                       opv2count1++;
                     } else if (
                       subdata[index].OPV2 &&
                       dobyear == selectedOption.value
                     ) {
                       opv2countno++;
                       opv2countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = opv2count1 + opv2countno1;
                 opv2dates.push({
                   childopv2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv2Count: opv2count1,
                   Opv2CountNo: opv2countno1
                 });
               }
               var childopv2filteredarray = Object.values(opv2dates);
 
               var childopv2datatotables = childopv2filteredarray.map(
                 childopv2ratioel => Object.values(childopv2ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv2dates: childopv2datatotables
               });
             }
             this.callDataTableOPV2();

             //opv3
             let opv3dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal
               ) {
                 var totalchild;
                 var opv3count1 = 0;
                 var opv3countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV3 !== undefined) {
                     var str = subdata[index].OPV3;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].OPV3 &&
                       dobyear == selectedOption.value
                     ) {
                       opv3count++;
                       opv3count1++;
                     } else if (
                       subdata[index].OPV3 &&
                       dobyear == selectedOption.value
                     ) {
                       opv3countno++;
                       opv3countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = opv3count1 + opv3countno1;
                 opv3dates.push({
                   childopv2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv3Count: opv3count1,
                   Opv3CountNo: opv3countno1
                 });
               }
               var childopv3filteredarray = Object.values(opv3dates);
 
               var childopv3datatotables = childopv3filteredarray.map(
                 childopv3ratioel => Object.values(childopv3ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv3dates: childopv3datatotables
               });
             }
             this.callDataTableOPV3();

              // //hepatis1 dates
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa1 !== undefined) {
                    var str = subdata[index].hepa1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa1 &&
                      dobyear == selectedOption.value
                    ) {
                      hepa1count++;
                      hepa1count1++;
                    } else if (
                      subdata[index].hepa1 &&
                      dobyear == selectedOption.value
                    ) {
                      hepa1countno++;
                      hepa1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

              // dadara1 dates
              let dadara1dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal
                ) {
                  var totalchild;
                  var dadara1count1 = 0;
                  var dadara1countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].dadara1 !== undefined) {
                      var str = subdata[index].dadara1;
                      console.log("ssss", str);
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      if (
                        subdata[index].dadara1 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara1count++;
                        dadara1count1++;
                      } else if (
                        subdata[index].dadara1 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara1countno++;
                        dadara1countno1++;
                        //undercountyes1++;
                      }
                    }
                  }
                  totalchild = dadara1count1 + dadara1countno1;
                  dadara1dates.push({
                    childhepa1anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara1Count: dadara1count1,
                    Dadara1CountNo: dadara1countno1
                  });
                }
                var childdadara1filteredarray = Object.values(dadara1dates);
  
                var childdadara1datatotables = childdadara1filteredarray.map(
                  childdadara1ratioel => Object.values(childdadara1ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara1dates: childdadara1datatotables
                });
              }
              this.callDataTableDadara1();

              // dadara2 dates
              let dadara2dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal
                ) {
                  var totalchild;
                  var dadara2count1 = 0;
                  var dadara2countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].dadara2 !== undefined) {
                      var str = subdata[index].dadara2;
                      console.log("ssss", str);
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      if (
                        subdata[index].dadara2 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara2count++;
                        dadara2count1++;
                      } else if (
                        subdata[index].dadara2 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara2countno++;
                        dadara2countno1++;
                        //undercountyes1++;
                      }
                    }
                  }
                  totalchild = dadara2count1 + dadara2countno1;
                  dadara2dates.push({
                    childdadara2anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara2Count: dadara2count1,
                    Dadara2CountNo: dadara2countno1
                  });
                }
                var childdadara2filteredarray = Object.values(dadara2dates);
  
                var childdadara2datatotables = childdadara2filteredarray.map(
                  childdadara2ratioel => Object.values(childdadara2ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara2dates: childdadara2datatotables
                });
              }
              this.callDataTableDadara2();

               // dptbooster dates
               let dptboosterdates = [];
               for (i = 0; i < data.length; i++) {
                 if (
                   //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                   data[i].Maternal
                 ) {
                   var totalchild;
                   var dptboostercount1 = 0;
                   var dptboostercountno1 = 0;
                   const subdata = data[i].Maternal.ChildRegistration;
                   for (let index in subdata) {
                     if (subdata[index].dptbooster !== undefined) {
                       var str = subdata[index].dptbooster;
                       console.log("ssss", str);
                       var dobyear = str.substring(0, 4);
                       var dobmonth = str.substring(5, 7);
                       if (
                         subdata[index].dptbooster &&
                         dobyear == selectedOption.value
                       ) {
                        dptboostercount++;
                        dptboostercount1++;
                       } else if (
                         subdata[index].dptbooster &&
                         dobyear == selectedOption.value
                       ) {
                        dptboostercountno++;
                        dptboostercountno1++;
                         //undercountyes1++;
                       }
                     }
                   }
                   totalchild = dptboostercount1 + dptboostercountno1;
                   dptboosterdates.push({
                     childdptboosteranganwadicode: data[i].anganwadicode,
                     TotalChild: totalchild,
                     DptboosterCount: dptboostercount1,
                     ptboosterCountNo: dptboostercountno1
                   });
                 }
                 var childdptboosterfilteredarray = Object.values(dptboosterdates);
   
                 var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                   childdptboosterratioel => Object.values(childdptboosterratioel)
                 );
                 // console.log(stockdatatotables);
                 this.setState({
                  dptboosterdates: childdptboosterdatatotables
                 });
               }
               this.callDataTableDptbooster();


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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      }
      //&& selectedplace === data[i].anganwadidetails.awcplace
    } else if (!(selectedplace === "All Places")) {
      if (selectedOption.value === "none" || selectedOption.value === "All") {
        //  if( this.state.selecteddatatypeoption.value === "Chart" &&
        //  selectedOption.value === "All Places" && selectedOption.value === "All" &&
        //  this.state.selectedchartoption.value === 1){
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;

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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadidetails.awcplace,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = borncount1 + diedcount1;
                // TotalChild: totalchild,
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = Institutionalcount1 + NonInstitutionalcount1;

                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
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
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  lowbirthweightanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  LowBirthCountYes: lowbirthcountyes1,
                  LowBirthCountNo: lowbirthcountno1
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

            //polio date
            let poliodates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var poliocount1 = 0;
                var poliocountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].poliodate !== undefined) {
                    var polio = subdata[index].poliodate;
                    console.log("poliosdad", polio);
                    poliocount++;
                    poliocount1++;
                  } else if (subdata[index].poliodate == undefined) {
                    poliocountno++;
                    poliocountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = poliocount1 + poliocountno1;
                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            //BCG DATES
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].BCG !== undefined) {
                    var polio = subdata[index].BCG;
                    console.log("poliosdad", polio);
                    bcgcount++;
                    bcgcount1++;
                  } else if (subdata[index].BCG == undefined) {
                    bcgcountno++;
                    bcgcountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            // Hepatitis date
            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa !== undefined) {
                    hepacount++;
                    hepacount1++;
                  } else if (subdata[index].hepa == undefined) {
                    hepacountno++;
                    hepacountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            //DPT1
            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT1 !== undefined) {
                    dpt1count++;
                    dpt1count1++;
                  } else if (subdata[index].DPT1 == undefined) {
                    dpt1countno++;
                    dpt1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            //DPT2
            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT2 !== undefined) {
                    dpt2count++;
                    dpt2count1++;
                  } else if (subdata[index].DPT2 == undefined) {
                    dpt2countno++;
                    dpt2countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            //DPT3
            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT3 !== undefined) {
                    dpt3count++;
                    dpt3count1++;
                  } else if (subdata[index].DPT3 == undefined) {
                    dpt3countno++;
                    dpt3countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1 dates

            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV1 !== undefined) {
                    opv1count++;
                    opv1count1++;
                  } else if (subdata[index].OPV1 == undefined) {
                    opv1countno++;
                    opv1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

             //opv2 dates

             let opv2dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
               ) {
                 var totalchild;
                 var opv2count1 = 0;
                 var opv2countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV2 !== undefined) {
                     opv2count++;
                     opv2count1++;
                   } else if (subdata[index].OPV2 == undefined) {
                     opv2countno++;
                     opv2countno1++;
                     //undercountyes1++;
                   }
                 }
                 totalchild = opv2count1 + opv2countno1;
                 opv2dates.push({
                   childdpt3anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv2Count: opv2count1,
                   Opv2CountNo: opv2countno1
                 });
               }
               var childopv2filteredarray = Object.values(opv2dates);
 
               var childopv2datatotables = childopv2filteredarray.map(
                 childopv2ratioel => Object.values(childopv2ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv2dates: childopv2datatotables
               });
             }
             this.callDataTableOPV2();

              //opv3 dates

              let opv3dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
                ) {
                  var totalchild;
                  var opv3count1 = 0;
                  var opv3countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].OPV3 !== undefined) {
                      opv3count++;
                      opv3count1++;
                    } else if (subdata[index].OPV3 == undefined) {
                      opv3countno++;
                      opv3countno1++;
                      //undercountyes1++;
                    }
                  }
                  totalchild = opv3count1 + opv3countno1;
                  opv3dates.push({
                    childdpt3anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Opv3Count: opv3count1,
                    Opv3CountNo: opv3countno1
                  });
                }
                var childopv3filteredarray = Object.values(opv3dates);
  
                var childopv3datatotables = childopv3filteredarray.map(
                  childopv3ratioel => Object.values(childopv3ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  opv3dates: childopv3datatotables
                });
              }
              this.callDataTableOPV3();

               // Hepatitis1 date
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa1 !== undefined) {
                    hepa1count++;
                    hepa1count1++;
                  } else if (subdata[index].hepa1 == undefined) {
                    hepa1countno++;
                    hepa1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

               // Dadara1
               let dadara1dates = [];
               for (i = 0; i < data.length; i++) {
                 if (
                   //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                   data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
                 ) {
                   var totalchild;
                   var dadara1count1 = 0;
                   var dadara1countno1 = 0;
                   const subdata = data[i].Maternal.ChildRegistration;
                   for (let index in subdata) {
                     if (subdata[index].dadara1 !== undefined) {
                      dadara1count++;
                       dadara1count1++;
                     } else if (subdata[index].dadara1 == undefined) {
                      dadara1countno++;
                       dadara1countno1++;
                       //undercountyes1++;
                     }
                   }
                   totalchild = dadara1count1 + dadara1countno1;
                   dadara1dates.push({
                     childdadara1anganwadicode: data[i].anganwadicode,
                     TotalChild: totalchild,
                     Dadara1Count: dadara1count1,
                     Dadara1CountNo: dadara1countno1
                   });
                 }
                 var childdadara1filteredarray = Object.values(dadara1dates);
   
                 var childdadara1datatotables = childdadara1filteredarray.map(
                   childdadara1ratioel => Object.values(childdadara1ratioel)
                 );
                 // console.log(stockdatatotables);
                 this.setState({
                  dadara1dates: childdadara1datatotables
                 });
               }
               this.callDataTableDadara1();

               
                // Dadara2
                let dadara2dates = [];
                for (i = 0; i < data.length; i++) {
                  if (
                    //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                    data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
                  ) {
                    var totalchild;
                    var dadara2count1 = 0;
                    var dadara2countno1 = 0;
                    const subdata = data[i].Maternal.ChildRegistration;
                    for (let index in subdata) {
                      if (subdata[index].dadara2 !== undefined) {
                       dadara2count++;
                        dadara2count1++;
                      } else if (subdata[index].dadara2 == undefined) {
                       dadara2countno++;
                        dadara2countno1++;
                        //undercountyes1++;
                      }
                    }
                    totalchild = dadara2count1 + dadara2countno1;
                    dadara2dates.push({
                      childdadara2anganwadicode: data[i].anganwadicode,
                      TotalChild: totalchild,
                      Dadara2Count: dadara2count1,
                      Dadara2CountNo: dadara2countno1
                    });
                  }
                  var childdadara2filteredarray = Object.values(dadara2dates);
    
                  var childdadara2datatotables = childdadara2filteredarray.map(
                    childdadara2ratioel => Object.values(childdadara2ratioel)
                  );
                  // console.log(stockdatatotables);
                  this.setState({
                   dadara2dates: childdadara2datatotables
                  });
                }
                this.callDataTableDadara2();

                //dptbooster
                let dptboosterdates = [];
                for (i = 0; i < data.length; i++) {
                  if (
                    //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                    data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
                  ) {
                    var totalchild;
                    var dptboostercount1 = 0;
                    var dptboostercountno1 = 0;
                    const subdata = data[i].Maternal.ChildRegistration;
                    for (let index in subdata) {
                      if (subdata[index].dptbooster !== undefined) {
                        dptboostercount++;
                       dptboostercount1++;
                      } else if (subdata[index].dptbooster == undefined) {
                        dptboostercountno++;
                       dptboostercountno1++;
                        //undercountyes1++;
                      }
                    }
                    totalchild = dptboostercount1 + dptboostercountno1;
                    dptboosterdates.push({
                      childdadara2anganwadicode: data[i].anganwadicode,
                      TotalChild: totalchild,
                      DptboosterCount: dptboostercount1,
                      DptboosterCountNo: dptboostercountno1
                    });
                  }
                  var childdptboosterdatesfilteredarray = Object.values(dptboosterdates);
    
                  var childdptboosterdatesdatatotables = childdptboosterdatesfilteredarray.map(
                    childdptboosterratioel => Object.values(childdptboosterratioel)
                  );
                  // console.log(stockdatatotables);
                  this.setState({
                    dptboosterdates: childdptboosterdatesdatatotables
                  });
                }
                this.callDataTableDptbooster();


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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Today") {
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;

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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var gendercountMale1 = 0;
                var gendercountFemale1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // from here *********************************
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
                  // to here *********************************

                  if (subdata[index].option === "Male" && dobyear == today) {
                    gendercountMale++;
                    gendercountMale1++;
                  } else if (
                    subdata[index].option === "Female" &&
                    dobyear == today
                  ) {
                    gendercountFemale++;
                    gendercountFemale1++;
                  }
                }

                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var borncount1 = 0;
                var diedcount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // var str = subdata[index].DPickdob;

                  // var dobyear = str.substring(0, 4);
                  // console.log(dobyear, selectedOption.value);
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
                  if (subdata[index].status === "Born" && dobyear == today) {
                    borncount++;
                    borncount1++;
                  } else if (
                    subdata[index].status === "Died" &&
                    dobyear == today
                  ) {
                    diedcount++;
                    diedcount1++;
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            // delivery type

            let Ideliveries = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].ideli === "Yes" && cdob == today) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (subdata[index].ideli === "No" && cdob == today) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;

                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].stunt === "Yes" && cdob == today) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (subdata[index].stunt === "No" && cdob == today) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  console.log("today", today);
                  if (subdata[index].wast === "Yes" && cdob == today) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (subdata[index].wast === "No" && cdob == today) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();
            //Prevalence of underweight
            var cdob = "";
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].under === "Yes" && cdob == today) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (subdata[index].under === "No" && cdob == today) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].health === "healthy" && dobyear == today) {
                    healthy++;
                    healthy1++;
                  } else if (
                    subdata[index].health === "unhealthy" &&
                    dobyear == today
                  ) {
                    unhealthy++;
                    unhealthy1++;
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            //Lowbirth
            var cdob = "";
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  if (subdata[index].lowbirth === "Yes" && cdob == today) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    cdob == today
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].poliodate;
                  if (
                    subdata[index].poliodate !== undefined &&
                    dobyear == today
                  ) {
                    var polio = subdata[index].poliodate;
                    console.log("poliosdad", polio);
                    poliocount++;
                    poliocount1++;
                  } else if (
                    subdata[index].poliodate == undefined &&
                    dobyear == today
                  ) {
                    poliocountno++;
                    poliocountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = poliocount1 + poliocountno1;
                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            //Bcg Dates
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].BCG;
                  if (subdata[index].BCG !== undefined && dobyear == today) {
                    var polio = subdata[index].BCG;
                    console.log("poliosdad", polio);
                    bcgcount++;
                    bcgcount1++;
                  } else if (
                    subdata[index].BCG == undefined &&
                    dobyear == today
                  ) {
                    bcgcountno++;
                    bcgcountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            //Hepatitis date

            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].hepa;
                  if (subdata[index].hepa !== undefined && dobyear == today) {
                    hepacount++;
                    hepacount1++;
                  } else if (
                    subdata[index].hepa == undefined &&
                    dobyear == today
                  ) {
                    hepacountno++;
                    hepacountno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            //dpt1
            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].DPT1;
                  if (subdata[index].DPT1 !== undefined && dobyear == today) {
                    dpt1count++;
                    dpt1count1++;
                  } else if (
                    subdata[index].DPT1 == undefined &&
                    dobyear == today
                  ) {
                    dpt1countno++;
                    dpt1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].DPT2;
                  if (subdata[index].DPT2 !== undefined && dobyear == today) {
                    dpt2count++;
                    dpt2count1++;
                  } else if (
                    subdata[index].DPT2 == undefined &&
                    dobyear == today
                  ) {
                    dpt2countno++;
                    dpt2countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            //dpt3
            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].DPT3;
                  if (subdata[index].DPT3 !== undefined && dobyear == today) {
                    dpt3count++;
                    dpt3count1++;
                  } else if (
                    subdata[index].DPT3 == undefined &&
                    dobyear == today
                  ) {
                    dpt3countno++;
                    dpt3countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1

            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].OPV1;
                  if (subdata[index].OPV1 !== undefined && dobyear == today) {
                    opv1count++;
                    opv1count1++;
                  } else if (
                    subdata[index].OPV1 == undefined &&
                    dobyear == today
                  ) {
                    opv1countno++;
                  opv1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

            //Opv2
            let opv2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv2count1 = 0;
                var opv2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].OPV2;
                  if (subdata[index].OPV2 !== undefined && dobyear == today) {
                    opv2count++;
                    opv2count1++;
                  } else if (
                    subdata[index].OPV2 == undefined &&
                    dobyear == today
                  ) {
                    opv2countno++;
                  opv2countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv2count1 + opv2countno1;
                opv2dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv2Count: opv2count1,
                  Opv2CountNo: opv2countno1
                });
              }
              var childopv2filteredarray = Object.values(opv2dates);

              var childopv2datatotables = childopv2filteredarray.map(
                childopv2ratioel => Object.values(childopv2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv2dates: childopv2datatotables
              });
            }
            this.callDataTableOPV2();

//opv3
            let opv3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv3count1 = 0;
                var opv3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].OPV3;
                  if (subdata[index].OPV3 !== undefined && dobyear == today) {
                    opv3count++;
                    opv3count1++;
                  } else if (
                    subdata[index].OPV3 == undefined &&
                    dobyear == today
                  ) {
                    opv3countno++;
                  opv3countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = opv3count1 + opv3countno1;
                opv2dates.push({
                  childopv3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv3Count: opv3count1,
                  Opv3CountNo: opv3countno1
                });
              }
              var childopv3filteredarray = Object.values(opv3dates);

              var childopv3datatotables = childopv3filteredarray.map(
                childopv3ratioel => Object.values(childopv3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv3dates: childopv3datatotables
              });
            }
            this.callDataTableOPV3();

            //Hepatitis1 dates
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].hepa1;
                  if (subdata[index].hepa1 !== undefined && dobyear == today) {
                    hepa1count++;
                    hepa1count1++;
                  } else if (
                    subdata[index].hepa1 == undefined &&
                    dobyear == today
                  ) {
                    hepa1countno++;
                    hepa1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

            //dadara1 dates
            let dadara1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dadara1count1 = 0;
                var  dadara1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  var dobyear = subdata[index].dadara1;
                  if (subdata[index].dadara1 !== undefined && dobyear == today) {
                    dadara1count++;
                    dadara1count1++;
                  } else if (
                    subdata[index].dadara1 == undefined &&
                    dobyear == today
                  ) {
                    dadara1countno++;
                    dadara1countno1++;
                    //undercountyes1++;
                  }
                }
                totalchild = dadara1count1 +dadara1countno1;
                dadara1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dadara1Count: dadara1count1,
                  Dadara1CountNo: dadara1countno1
                });
              }
              var childdadara1filteredarray = Object.values(dadara1dates);

              var childdadara1datatotables = childdadara1filteredarray.map(
                childdadara1ratioel => Object.values(childdadara1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dadara1dates: childdadara1datatotables
              });
            }
            this.callDataTableDadara1();

              //dadara2 dates
              let dadara2dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
                ) {
                  var totalchild;
                  var dadara2count1 = 0;
                  var  dadara2countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
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
                    var dobyear = subdata[index].dadara2;
                    if (subdata[index].dadara2 !== undefined && dobyear == today) {
                      dadara2count++;
                      dadara2count1++;
                    } else if (
                      subdata[index].dadara2 == undefined &&
                      dobyear == today
                    ) {
                      dadara2countno++;
                      dadara2countno1++;
                      //undercountyes1++;
                    }
                  }
                  totalchild = dadara2count1 +dadara2countno1;
                  dadara2dates.push({
                    childhepa2anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara2Count: dadara2count1,
                    Dadara2CountNo: dadara2countno1
                  });
                }
                var childdadara2filteredarray = Object.values(dadara2dates);
  
                var childdadara2datatotables = childdadara2filteredarray.map(
                  childdadara2ratioel => Object.values(childdadara2ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara2dates: childdadara2datatotables
                });
              }
              this.callDataTableDadara2();
            
              //dptbooster dates
              let dptboosterdates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
                ) {
                  var totalchild;
                  var dptboostercount1 = 0;
                  var  dptboostercountno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
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
                    var dobyear = subdata[index].dptbooster;
                    if (subdata[index].dptbooster !== undefined && dobyear == today) {
                      dptboostercount++;
                      dptboostercount1++;
                    } else if (
                      subdata[index].dptbooster == undefined &&
                      dobyear == today
                    ) {
                      dptboostercountno++;
                      dptboostercountno1++;
                      //undercountyes1++;
                    }
                  }
                  totalchild = dptboostercount1 +dptboostercountno1;
                  dptboosterdates.push({
                    childdptboosteranganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    DptboosterCount: dptboostercount1,
                    DptboosterCountNo: dptboostercountno1
                  });
                }
                var childdptboosterfilteredarray = Object.values(dptboosterdates);
  
                var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                  childdptboosterratioel => Object.values(childdptboosterratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dptboosterdates: childdptboosterdatatotables
                });
              }
              this.callDataTableDptbooster();
            


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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "This Month") {
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;

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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var gendercountMale1 = 0;
                var gendercountFemale1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // from here *********************************
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
                  if (subdata[index].DPickdob) {
                    cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    // to here *********************************
                    if (
                      subdata[index].option === "Male" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      gendercountMale++;
                      gendercountMale1++;
                    } else if (
                      subdata[index].option === "Female" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      gendercountFemale++;
                      gendercountFemale1++;
                    }
                  }
                }
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

              var childsexratiodatatotables = childsexratiofilteredarray.map(
                childsexratioel => Object.values(childsexratioel)
              );

              this.setState({
                childsexratiodata: childsexratiodatatotables
              });
            }

            this.callDataTableChildSexRatio();

            //child mortality

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var diedcount1 = 0;
                var borncount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;

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

                  if (subdata[index].DPickdob) {
                    cdob = subdata[index].DPickdob;

                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].status === "Born" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      borncount++;
                      borncount1++;
                    } else if (
                      subdata[index].status === "Died" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      diedcount++;
                      diedcount1++;
                    }
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  bornCount: borncount1,
                  diedCount: diedcount1
                });
              }
              var childmortalityfilteredarray = Object.values(childmortality);

              var childmortalityratiodatatotables = childmortalityfilteredarray.map(
                childmortalityratioel => Object.values(childmortalityratioel)
              );

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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);

                  if (
                    subdata[index].ideli === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (
                    subdata[index].ideli === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].stunt === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (
                    subdata[index].stunt === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: stuntcountyes1,
                  StuntNo: stuntcountno1
                });
              }
              var stunt1filteredarray = Object.values(stunt1);

              var stunt1datatotables = stunt1filteredarray.map(stunt1el =>
                Object.values(stunt1el)
              );

              this.setState({
                stunt1: stunt1datatotables
              });
            }
            this.callDataTablestunt();

            //Prevalence of wasting
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].wast === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (
                    subdata[index].wast === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();

            //Prevalence of underweight

            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                const subdata = data[i].Maternal.Nutrition;
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
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].under === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (
                    subdata[index].under === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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

                  if (subdata[index].DPickdob) {
                    cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].health === "healthy" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      healthy++;
                      healthy1++;
                    } else if (
                      subdata[index].health === "unhealthy" &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      unhealthy++;
                      unhealthy1++;
                    }
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
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

                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].lowbirth === "Yes" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    dobmonth == mm &&
                    dobyear == yyyy
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].poliodate !== undefined) {
                    var str = subdata[index].poliodate;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].poliodate &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      // var polio=subdata[index].poliodate;
                      // console.log('poliosdad',polio);
                      poliocount++;
                      poliocount1++;
                    } else if (
                      subdata[index].poliodate &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      poliocountno++;
                      poliocountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = poliocount1 + poliocountno1;
                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            //Bcg
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].BCG !== undefined) {
                    var str = subdata[index].BCG;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].BCG !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      var polio = subdata[index].BCG;
                      console.log("poliosdad", polio);
                      bcgcount++;
                      bcgcount1++;
                    } else if (
                      subdata[index].BCG == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      bcgcountno++;
                      bcgcountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            //Hepatitis dates

            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].hepa !== undefined) {
                    var str = subdata[index].hepa;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepacount++;
                      hepacount1++;
                    } else if (
                      subdata[index].hepa == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepacountno++;
                      hepacountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            //dpt1

            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].DPT1 !== undefined) {
                    var str = subdata[index].DPT1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt1count++;
                      dpt1count1++;
                    } else if (
                      subdata[index].DPT1 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt1countno++;
                      dpt1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].DPT2 !== undefined) {
                    var str = subdata[index].DPT2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT2 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt2count++;
                      dpt2count1++;
                    } else if (
                      subdata[index].DPT2 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt2countno++;
                      dpt2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            //dpt3

            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].DPT3 !== undefined) {
                    var str = subdata[index].DPT3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT3 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt3count++;
                      dpt3count1++;
                    } else if (
                      subdata[index].DPT3 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dpt3countno++;
                      dpt3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1
            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].OPV1 !== undefined) {
                    var str = subdata[index].OPV1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv1count++;
                      opv1count1++;
                    } else if (
                      subdata[index].DPT3 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv1countno++;
                      opv1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

           // opv2
            let opv2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv2count1 = 0;
                var opv2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].OPV2 !== undefined) {
                    var str = subdata[index].OPV2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV2 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv2count++;
                      opv2count1++;
                    } else if (
                      subdata[index].OPV2 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv2countno++;
                      opv2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv2count1 + opv2countno1;
                opv2dates.push({
                  childopv2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv2Count: opv2count1,
                  Opv2CountNo: opv2countno1
                });
              }
              var childopv2filteredarray = Object.values(opv2dates);

              var childopv2datatotables = childopv2filteredarray.map(
                childopv2ratioel => Object.values(childopv2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv2dates: childopv2datatotables
              });
            }
            this.callDataTableOPV2();

            //opv2
            let opv3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv3count1 = 0;
                var opv3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].OPV3 !== undefined) {
                    var str = subdata[index].OPV3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV3 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv3count++;
                      opv3count1++;
                    } else if (
                      subdata[index].OPV3 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      opv3countno++;
                      opv3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv3count1 + opv3countno1;
                opv3dates.push({
                  childopv1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv3Count: opv3count1,
                  Opv3CountNo: opv3countno1
                });
              }
              var childopv3filteredarray = Object.values(opv3dates);

              var childopv3datatotables = childopv3filteredarray.map(
                childopv3ratioel => Object.values(childopv3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv3dates: childopv3datatotables
              });
            }
            this.callDataTableOPV3();

            //Hepatitis1 dates

            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].hepa1 !== undefined) {
                    var str = subdata[index].hepa1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepa1count++;
                      hepa1count1++;
                    } else if (
                      subdata[index].hepa1 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      hepa1countno++;
                      hepa1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

            //dadara1
            let dadara1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dadara1count1 = 0;
                var dadara1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
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
                  if (subdata[index].dadara1 !== undefined) {
                    var str = subdata[index].dadara1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].dadara1 !== undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dadara1count++;
                      dadara1count1++;
                    } else if (
                      subdata[index].dadara1 == undefined &&
                      dobmonth == mm &&
                      dobyear == yyyy
                    ) {
                      dadara1countno++;
                      dadara1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dadara1count1 +dadara1countno1;
                dadara1dates.push({
                  childdadara1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dadara1Count:dadara1count1,
                  Dadara1CountNo: dadara1countno1
                });
              }
              var childdadara1filteredarray = Object.values(dadara1dates);

              var childdadara1datatotables = childdadara1filteredarray.map(
                childdadara1ratioel => Object.values(childdadara1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dadara1dates: childdadara1datatotables
              });
            }
            this.callDataTableDadara1();

             //dadara2
             let dadara2dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
               ) {
                 var totalchild;
                 var dadara2count1 = 0;
                 var dadara2countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
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
                   if (subdata[index].dadara2 !== undefined) {
                     var str = subdata[index].dadara2;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].dadara2 !== undefined &&
                       dobmonth == mm &&
                       dobyear == yyyy
                     ) {
                       dadara2count++;
                       dadara2count1++;
                     } else if (
                       subdata[index].dadara2 == undefined &&
                       dobmonth == mm &&
                       dobyear == yyyy
                     ) {
                       dadara2countno++;
                       dadara2countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = dadara2count1 +dadara2countno1;
                 dadara2dates.push({
                   childdadara2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Dadara2Count:dadara2count1,
                   Dadara2CountNo: dadara2countno1
                 });
               }
               var childdadara2filteredarray = Object.values(dadara2dates);
 
               var childdadara2datatotables = childdadara2filteredarray.map(
                 childdadara2ratioel => Object.values(childdadara2ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                dadara2dates: childdadara2datatotables
               });
             }
             this.callDataTableDadara2();

               //dptbooster
               let dptboosterdates = [];
               for (i = 0; i < data.length; i++) {
                 if (
                   //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                   data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
                 ) {
                   var totalchild;
                   var dptboostercount1 = 0;
                   var dptboostercountno1 = 0;
                   const subdata = data[i].Maternal.ChildRegistration;
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
                     if (subdata[index].dptbooster !== undefined) {
                       var str = subdata[index].dptbooster;
                       console.log("ssss", str);
                       var dobyear = str.substring(0, 4);
                       var dobmonth = str.substring(5, 7);
                       if (
                         subdata[index].dptbooster !== undefined &&
                         dobmonth == mm &&
                         dobyear == yyyy
                       ) {
                        dptboostercount++;
                        dptboostercount1++;
                       } else if (
                         subdata[index].dptbooster == undefined &&
                         dobmonth == mm &&
                         dobyear == yyyy
                       ) {
                        dptboostercountno++;
                        dptboostercountno1++;
                         //undercountyes1++;
                       }
                     }
                   }
                   totalchild = dptboostercount1 +dptboostercountno1;
                   dptboosterdates.push({
                     childdptboosteranganwadicode: data[i].anganwadicode,
                     TotalChild: totalchild,
                     DptboosterCount:dptboostercount1,
                     DptboosterCountNo: dptboostercountno1
                   });
                 }
                 var childdptboosterfilteredarray = Object.values(dptboosterdates);
   
                 var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                   childdptboosterratioel => Object.values(childdptboosterratioel)
                 );
                 // console.log(stockdatatotables);
                 this.setState({
                  dptboosterdates: childdptboosterdatatotables
                 });
               }
               this.callDataTableDptbooster();



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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      } else if (selectedOption.value === "Last 3 Month") {
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;


        // from here ******************************************
        var today = new Date();
        var dt1 = 0;
        var dt2 = 0;
        var dt3 = 0;
        var c = 0;
        var y = today.getFullYear();
        var mm = today.getMonth() + 1;
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
        // to  here *******************************************

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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var gendercountMale1 = 0;
                var gendercountFemale1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  // from here ****************************
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    // to here ******************************

                    if (
                      subdata[index].option === "Male" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      gendercountMale++;
                      gendercountMale1++;
                    } else if (
                      subdata[index].option === "Female" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      gendercountFemale++;
                      gendercountFemale1++;
                    }
                  }
                }
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var borncount1 = 0;
                var diedcount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].status === "Born" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      borncount++;
                      borncount1++;
                    } else if (
                      subdata[index].status === "Died" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      diedcount++;
                      diedcount1++;
                    }
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);

                  if (
                    subdata[index].ideli === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (
                    subdata[index].ideli === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].stunt === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (
                    subdata[index].stunt === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            // //Prevalence of wasting
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].wast === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (
                    subdata[index].wast === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();

            //Prevalence of underweight
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].under === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (
                    subdata[index].under === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].health === "healthy" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      healthy++;
                      healthy1++;
                    } else if (
                      subdata[index].health === "unhealthy" &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      unhealthy++;
                      unhealthy1++;
                    }
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            //lowbirth
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  //var str = subdata[index].DPickdob;
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].lowbirth === "Yes" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == y
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }
                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].poliodate !== undefined) {
                    var str = subdata[index].poliodate;
                    var dobyear = str.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);
                    if (
                      subdata[index].poliodate &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      // var polio=subdata[index].poliodate;
                      // console.log('poliosdad',polio);
                      poliocount++;
                      poliocount1++;
                    } else if (
                      subdata[index].poliodate &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      poliocountno++;
                      poliocountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = poliocount1 + poliocountno1;

                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            // //BCG
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].BCG !== undefined) {
                    var str = subdata[index].BCG;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].BCG !== undefined &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      var polio = subdata[index].BCG;
                      console.log("poliosdad", polio);
                      bcgcount++;
                      bcgcount1++;
                    } else if (
                      subdata[index].BCG == undefined &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      bcgcountno++;
                      bcgcountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            // //hepatis dates
            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa !== undefined) {
                    var str = subdata[index].hepa;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepacount++;
                      hepacount1++;
                    } else if (
                      subdata[index].hepa &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepacountno++;
                      hepacountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            // //dpt1

            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT1 !== undefined) {
                    var str = subdata[index].DPT1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt1count++;
                      dpt1count1++;
                    } else if (
                      subdata[index].DPT1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt1countno++;
                      dpt1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            // //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT2 !== undefined) {
                    var str = subdata[index].DPT2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt2count++;
                      dpt2count1++;
                    } else if (
                      subdata[index].DPT2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt2countno++;
                      dpt2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            // //dpt3

            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT3 !== undefined) {
                    var str = subdata[index].DPT3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT3 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt3count++;
                      dpt3count1++;
                    } else if (
                      subdata[index].DPT3 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      dpt3countno++;
                      dpt3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1
            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV1 !== undefined) {
                    var str = subdata[index].OPV1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      opv1count++;
                      opv1count1++;
                    } else if (
                      subdata[index].OPV1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                    opv1countno++;
                      opv1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

            //OPV2
            let opv2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv2count1 = 0;
                var opv2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV2 !== undefined) {
                    var str = subdata[index].OPV2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      opv2count++;
                      opv2count1++;
                    } else if (
                      subdata[index].OPV2 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                    opv2countno++;
                      opv2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv2count1 + opv2countno1;
                opv2dates.push({
                  childopv2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv2Count: opv2count1,
                  Opv2CountNo: opv2countno1
                });
              }
              var childopv2filteredarray = Object.values(opv2dates);

              var childopv2datatotables = childopv2filteredarray.map(
                childopv2ratioel => Object.values(childopv2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv2dates: childopv2datatotables
              });
            }
            this.callDataTableOPV2();

            //opv3
             let opv3dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
               ) {
                 var totalchild;
                 var opv3count1 = 0;
                 var opv3countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV3 !== undefined) {
                     var str = subdata[index].OPV3;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].OPV3 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                       opv3count++;
                       opv3count1++;
                     } else if (
                       subdata[index].OPV3 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                     opv3countno++;
                       opv3countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = opv3count1 + opv3countno1;
                 opv3dates.push({
                   childopv2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv3Count: opv3count1,
                   Opv3CountNo: opv3countno1
                 });
               }
               var childopv3filteredarray = Object.values(opv3dates);
 
               var childopv3datatotables = childopv3filteredarray.map(
                 childopv3ratioel => Object.values(childopv3ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv3dates: childopv3datatotables
               });
             }
             this.callDataTableOPV3();

           //hepatis dates1
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa1 !== undefined) {
                    var str = subdata[index].hepa1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepa1count++;
                      hepa1count1++;
                    } else if (
                      subdata[index].hepa1 &&
                      (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                      dobyear == y
                    ) {
                      hepa1countno++;
                      hepa1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

             //dadara1 dates1
             let dadara1dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
               ) {
                 var totalchild;
                 var dadara1count1 = 0;
                 var dadara1countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].dadara1 !== undefined) {
                     var str = subdata[index].dadara1;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].dadara1 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                      dadara1count++;
                      dadara1count1++;
                     } else if (
                       subdata[index].dadara1 &&
                       (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                       dobyear == y
                     ) {
                      dadara1countno++;
                      dadara1countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = dadara1count1 +dadara1countno1;
                 dadara1dates.push({
                   childdadara1anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Dadara1Count: dadara1count1,
                   Dadara1CountNo: dadara1countno1
                 });
               }
               var childdadara1filteredarray = Object.values(dadara1dates);
 
               var childdadara1datatotables = childdadara1filteredarray.map(
                 childdadara1ratioel => Object.values(childdadara1ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                dadara1dates: childdadara1datatotables
               });
             }
             this.callDataTableDadara1();

              //dadara2 dates1
              let dadara2dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
                ) {
                  var totalchild;
                  var dadara2count1 = 0;
                  var dadara2countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].dadara2 !== undefined) {
                      var str = subdata[index].dadara2;
                      console.log("ssss", str);
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      if (
                        subdata[index].dadara2 &&
                        (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                        dobyear == y
                      ) {
                       dadara2count++;
                       dadara2count1++;
                      } else if (
                        subdata[index].dadara2 &&
                        (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                        dobyear == y
                      ) {
                       dadara2countno++;
                       dadara2countno1++;
                        //undercountyes1++;
                      }
                    }
                  }
                  totalchild = dadara2count1 +dadara2countno1;
                  dadara2dates.push({
                    childdadara2anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara2Count: dadara2count1,
                    Dadara2CountNo: dadara2countno1
                  });
                }
                var childdadara2filteredarray = Object.values(dadara2dates);
  
                var childdadara2datatotables = childdadara2filteredarray.map(
                  childdadara2ratioel => Object.values(childdadara2ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara2dates: childdadara2datatotables
                });
              }
              this.callDataTableDadara2();

                 //dptbooster dates1
                 let dptboosterdates = [];
                 for (i = 0; i < data.length; i++) {
                   if (
                     //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                     data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
                   ) {
                     var totalchild;
                     var dptboostercount1 = 0;
                     var dptboostercountno1 = 0;
                     const subdata = data[i].Maternal.ChildRegistration;
                     for (let index in subdata) {
                       if (subdata[index].dptbooster !== undefined) {
                         var str = subdata[index].dptbooster;
                         console.log("ssss", str);
                         var dobyear = str.substring(0, 4);
                         var dobmonth = str.substring(5, 7);
                         if (
                           subdata[index].dptbooster &&
                           (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                           dobyear == y
                         ) {
                          dptboostercount++;
                          dptboostercount1++;
                         } else if (
                           subdata[index].dptbooster &&
                           (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                           dobyear == y
                         ) {
                          dptboostercountno++;
                          dptboostercountno1++;
                           //undercountyes1++;
                         }
                       }
                     }
                     totalchild = dptboostercount1 +dptboostercountno1;
                     dptboosterdates.push({
                       childdadara2anganwadicode: data[i].anganwadicode,
                       TotalChild: totalchild,
                       DptboosterCount: dptboostercount1,
                       DptboosterCountNo: dptboostercountno1
                     });
                   }
                   var childdptboosterfilteredarray = Object.values(dptboosterdates);
     
                   var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                     childdptboosterratioel => Object.values(childdptboosterratioel)
                   );
                   // console.log(stockdatatotables);
                   this.setState({
                    dptboosterdates: childdptboosterdatatotables
                   });
                 }
                 this.callDataTableDptbooster();
 

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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
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
        var poliocount = 0;
        var poliocountno = 0;
        var bcgcount = 0;
        var bcgcountno = 0;
        var hepacount = 0;
        var hepacountno = 0;
        var dpt1count = 0;
        var dpt1countno = 0;
        var dpt2count = 0;
        var dpt2countno = 0;
        var dpt3count = 0;
        var dpt3countno = 0;
        var opv1count = 0;
        var opv1countno = 0;
        var opv2count = 0;
        var opv2countno = 0;
        var opv3count = 0;
        var opv3countno = 0;
        var hepa1count = 0;
        var hepa1countno = 0;
        var dadara1count=0;
        var dadara1countno=0;
        var dadara2count=0;
        var dadara2countno=0;
        var dptboostercount=0;
        var dptboostercountno=0;
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
                data[i].Maternal && selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var gendercountMale1 = 0;
                var gendercountFemale1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var str = subdata[index].DPickdob;

                    var dobyear = str.substring(0, 4);

                    console.log(dobyear, selectedOption.value);
                    if (
                      subdata[index].option === "Male" &&
                      dobyear == selectedOption.value
                    ) {
                      gendercountMale++;
                      gendercountMale1++;
                    } else if (
                      subdata[index].option === "Female" &&
                      dobyear == selectedOption.value
                    ) {
                      gendercountFemale++;
                      gendercountFemale1++;
                    }
                  }
                }
                totalchild = gendercountMale1 + gendercountFemale1;
                childsexrationdata.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Male: gendercountMale1,
                  Female: gendercountFemale1
                });
              }
              var childsexratiofilteredarray = Object.values(
                childsexrationdata
              );

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

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var borncount1 = 0;
                var diedcount1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var str = subdata[index].DPickdob;

                    var dobyear = str.substring(0, 4);
                    console.log(dobyear, selectedOption.value);
                    if (
                      subdata[index].status === "Born" &&
                      dobyear == selectedOption.value
                    ) {
                      borncount++;
                      borncount1++;
                    } else if (
                      subdata[index].status === "Died" &&
                      dobyear == selectedOption.value
                    ) {
                      diedcount++;
                      diedcount1++;
                    }
                  }
                }
                totalchild = borncount1 + diedcount1;
                childmortality.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var Institutionalcount1 = 0;
                var NonInstitutionalcount1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);

                  if (
                    subdata[index].ideli === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    Institutionalcount++;
                    Institutionalcount1++;
                  } else if (
                    subdata[index].ideli === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    NonInstitutionalcount++;
                    NonInstitutionalcount1++;
                  }
                }
                totalchild = Institutionalcount1 + NonInstitutionalcount1;
                Ideliveries.push({
                  childsexanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            //Stunting in children
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var stuntcountyes1 = 0;
                var stuntcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].stunt === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    stuntcountyes++;
                    stuntcountyes1++;
                  } else if (
                    subdata[index].stunt === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    stuntcountno++;
                    stuntcountno1++;
                  }
                }
                totalchild = stuntcountyes1 + stuntcountno1;
                stunt1.push({
                  stuntanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            // //Prevalence of wasting
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var cdob = "";
                var wastingcountyes1 = 0;
                var wastingcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                  // console.log("Wasting is here", cdob);
                }
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].wast === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    wastingcountyes++;
                    wastingcountyes1++;
                  } else if (
                    subdata[index].wast === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    wastingcountno++;
                    wastingcountno1++;
                  }
                }
                totalchild = wastingcountyes1 + wastingcountno1;
                Wasting.push({
                  wastinganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  StuntYes: wastingcountyes1,
                  StuntNo: wastingcountno1
                });
              }
              var wasting1filteredarray = Object.values(Wasting);

              var wasting1datatotables = wasting1filteredarray.map(wastingel =>
                Object.values(wastingel)
              );
              // console.log(stockdatatotables);
              this.setState({
                Wasting: wasting1datatotables
              });
            }

            this.callDataTableChildWastingRatio();

            //Prevalence of underweight
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var undercountyes1 = 0;
                var undercountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].under === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    undercountyes++;
                    undercountyes1++;
                  } else if (
                    subdata[index].under === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    undercountno++;
                    undercountno1++;
                  }
                }
                totalchild = undercountyes1 + undercountno1;
                underweight1.push({
                  childunderanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var healthy1 = 0;
                var unhealthy1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPickdob) {
                    var cdob = subdata[index].DPickdob;
                    var dobyear = cdob.substring(0, 4);
                    var dobmonth = cdob.substring(5, 7);

                    if (
                      subdata[index].health === "healthy" &&
                      dobyear == selectedOption.value
                    ) {
                      healthy++;
                      healthy1++;
                    } else if (
                      subdata[index].health === "unhealthy" &&
                      dobyear == selectedOption.value
                    ) {
                      unhealthy++;
                      unhealthy1++;
                    }
                  }
                }
                totalchild = healthy1 + unhealthy1;
                ChildHealth.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
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

            //lowbirth
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var lowbirthcountyes1 = 0;
                var lowbirthcountno1 = 0;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  if (subdata1[index].DPickdob) {
                    cdob = subdata1[index].DPickdob;
                  }
                }
                // const subdata = data[i].Maternal.Nutrition;
                const subdata = data[i].Maternal.Nutrition;
                for (let index in subdata) {
                  //var str = subdata[index].DPickdob;
                  var dobyear = cdob.substring(0, 4);
                  var dobmonth = cdob.substring(5, 7);
                  if (
                    subdata[index].lowbirth === "Yes" &&
                    dobyear == selectedOption.value
                  ) {
                    lowbirthcountyes++;
                    lowbirthcountyes1++;
                  } else if (
                    subdata[index].lowbirth === "No" &&
                    dobyear == selectedOption.value
                  ) {
                    lowbirthcountno++;
                    lowbirthcountno1++;
                  }
                }

                totalchild = lowbirthcountyes1 + lowbirthcountno1;
                lowbirthweight.push({
                  childhealthanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HealthYes: lowbirthcountyes1,
                  HealthNo: lowbirthcountno1
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

            //polio date
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var poliocount1 = 0;
                var poliocountno1 = 0;
                var totalchild = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].poliodate !== undefined) {
                    var str = subdata[index].poliodate;
                    var dobyear = str.substring(0, 4);
                    if (
                      subdata[index].poliodate &&
                      dobyear == selectedOption.value
                    ) {
                      // var polio=subdata[index].poliodate;
                      // console.log('poliosdad',polio);
                      poliocount++;
                      poliocount1++;
                    } else if (
                      subdata[index].poliodate &&
                      dobyear == selectedOption.value
                    ) {
                      poliocountno++;
                      poliocountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = poliocount1 + poliocountno1;

                poliodates.push({
                  childpolioanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  PolioCount: poliocount1,
                  PolioCountNo: poliocountno1
                });
              }
              var childpoliofilteredarray = Object.values(poliodates);

              var childpoliodatatotables = childpoliofilteredarray.map(
                childpolioratioel => Object.values(childpolioratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                poliodates: childpoliodatatotables
              });
            }
            this.callDataTablePolio();

            // //BCG
            let bcgdates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var bcgcount1 = 0;
                var bcgcountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].BCG !== undefined) {
                    var str = subdata[index].BCG;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].BCG !== undefined &&
                      dobyear == selectedOption.value
                    ) {
                      var polio = subdata[index].BCG;
                      console.log("poliosdad", polio);
                      bcgcount++;
                      bcgcount1++;
                    } else if (
                      subdata[index].BCG == undefined &&
                      dobyear == selectedOption.value
                    ) {
                      bcgcountno++;
                      bcgcountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = bcgcount1 + bcgcountno1;
                bcgdates.push({
                  childbcganganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  BcgCount: bcgcount1,
                  BcgCountNo: bcgcountno1
                });
              }
              var childbcgfilteredarray = Object.values(bcgdates);

              var childbcgdatatotables = childbcgfilteredarray.map(
                childbcgratioel => Object.values(childbcgratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                bcgdates: childbcgdatatotables
              });
            }
            this.callDataTableBcg();

            // //hepatis dates
            let hepadates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepacount1 = 0;
                var hepacountno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa !== undefined) {
                    var str = subdata[index].hepa;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa &&
                      dobyear == selectedOption.value
                    ) {
                      hepacount++;
                      hepacount1++;
                    } else if (
                      subdata[index].hepa &&
                      dobyear == selectedOption.value
                    ) {
                      hepacountno++;
                      hepacountno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepacount1 + hepacountno1;
                hepadates.push({
                  childhepaanganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  HepaCount: hepacount1,
                  HepaCountNo: hepacountno1
                });
              }
              var childhepafilteredarray = Object.values(hepadates);

              var childhepadatatotables = childhepafilteredarray.map(
                childheparatioel => Object.values(childheparatioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepadates: childhepadatatotables
              });
            }
            this.callDataTableHepa();

            // //dpt1

            let dpt1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt1count1 = 0;
                var dpt1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT1 !== undefined) {
                    var str = subdata[index].DPT1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT1 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt1count++;
                      dpt1count1++;
                    } else if (
                      subdata[index].DPT1 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt1countno++;
                      dpt1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt1count1 + dpt1countno1;
                dpt1dates.push({
                  childdpt1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt1Count: dpt1count1,
                  Dpt1CountNo: dpt1countno1
                });
              }
              var childdpt1filteredarray = Object.values(dpt1dates);

              var childdpt1datatotables = childdpt1filteredarray.map(
                childdpt1ratioel => Object.values(childdpt1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt1dates: childdpt1datatotables
              });
            }
            this.callDataTableDPT1();

            // //dpt2

            let dpt2dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt2count1 = 0;
                var dpt2countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT2 !== undefined) {
                    var str = subdata[index].DPT2;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT2 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt2count++;
                      dpt2count1++;
                    } else if (
                      subdata[index].DPT2 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt2countno++;
                      dpt2countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt2count1 + dpt2countno1;
                dpt2dates.push({
                  childdpt2anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt2Count: dpt2count1,
                  Dpt2CountNo: dpt2countno1
                });
              }
              var childdpt2filteredarray = Object.values(dpt2dates);

              var childdpt2datatotables = childdpt2filteredarray.map(
                childdpt2ratioel => Object.values(childdpt2ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt2dates: childdpt2datatotables
              });
            }
            this.callDataTableDPT2();

            // //dpt3

            let dpt3dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var dpt3count1 = 0;
                var dpt3countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].DPT3 !== undefined) {
                    var str = subdata[index].DPT3;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].DPT3 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt3count++;
                      dpt3count1++;
                    } else if (
                      subdata[index].DPT3 &&
                      dobyear == selectedOption.value
                    ) {
                      dpt3countno++;
                      dpt3countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = dpt3count1 + dpt3countno1;
                dpt3dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Dpt3Count: dpt3count1,
                  Dpt3CountNo: dpt3countno1
                });
              }
              var childdpt3filteredarray = Object.values(dpt3dates);

              var childdpt3datatotables = childdpt3filteredarray.map(
                childdpt3ratioel => Object.values(childdpt3ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                dpt3dates: childdpt3datatotables
              });
            }
            this.callDataTableDPT3();

            //opv1
            let opv1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var opv1count1 = 0;
                var opv1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].OPV1 !== undefined) {
                    var str = subdata[index].OPV1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].OPV1 &&
                      dobyear == selectedOption.value
                    ) {
                      opv1count++;
                      opv1count1++;
                    } else if (
                      subdata[index].OPV1 &&
                      dobyear == selectedOption.value
                    ) {
                      opv1countno++;
                      opv1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = opv1count1 + opv1countno1;
                opv1dates.push({
                  childdpt3anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Opv1Count: opv1count1,
                  Opv1CountNo: opv1countno1
                });
              }
              var childopv1filteredarray = Object.values(opv1dates);

              var childopv1datatotables = childopv1filteredarray.map(
                childopv1ratioel => Object.values(childopv1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                opv1dates: childopv1datatotables
              });
            }
            this.callDataTableOPV1();

             //opv2
             let opv2dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
               ) {
                 var totalchild;
                 var opv2count1 = 0;
                 var opv2countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV2 !== undefined) {
                     var str = subdata[index].OPV2;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].OPV2 &&
                       dobyear == selectedOption.value
                     ) {
                       opv2count++;
                       opv2count1++;
                     } else if (
                       subdata[index].OPV2 &&
                       dobyear == selectedOption.value
                     ) {
                       opv2countno++;
                       opv2countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = opv2count1 + opv2countno1;
                 opv2dates.push({
                   childopv2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv2Count: opv2count1,
                   Opv2CountNo: opv2countno1
                 });
               }
               var childopv2filteredarray = Object.values(opv2dates);
 
               var childopv2datatotables = childopv2filteredarray.map(
                 childopv2ratioel => Object.values(childopv2ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv2dates: childopv2datatotables
               });
             }
             this.callDataTableOPV2();

             //opv3
             let opv3dates = [];
             for (i = 0; i < data.length; i++) {
               if (
                 //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                 data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
               ) {
                 var totalchild;
                 var opv3count1 = 0;
                 var opv3countno1 = 0;
                 const subdata = data[i].Maternal.ChildRegistration;
                 for (let index in subdata) {
                   if (subdata[index].OPV3 !== undefined) {
                     var str = subdata[index].OPV3;
                     console.log("ssss", str);
                     var dobyear = str.substring(0, 4);
                     var dobmonth = str.substring(5, 7);
                     if (
                       subdata[index].OPV3 &&
                       dobyear == selectedOption.value
                     ) {
                       opv3count++;
                       opv3count1++;
                     } else if (
                       subdata[index].OPV3 &&
                       dobyear == selectedOption.value
                     ) {
                       opv3countno++;
                       opv3countno1++;
                       //undercountyes1++;
                     }
                   }
                 }
                 totalchild = opv3count1 + opv3countno1;
                 opv3dates.push({
                   childopv2anganwadicode: data[i].anganwadicode,
                   TotalChild: totalchild,
                   Opv3Count: opv3count1,
                   Opv3CountNo: opv3countno1
                 });
               }
               var childopv3filteredarray = Object.values(opv3dates);
 
               var childopv3datatotables = childopv3filteredarray.map(
                 childopv3ratioel => Object.values(childopv3ratioel)
               );
               // console.log(stockdatatotables);
               this.setState({
                 opv3dates: childopv3datatotables
               });
             }
             this.callDataTableOPV3();

              // //hepatis1 dates
            let hepa1dates = [];
            for (i = 0; i < data.length; i++) {
              if (
                //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
              ) {
                var totalchild;
                var hepa1count1 = 0;
                var hepa1countno1 = 0;
                const subdata = data[i].Maternal.ChildRegistration;
                for (let index in subdata) {
                  if (subdata[index].hepa1 !== undefined) {
                    var str = subdata[index].hepa1;
                    console.log("ssss", str);
                    var dobyear = str.substring(0, 4);
                    var dobmonth = str.substring(5, 7);
                    if (
                      subdata[index].hepa1 &&
                      dobyear == selectedOption.value
                    ) {
                      hepa1count++;
                      hepa1count1++;
                    } else if (
                      subdata[index].hepa1 &&
                      dobyear == selectedOption.value
                    ) {
                      hepa1countno++;
                      hepa1countno1++;
                      //undercountyes1++;
                    }
                  }
                }
                totalchild = hepa1count1 + hepa1countno1;
                hepa1dates.push({
                  childhepa1anganwadicode: data[i].anganwadicode,
                  TotalChild: totalchild,
                  Hepa1Count: hepa1count1,
                  Hepa1CountNo: hepa1countno1
                });
              }
              var childhepa1filteredarray = Object.values(hepa1dates);

              var childhepa1datatotables = childhepa1filteredarray.map(
                childhepa1ratioel => Object.values(childhepa1ratioel)
              );
              // console.log(stockdatatotables);
              this.setState({
                hepa1dates: childhepa1datatotables
              });
            }
            this.callDataTableHepa1();

              // dadara1 dates
              let dadara1dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
                ) {
                  var totalchild;
                  var dadara1count1 = 0;
                  var dadara1countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].dadara1 !== undefined) {
                      var str = subdata[index].dadara1;
                      console.log("ssss", str);
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      if (
                        subdata[index].dadara1 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara1count++;
                        dadara1count1++;
                      } else if (
                        subdata[index].dadara1 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara1countno++;
                        dadara1countno1++;
                        //undercountyes1++;
                      }
                    }
                  }
                  totalchild = dadara1count1 + dadara1countno1;
                  dadara1dates.push({
                    childhepa1anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara1Count: dadara1count1,
                    Dadara1CountNo: dadara1countno1
                  });
                }
                var childdadara1filteredarray = Object.values(dadara1dates);
  
                var childdadara1datatotables = childdadara1filteredarray.map(
                  childdadara1ratioel => Object.values(childdadara1ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara1dates: childdadara1datatotables
                });
              }
              this.callDataTableDadara1();

              // dadara2 dates
              let dadara2dates = [];
              for (i = 0; i < data.length; i++) {
                if (
                  //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                  data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
                ) {
                  var totalchild;
                  var dadara2count1 = 0;
                  var dadara2countno1 = 0;
                  const subdata = data[i].Maternal.ChildRegistration;
                  for (let index in subdata) {
                    if (subdata[index].dadara2 !== undefined) {
                      var str = subdata[index].dadara2;
                      console.log("ssss", str);
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      if (
                        subdata[index].dadara2 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara2count++;
                        dadara2count1++;
                      } else if (
                        subdata[index].dadara2 &&
                        dobyear == selectedOption.value
                      ) {
                        dadara2countno++;
                        dadara2countno1++;
                        //undercountyes1++;
                      }
                    }
                  }
                  totalchild = dadara2count1 + dadara2countno1;
                  dadara2dates.push({
                    childdadara2anganwadicode: data[i].anganwadicode,
                    TotalChild: totalchild,
                    Dadara2Count: dadara2count1,
                    Dadara2CountNo: dadara2countno1
                  });
                }
                var childdadara2filteredarray = Object.values(dadara2dates);
  
                var childdadara2datatotables = childdadara2filteredarray.map(
                  childdadara2ratioel => Object.values(childdadara2ratioel)
                );
                // console.log(stockdatatotables);
                this.setState({
                  dadara2dates: childdadara2datatotables
                });
              }
              this.callDataTableDadara2();

               // dptbooster dates
               let dptboosterdates = [];
               for (i = 0; i < data.length; i++) {
                 if (
                   //  data[i].anganwadidetails.supervisorid === currentsupervisorid &&
                   data[i].Maternal&& selectedplace === data[i].anganwadidetails.awcplace
                 ) {
                   var totalchild;
                   var dptboostercount1 = 0;
                   var dptboostercountno1 = 0;
                   const subdata = data[i].Maternal.ChildRegistration;
                   for (let index in subdata) {
                     if (subdata[index].dptbooster !== undefined) {
                       var str = subdata[index].dptbooster;
                       console.log("ssss", str);
                       var dobyear = str.substring(0, 4);
                       var dobmonth = str.substring(5, 7);
                       if (
                         subdata[index].dptbooster &&
                         dobyear == selectedOption.value
                       ) {
                        dptboostercount++;
                        dptboostercount1++;
                       } else if (
                         subdata[index].dptbooster &&
                         dobyear == selectedOption.value
                       ) {
                        dptboostercountno++;
                        dptboostercountno1++;
                         //undercountyes1++;
                       }
                     }
                   }
                   totalchild = dptboostercount1 + dptboostercountno1;
                   dptboosterdates.push({
                     childdptboosteranganwadicode: data[i].anganwadicode,
                     TotalChild: totalchild,
                     DptboosterCount: dptboostercount1,
                     ptboosterCountNo: dptboostercountno1
                   });
                 }
                 var childdptboosterfilteredarray = Object.values(dptboosterdates);
   
                 var childdptboosterdatatotables = childdptboosterfilteredarray.map(
                   childdptboosterratioel => Object.values(childdptboosterratioel)
                 );
                 // console.log(stockdatatotables);
                 this.setState({
                  dptboosterdates: childdptboosterdatatotables
                 });
               }
               this.callDataTableDptbooster();


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
              M_C_NORMAL_Birthweight: lowbirthcountno,
              M_C_VL_Polio: poliocount,
              M_C_NORMAL_Polio: poliocountno,
              M_C_VL_Hepa: hepacount,
              M_C_NORMAL_Hepa: hepacountno,
              M_C_VL_Bcg: bcgcount,
              M_C_NORMAL_Bcg: bcgcountno,
              M_C_VL_Dpt1: dpt1count,
              M_C_NORMAL_Dpt1: dpt1countno,
              M_C_VL_Dpt2: dpt2count,
              M_C_NORMAL_Dpt2: dpt2countno,
              M_C_VL_Dpt3: dpt3count,
              M_C_NORMAL_Dpt3: dpt3countno,
              M_C_VL_Opv1: opv1count,
              M_C_NORMAL_Opv1: opv1countno,
              M_C_VL_Opv2: opv2count,
              M_C_NORMAL_Opv2: opv2countno,
              M_C_VL_Opv3: opv3count,
              M_C_NORMAL_Opv3: opv3countno,
              M_C_VL_Hepa1: hepa1count,
              M_C_NORMAL_Hepa1: hepa1countno,
              M_C_VL_Dadara1: dadara1count,
              M_C_NORMAL_Dadara1: dadara1countno,
              M_C_VL_Dadara2: dadara2count,
              M_C_NORMAL_Dadara2: dadara2countno,
              M_C_VL_Dptbooster: dptboostercount,
              M_C_NORMAL_Dptbooster:dptboostercountno
            });
          })
          .catch(e => {
            console.log("error returned - ", e);
          });
      }
    }
  };
  // handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });
  handleChangeplace = selectedOptionplace => {
    this.setState({ selectedOptionplace });
  };
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
          "Very Low Birthweight (less than 2,500 grams)" ? (
          <div>
            <br />
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

        {this.state.selectedchartoption.value === "Polio Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Polio Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Polio given ", this.state.M_C_VL_Polio],
                ["Polio not given", this.state.M_C_NORMAL_Polio]
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
        this.state.selectedTableoption.value === "Polio Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "Polio Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childpolioratioel =>
                  (this.childpolioratioel = childpolioratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {this.state.selectedchartoption.value === "BCG Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            BCG Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["BCG given ", this.state.M_C_VL_Bcg],
                ["BCG not given", this.state.M_C_NORMAL_Bcg]
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
        this.state.selectedTableoption.value === "BCG Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "BCG Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childbcgratioel =>
                  (this.childbcgratioel = childbcgratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {this.state.selectedchartoption.value === "Hepatitis Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Hepatitis Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Hepatitis given ", this.state.M_C_VL_Hepa],
                ["Hepatitis not given", this.state.M_C_NORMAL_Hepa]
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
        this.state.selectedTableoption.value === "Hepatitis Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "Hepatitis Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childheparatioel =>
                  (this.childheparatioel = childheparatioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {this.state.selectedchartoption.value === "DPT1 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            DPT1 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["DPT 1st dose given ", this.state.M_C_VL_Dpt1],
                ["DPT 1st dose not given", this.state.M_C_NORMAL_Dpt1]
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
        this.state.selectedTableoption.value === "DPT1 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "DPT1 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childdpt1ratioel =>
                  (this.childdpt1ratioel = childdpt1ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {this.state.selectedchartoption.value === "DPT2 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            DPT2 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["DPT 2nd dose given ", this.state.M_C_VL_Dpt2],
                ["DPT 2nd dose not given", this.state.M_C_NORMAL_Dpt2]
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
        this.state.selectedTableoption.value === "DPT2 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "DPT2 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childdpt2ratioel =>
                  (this.childdpt2ratioel = childdpt2ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {this.state.selectedchartoption.value === "DPT3 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            DPT3 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["DPT 3rd dose given ", this.state.M_C_VL_Dpt3],
                ["DPT 3rd dose not given", this.state.M_C_NORMAL_Dpt3]
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
        this.state.selectedTableoption.value === "DPT3 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "DPT3 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childdpt3ratioel =>
                  (this.childdpt3ratioel = childdpt3ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

        {this.state.selectedchartoption.value === "OPV1 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            OPV1 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["OPV 1st dose given ", this.state.M_C_VL_Opv1],
                ["OPV 1st dose not given", this.state.M_C_NORMAL_Opv1]
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
        this.state.selectedTableoption.value === "OPV1 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "OPV1 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childopv1ratioel =>
                  (this.childopv1ratioel = childopv1ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

{this.state.selectedchartoption.value === "OPV2 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            OPV2 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["OPV 2nd dose given ", this.state.M_C_VL_Opv2],
                ["OPV 2nd dose not given", this.state.M_C_NORMAL_Opv2]
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
        this.state.selectedTableoption.value === "OPV2 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "OPV2 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childopv2ratioel =>
                  (this.childopv2ratioel = childopv2ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

{this.state.selectedchartoption.value === "OPV3 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            OPV2 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["OPV 3rd dose given ", this.state.M_C_VL_Opv3],
                ["OPV 3rd dose not given", this.state.M_C_NORMAL_Opv3]
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
        this.state.selectedTableoption.value === "OPV3 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "OPV3 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childopv3ratioel =>
                  (this.childopv3ratioel = childopv3ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

{this.state.selectedchartoption.value === "Hepatitis1 Dates" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
           Hepatitis1 Dates
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
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Hepatitis 1st dose given ", this.state.M_C_VL_Hepa1],
                ["Hepatitis 1st dose not given", this.state.M_C_NORMAL_Hepa1]
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
        this.state.selectedTableoption.value === "Hepatitis1 Dates" ? (
          <div>
            <br />
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
            {this.state.selectedTableoption.value === "Hepatitis1 Dates" &&
            this.state.selectedOption.value ? (
              <table
                id="diseasetable"
                className="display"
                width="100%"
                //   childunderratioel => Object.values(childunderratioel)
                ref={childhepa1ratioel =>
                  (this.childhepa1ratioel = childhepa1ratioel)
                }
              />
            ) : null}
          </div>
        ) : null}

{this.state.selectedchartoption.value === "Dadara1 Dates" &&
this.state.selecteddatatypeoption.value === "Chart" ? (
  <div>
    {" "}
    Dadara1 Dates
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
      chartType="PieChart"
      data={[
        ["title", "value"],
        ["Dadara1 1st dose given ", this.state.M_C_VL_Dadara1],
        ["Dadara1 1st dose not given", this.state.M_C_NORMAL_Dadara1]
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
this.state.selectedTableoption.value === "Dadara1 Dates" ? (
  <div>
    <br />
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
    {this.state.selectedTableoption.value === "Dadara1 Dates" &&
    this.state.selectedOption.value ? (
      <table
        id="diseasetable"
        className="display"
        width="100%"
        //   childunderratioel => Object.values(childunderratioel)
        ref={childdadara1ratioel =>
          (this.childdadara1ratioel = childdadara1ratioel)
        }
      />
    ) : null}
  </div>
) : null}

{this.state.selectedchartoption.value === "Dadara2 Dates" &&
this.state.selecteddatatypeoption.value === "Chart" ? (
  <div>
    {" "}
    Dadara2 Dates
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
      chartType="PieChart"
      data={[
        ["title", "value"],
        ["Dadara1 2nd dose given ", this.state.M_C_VL_Dadara2],
        ["Dadara1 2nd dose not given", this.state.M_C_NORMAL_Dadara2]
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
this.state.selectedTableoption.value === "Dadara2 Dates" ? (
  <div>
    <br />
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
    {this.state.selectedTableoption.value === "Dadara2 Dates" &&
    this.state.selectedOption.value ? (
      <table
        id="diseasetable"
        className="display"
        width="100%"
        //   childunderratioel => Object.values(childunderratioel)
        ref={childdadara2ratioel =>
          (this.childdadara2ratioel = childdadara2ratioel)
        }
      />
    ) : null}
  </div>
) : null}

{this.state.selectedchartoption.value === "Dptbooster Dates" &&
this.state.selecteddatatypeoption.value === "Chart" ? (
  <div>
    {" "}
    Dptbooster Dates
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
      chartType="PieChart"
      data={[
        ["title", "value"],
        ["Dptbooster dose given ", this.state.M_C_VL_Dptbooster],
        ["Dptbooster dose not given", this.state.M_C_NORMAL_Dptbooster]
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
this.state.selectedTableoption.value === "Dptbooster Dates" ? (
  <div>
    <br />
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
    {this.state.selectedTableoption.value === "Dptbooster Dates" &&
    this.state.selectedOption.value ? (
      <table
        id="diseasetable"
        className="display"
        width="100%"
        //   childunderratioel => Object.values(childunderratioel)
        ref={childdptboosterratioel =>
          (this.childdptboosterratioel = childdptboosterratioel)
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


