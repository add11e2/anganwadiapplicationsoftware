import "../../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import CEO_DD_DCLayout from "../../../../../OtherComponents/Layout/CEO_DD_DCLayout";
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

$(document).ready(function() {
  $("#diseasetable").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"],
    destroy: true
  });
});

// require("datatables.net-buttons")(window, $);
// require("datatables.net-buttons/js/buttons.print.js")(window, $);
// require("datatables.net-buttons/js/buttons.colVis.js")(window, $);
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
const year = dt.getFullYear() - 80;
for (let i = dt.getFullYear(); i > year; i--) {
  options[index] = {};
  options[index].value = i;
  options[index].label = i;
  index++;
}

let options1 = [];
let index1 = 4;
options1[0] = {};
options1[0].value = "New";
options1[0].label = "New";
options1[1] = {};
options1[1].value = "Today";
options1[1].label = "Today";
options1[2] = {};
options1[2].label = "This Month";
options1[2].value = "This Month";
options1[3] = {};
options1[3].value = "Last 3 Month";
options1[3].label = "Last 3 Month";

const dt1 = new Date();
const year1 = dt1.getFullYear() - 10;
for (let i = dt1.getFullYear(); i > year1; i--) {
  options1[index1] = {};
  options1[index1].value = i;
  options1[index1].label = i;
  index1++;
}
// console.log("opeiton1", options1);
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
const chartselectoptions = [
  {
    value: "Disease rates in households",
    label: "Disease rates in households"
  },
  {
    value: "Occupations in households",
    label: "Occupations in households"
  },

  {
    value: "Expectant women's in households",
    label: "Expectant women's in households"
  },
  {
    value: "Sex ratio in households",
    label: "Sex ratio in households"
  },
  {
    value: "Literacy rate in households",
    label: "Literacy rate in households"
  },
  {
    value: "Disability in households",
    label: "Disability in households"
  },
  {
    value: "Income rate in households",
    label: "Income  rate in households"
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
      color: "#E7340E"
    },
    {
      color: "#F3EF0A"
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

export const datatablecreator = snapshot => {
  let data = [];
  snapshot.forEach(childSnapshot => {
    data.push({
      talukname: childSnapshot.val().talukname
        ? childSnapshot.val().talukname
        : "<font color=red>NOT ASSIGNED</font>",
      cdpo_acdpo_name: childSnapshot.val().cdpo_acdpo_name,
      cdpo_acdpo_emailid: childSnapshot.val().cdpo_acdpo_emailid,
      //  cdpo_acdpo_dateofbirth: childSnapshot.val().cdpo_acdpo_dateofbirth,
      cdpo_acdpo_mobileno: childSnapshot.val().cdpo_acdpo_mobileno,
      cdpo_acdpo_password: childSnapshot.val().cdpo_acdpo_password,
      cdpo_acdpo_id: "cdpoacdpoShow/" + childSnapshot.key
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
export default class Demographics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      selectedTableoption: "",
      selectedOptionplace: "",
      selectedOption: "",
      currentsupervisorid: "",
      selecteddatatypeoption: "",
      diseasedata: [],
      Occupations: [],
      Pregnancy: [],
      Gender: [],
      LiteracyRatio: [],
      Disability: [],
      Incomes: []
    };
  }

  componentWillMount() {
    let optionplace = [];
    let j = 1;
    optionplace[0] = {};
    optionplace[0].value = "All Places";
    optionplace[0].label = "All Places";

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
            optionplace[j] = {};
            optionplace[j].value = data[i].anganwadidetails.talukname;
            optionplace[j].label = data[i].anganwadidetails.talukname;
            j++;
          }
        }
        var array = [];
        var index = 0;
        var optionsplace1 = [];
        for (i = 0; i < optionplace.length; i++) {
          if (array.indexOf(optionplace[i].value) === -1) {
            array.push(optionplace[i].value);
            optionsplace1[index] = {};
            optionsplace1[index].value = optionplace[i].value;
            optionsplace1[index].label = optionplace[i].value;
            index++;
          }
        }
        this.setState({ optionplace: optionsplace1 });
      });
  }

  handleChangePlace = selectedOptionplace => {
    this.setState({ selectedOptionplace });
  };

  handleChangeYear = selectedOption => {
    this.setState({ selectedOption });

    let diseasedata = [];
    let Occupations = [];
    let Pregnancy = [];
    let Gender = [];
    let LiteracyRatio = [];
    let Disability = [];
    let Incomes = [];

    const selectedplace = this.state.selectedOptionplace.value;
    if (selectedplace === "All Places") {
      if (selectedOption.value === "none" || selectedOption.value === "All") {
        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === "Diabetes" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease2 === "Diabetes" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease3 === "Diabetes"
                    ) {
                      Diabitescount++;
                      Diabitescount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === "HIV" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease2 === "HIV" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease3 === "HIV"
                    ) {
                      HIVcount++;
                      HIVcount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === "Asthama" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease2 === "Asthama" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease3 === "Asthama"
                    ) {
                      Asthamacount++;
                      Asthamacount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === " No disease" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease2 === " No disease" ||
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease3 === " No disease"
                    ) {
                      Nodiseasecount++;
                      Nodiseasecount1++;
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }
            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;
                    if (
                      Designation === "UnEmployed" &&
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate !== "illiterate"
                    ) {
                      countUnemployment++;
                      unemployed1++;
                    }
                    //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Agriculture"
                    ) {
                      Agriculturecount++;
                      Agriculturecount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "HouseWife"
                    ) {
                      HouseWifecount++;
                      HouseWifecount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Teacher"
                    ) {
                      Teachercount++;
                      Teachercount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Poultry"
                    ) {
                      Paultrycount++;
                      Paultrycount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Other"
                    ) {
                      Othercount++;
                      Othercount1++;
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }
            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var countfemale = 0;
            var TotalCountFemale = 0;
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
            console.log("today ", today, "d", dd, "m", mm, "y", yyyy);
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic && data[i].Maternal) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var ebinifitt = 0;
                var countfemale1 = 0;
                var ebdate = "";
                var domonth = "";
                var ddate = "";
                var ddYear = "";

                const subdata1 = data[i].Maternal.ChildRegistration;
                console.log("data", subdata1);
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddate = ebinifitt.substring(8, 10);
                    domonth = ebinifitt.substring(5, 7);
                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (GivenDate > CurrentDate) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                const subdata = data[i].Demographic.Pregnancy;
                for (let index in subdata) {
                  if (subdata[index].Delivery === "No") {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }
                console.log(Nursing1, "nursing count here");

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }

            this.callDataTablePregnency();

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Male"
                    ) {
                      countmale++;
                      countmale1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      countfemale++;
                      countfemale11++;
                    }
                    total = countfemale11 + countmale1;
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }

            this.callDataTableGender();
            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "SSLC"
                    ) {
                      sslc++;
                      sslc1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "PUC"
                    ) {
                      puc++;
                      puc1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "Primary"
                    ) {
                      HighSchool++;
                      HighSchool1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "Graduvated"
                    ) {
                      Graduvated++;
                      Graduvated1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "illiterate"
                    ) {
                      Illiteratecount++;
                      Illiteratecount1++;
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (data[i].Demographic) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disability === "Yes"
                    ) {
                      DisbaledYes++;
                      Disbaled1Yes++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disability === "No"
                    ) {
                      DisbaledNo++;
                      Disbaled1No++;
                    }
                  }
                  total1 = Disbaled1Yes + Disbaled1No;
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            this.callDataTableDisabled();

            //Income of The familiy  ALLPLAcesALLIncome

            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = 0;

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;

                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income < 11000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 11000 && Income < 35000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 35000 && Income < 100000) {
                    Fifty++;
                    Fifty1++;
                  } else if (Income > 100000) {
                    Lakh++;
                    Lakh1++;
                  }

                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
              // TotalFemaleC:countfemale,
            });
          });

        // .catch(e => {
        //   console.log("error returned - ", e);
        // });
      }
      // code for Today
      else if (selectedOption.value === "Today") {
        //code  today

        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    console.log("year");
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
                    var dobyear =
                      data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                    console.log(today, "todays date");

                    if (
                      (data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === "Diabetes" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "Diabetes" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Diabetes") &&
                      dobyear == today
                    ) {
                      Diabitescount++;
                      Diabitescount1++;
                    } else if (
                      (data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === "HIV" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "HIV" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "HIV") &&
                      dobyear == today
                    ) {
                      HIVcount++;
                      HIVcount1++;
                    } else if (
                      (data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === "Asthama" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "Asthama" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Asthama") &&
                      dobyear == today
                    ) {
                      Asthamacount++;
                      Asthamacount1++;
                    } else if (
                      (data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disease1 === " No disease" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === " No disease" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === " No disease") &&
                      dobyear == today
                    ) {
                      Nodiseasecount++;
                      Nodiseasecount1++;
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }

            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;

                    /*code for litreacy*/

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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                        dobyear == today
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        dobyear == today
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        dobyear == today
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        dobyear == today
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        dobyear == today
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        dobyear == today
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }

            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var ebinifitt = "";
            var domonth = "";
            var ddate = "";
            var ddYear = "";
            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic && data[i].Maternal) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var cdob = "";
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddate = ebinifitt.substring(8, 10);
                    domonth = ebinifitt.substring(5, 7);
                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (GivenDate > CurrentDate) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                for (let index in subdata) {
                  //code for today Pregnancy

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
                  var Dddate = subdata[index].LPerioddate;
                  if (subdata[index].Delivery === "No" && Dddate == today) {
                    Deliverycount++;
                    Deliverycount1++;
                  } 
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }

            this.callDataTablePregnency();

            // Gender
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

            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    console.log("today", today, "dobyear", dobyear);
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;

                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                        dobyear === today
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                        dobyear === today
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }

            this.callDataTableGender();

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                        dobyear == today
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                        dobyear == today
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                        dobyear == today
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                        dobyear == today
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                        dobyear == today
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }
            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (data[i].Demographic) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (data[i].Demographic.HouseholdMember[obj].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj].DOE;
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                        dobyear == today
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                        dobyear == today
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }

                      total1 = Disbaled1Yes + Disbaled1No;
                    }
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            this.callDataTableDisabled();

            //Income of The familiy Today  ALLPLAcesTodayIncome
            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

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

            var TotalHouse = 0;
            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income > 10000 && Income < 25000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 25000 && Income < 50000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 50000 && Income < 100000) {
                    Lakh++;
                    Lakh1++;
                  }
                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
              // :TotalCountFemale,
            });
          })

          .catch(e => {
            console.log("error returned - ", e);
          });
      }
      // month wise code
      else if (selectedOption.value === "This Month") {
        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var domonth = str.substring(5, 7);
                      var doyear = str.substring(0, 4);
                      // var dobyear = str.substring(0, 4);
                      // console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Disease1
                      // );
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Diabetes") &&
                        domonth == mm &&
                        doyear == yyyy
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        domonth == mm &&
                        doyear == yyyy
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Asthama") &&
                        domonth == mm &&
                        doyear == yyyy
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === " No disease") &&
                        domonth == mm &&
                        doyear == yyyy
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }
            this.callDataTableDisease();
            // code

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;
                    //month code
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      //to here
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate"
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }

            /*code for occupation */

            this.callDataTableOccupation();

            /*           */

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var countfemale;
            var TotalCountFemale = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic && data[i].Maternal) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var ebinifitt = 0;

                var ddate = 0;
                var domonth = 0;
                var ddYear = 0;
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }

                var cdob = "";
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddate = ebinifitt.substring(8, 10);
                    domonth = ebinifitt.substring(5, 7);
                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (GivenDate > CurrentDate) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                for (let index in subdata) {
                  // code for

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

                  var str = subdata[index].LPerioddate;
                  var Pgyyear = str.substring(0, 4);
                  var dobmonth = str.substring(5, 7);
                  if (
                    subdata[index].Delivery === "No" &&
                    dobmonth == mm &&
                    Pgyyear == yyyy
                  ) {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }

            /*code  */

            this.callDataTablePregnency();
            /* code ends   */

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );

                    //code start
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

                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;

                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);

                      // code ends
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }
            /* call function gender this month */
            this.callDataTableGender();
            /* code ends*/

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    //code for month
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

                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      //ends here
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            /*call litreacy*/
            this.callDataTableLiteracy();
            /* code ends*/

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (data[i].Demographic) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);

                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            /* call for disabled   */

            this.callDataTableDisabled();
            /*code ends*/

            //Income of The familiy  This Month ALLPLAcesMonthIncome
            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income > 10000 && Income < 25000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 25000 && Income < 50000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 50000 && Income < 100000) {
                    Lakh++;
                    Lakh1++;
                  }
                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
            });
          })

          .catch(e => {
            console.log("error returned - ", e);
          });
      }
      //3 months code here
      else if (selectedOption.value === "Last 3 Month") {
        // from here ******************************************
        var today = new Date();
        var year = 0;
        year = today.getFullYear();
        var dt1 = 0;
        var dt2 = 0;
        var dt3 = 0;
        var c = 0;
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

        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            var Diabitescount1 = 0;
            var HIVcount1 = 0;
            var Asthamacount1 = 0;
            var Nodiseasecount1 = 0;

            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);

                      // var dobyear = str.substring(0, 4);
                      // console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Disease1
                      // );
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "Diabetes" ||
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Diabetes" &&
                          (dobmonth == dt1 ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == year)
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease1 === "Asthama") &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === " No disease" ||
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === " No disease" &&
                          (dobmonth == dt1 ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == year)
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }

            /* call for diesease 3 moths*/
            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);
                      console.log("dobyear && Year", dobyear, year);
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                        year == dobyear
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }

            /*call occupation*/

            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var countfemale = 0;
            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var ebinifitt = 0;
                var ddate = 0;
                var domonth = 0;
                var ddYear = 0;
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;

                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddate = ebinifitt.substring(8, 10);
                    domonth = ebinifitt.substring(5, 7);
                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();

                    GivenDate = new Date(GivenDate);
                    console.log(
                      GivenDate,
                      "given deatecount here",
                      "dt1 dt2  dt3 ",
                      dt1,
                      dt2,
                      dt3
                    );
                    if (
                      (dt1 == domonth || dt2 == domonth || dt3 == domonth) &&
                      year == ddYear
                    ) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                for (let index in subdata) {
                  var str = subdata[index].LPerioddate;
                  var dobmonth = str.substring(5, 7);
                  var doyear = str.substring(0, 4);
                  if (
                    subdata[index].Delivery === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    doyear == year
                  ) {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }
            /*call pregnancy*/

            this.callDataTablePregnency();

            // Gender

            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            var today = new Date();
            var Year = today.getFullYear();
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE)
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                    var dobmonth = str.substring(5, 7);
                    var dobyear = str.substring(0, 4);
                    console.log(
                      "DObMonth",
                      dobmonth,
                      " dt1",
                      dt1,
                      "dt2",
                      dt2,
                      "dt3",
                      dt3
                    );
                    if (
                      ((data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                        "Male" &&
                        dobmonth == dt1) ||
                        dobmonth == dt2 ||
                        dobmonth == dt3) &&
                      dobyear == year
                    ) {
                      countmale++;
                      countmale1++;
                    } else if (
                      ((data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                        "Female" &&
                        dobmonth == dt1) ||
                        dobmonth == dt2 ||
                        dobmonth == dt3) &&
                      dobyear == year
                    ) {
                      countfemale++;
                      countfemale11++;
                    }
                    total = countfemale11 + countmale1;
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }
            /*call gender*/
            this.callDataTableGender();

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;
            var today = new Date();
            var Year = today.getFullYear();

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);
                      if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == year
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;
            var today = new Date();
            var Year = today.getFullYear();

            for (i = 0; i < data.length; i++) {
              if (data[i].Demographic) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);
                      if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        year == dobyear
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            this.callDataTableDisabled();

            //Income of The familiy  Last 3 moths  ALLPLAces Last 3 moths Income
            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income > 10000 && Income < 25000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 25000 && Income < 50000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 50000 && Income < 100000) {
                    Lakh++;
                    Lakh1++;
                  }
                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
            });
          });
      }
      // Year wise code
      else {
        //copy code

        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Diabetes") &&
                        dobyear == selectedOption.value
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        dobyear == selectedOption.value
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Asthama") &&
                        dobyear == selectedOption.value
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === " No disease") &&
                        dobyear == selectedOption.value
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }

            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);
                      // unemployment code
                      Designation =
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation;
                      Literate =
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate;
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                        dobyear == selectedOption.value
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        dobyear == selectedOption.value
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        dobyear == selectedOption.value
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        dobyear == selectedOption.value
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        dobyear == selectedOption.value
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        dobyear == selectedOption.value
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }
            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var ebinifitt = 0;
                var ddYear = 0;
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (ddYear == selectedOption.value) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }
                for (let index in subdata) {
                  var str = subdata[index].LPerioddate;
                  var dobYear=str.substring(0,4);
                  // console.log("year", str);

                  var dobyear = str.substring(0, 4);
                  console.log("ddate", dobyear);
                  if (subdata[index].Delivery === "No" && dobYear == selectedOption.value) {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }
                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }
            this.callDataTablePregnency();

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (data[i].Demographic) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                      // );
                      //else
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                        dobyear == selectedOption.value
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                        dobyear == selectedOption.value
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }
            this.callDataTableGender();

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);

                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                        dobyear == selectedOption.value
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                        dobyear == selectedOption.value
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                        dobyear == selectedOption.value
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                        dobyear == selectedOption.value
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                        dobyear == selectedOption.value
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (data[i].Demographic) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                        dobyear == selectedOption.value
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                        dobyear == selectedOption.value
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }
            this.callDataTableDisabled();

            //Income of The familiy Year
            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;

                for (const obj in data[i].Demographic.HouseHold) {
                  var Hnumber = data[i].Demographic.HouseHold[obj].HHNumber;

                  for (const obj in data[i].Demographic.HouseholdMember) {
                    for (const obj1 in data[i].Demographic.HouseholdMember[
                      obj
                    ]) {
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .HHNumber == Hnumber
                      ) {
                        var str =
                          data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                        var year = str.substring(0, 4);
                        console.log("Total Houses", TotalHouse);

                        Income = data[i].Demographic.HouseHold[obj].Income;
                        if (Income < 11000 && year == selectedOption.value) {
                          Ten++;
                          Ten1++;
                        } else if (
                          Income >= 11000 &&
                          Income < 35000 &&
                          year == selectedOption.value
                        ) {
                          Twentyfive++;
                          Twentyfive1++;
                        } else if (
                          Income >= 35000 &&
                          Income < 100000 &&
                          year == selectedOption.value
                        ) {
                          Fifty++;
                          Fifty1++;
                        } else if (
                          Income > 100000 &&
                          year == selectedOption.value
                        ) {
                          Lakh++;
                          Lakh1++;
                        }
                        if (
                          data[i].Demographic.HouseHold[obj].HHNumber !==
                            undefined &&
                          year == selectedOption.value
                        ) {
                          TotalHouse++;
                        }
                        //
                      }
                    }
                  }
                }
                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
            });
          })

          .catch(e => {
            console.log("error returned - ", e);
          });
      }

      console.log("All places");
    } else if (!(selectedplace === "All Places")) {
      if (selectedOption.value === "none" || selectedOption.value === "All") {
        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;

                      // var dobyear = str.substring(0, 4);
                      // console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Disease1
                      // );
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "Diabetes" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Diabetes"
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "HIV" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "HIV"
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Asthama" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === "Asthama" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Asthama"
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease2 === " No disease" ||
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === " No disease"
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }
            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;

                    if (
                      Designation === "UnEmployed" &&
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate !== "illiterate"
                    ) {
                      countUnemployment++;
                      unemployed1++;
                    }
                    //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Agriculture"
                    ) {
                      Agriculturecount++;
                      Agriculturecount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "HouseWife"
                    ) {
                      HouseWifecount++;
                      HouseWifecount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Teacher"
                    ) {
                      Teachercount++;
                      Teachercount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Poultry"
                    ) {
                      Paultrycount++;
                      Paultrycount1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation === "Other"
                    ) {
                      Othercount++;
                      Othercount1++;
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }
            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var TotalCountFemale = 0;
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
            console.log("today ", today, "d", dd, "m", mm, "y", yyyy);
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                data[i].Maternal &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var ebinifitt = 0;
                var countfemale1 = 0;
                var ebdate = "";
                var domonth = "";
                var ddate = "";
                var ddYear = "";

                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (GivenDate > CurrentDate) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }
                console.log(
                  parseInt(dd) + parseInt(mm) + parseInt(yyyy),
                  parseInt(ddate) + parseInt(domonth) + parseInt(ddYear),
                  "today dat here",
                  "ebdate here"
                );

                const subdata = data[i].Demographic.Pregnancy;
                for (let index in subdata) {
                  if (subdata[index].Delivery === "No") {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }

            this.callDataTablePregnency();

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Male"
                    ) {
                      countmale++;
                      countmale1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      countfemale++;
                      countfemale11++;
                    }
                    total = countfemale11 + countmale1;
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }

            this.callDataTableGender();
            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "SSLC"
                    ) {
                      sslc++;
                      sslc1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "PUC"
                    ) {
                      puc++;
                      puc1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "Primary"
                    ) {
                      HighSchool++;
                      HighSchool1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "Graduvated"
                    ) {
                      Graduvated++;
                      Graduvated1++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate === "illiterate"
                    ) {
                      Illiteratecount++;
                      Illiteratecount1++;
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disability === "Yes"
                    ) {
                      DisbaledYes++;
                      Disbaled1Yes++;
                    } else if (
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Disability === "No"
                    ) {
                      DisbaledNo++;
                      Disbaled1No++;
                    }
                  }
                  total1 = Disbaled1Yes + Disbaled1No;
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            this.callDataTableDisabled();

            //Income of The familiy Year
            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income < 11000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 11000 && Income < 35000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 35000 && Income < 100000) {
                    Fifty++;
                    Fifty1++;
                  } else if (Income > 100000) {
                    Lakh++;
                    Lakh1++;
                  }

                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
              // TotalFemaleC:countfemale,
            });
          });

        // .catch(e => {
        //   console.log("error returned - ", e);
        // });
      }
      // code for Today
      else if (selectedOption.value === "Today") {
        //code  today

        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    console.log("year");
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      console.log(today, "todays date");

                      if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Diabetes") &&
                        dobyear == today
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        dobyear == today
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Asthama") &&
                        dobyear == today
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === " No disease") &&
                        dobyear == today
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }

            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;

                    /*code for litreacy*/

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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                        dobyear == today
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        dobyear == today
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        dobyear == today
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        dobyear == today
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        dobyear == today
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        dobyear == today
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }

            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;

            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                data[i].Maternal &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var cdob = "";
                var ebinifitt=0;
                var ddate=0;
                var domonth=0;
                var ddYear=0;
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddate = ebinifitt.substring(8, 10);
                    domonth = ebinifitt.substring(5, 7);
                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (GivenDate > CurrentDate) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                for (let index in subdata) {
                  //code for today Pregnancy

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
                  var Dddate = subdata[index].LPerioddate;
                  if (subdata[index].Delivery === "No" && Dddate == today) {
                    Deliverycount++;
                    Deliverycount1++;
                  } 
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      countfemale1++;
                      TotalCountFemale++;
                    }
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }

            this.callDataTablePregnency();

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;

                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                        dobyear == today
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                        dobyear == today
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                        dobyear == today
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                        dobyear == today
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                        dobyear == today
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                        dobyear == today
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                        dobyear == today
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (
                      (dobyear = data[i].Demographic.HouseholdMember[obj].DOE)
                    ) {
                      var dobyear =
                        data[i].Demographic.HouseholdMember[obj].DOE;
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                        dobyear == today
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                        dobyear == today
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            this.callDataTableDisabled();

            //Income of The familiy

            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income > 10000 && Income < 25000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 25000 && Income < 50000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 50000 && Income < 100000) {
                    Lakh++;
                    Lakh1++;
                  }
                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
              // :TotalCountFemale,
            });
          })

          .catch(e => {
            console.log("error returned - ", e);
          });
      }
      // month wise code
      else if (selectedOption.value === "This Month") {
        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var domonth = str.substring(5, 7);
                      var dobYear = str.substring(0, 4);

                      // var dobyear = str.substring(0, 4);
                      // console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Disease1
                      // );
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Diabetes") &&
                        domonth == mm &&
                        yyyy == dobYear
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        domonth == mm &&
                        yyyy == dobYear
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Asthama") &&
                        domonth == mm &&
                        yyyy == dobYear
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === " No disease") &&
                        domonth == mm &&
                        yyyy == dobYear
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }
            this.callDataTableDisease();
            // code

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;
                    //month code
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
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      //to here
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }

            /*code for occupation */

            this.callDataTableOccupation();

            /*           */

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                data[i].Maternal &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var ebinifitt = 0;

                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;
                var cdob = "";
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (GivenDate > CurrentDate) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                for (let index in subdata) {
                  // code for

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

                  var str = subdata[index].LPerioddate;
                  var Pgyyear = str.substring(0, 4);
                  var dobmonth = str.substring(5, 7);

                 

                  if (
                    subdata[index].Delivery === "No" &&
                    dobmonth == mm &&
                    Pgyyear == yyyy
                  ) {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }

            /*code  */

            this.callDataTablePregnency();
            /* code ends   */

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );

                    //code start
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

                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);

                      // code ends
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }
                }
                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }
            /* call function gender this month */
            this.callDataTableGender();
            /* code ends*/

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    //code for month
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

                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);
                      //ends here
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                        dobmonth == mm &&
                        dobyear == yyyy
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            /*call litreacy*/
            this.callDataTableLiteracy();
            /* code ends*/

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobyear = str.substring(0, 4);
                      var dobmonth = str.substring(5, 7);

                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                        mm == dobmonth &&
                        yyyy == dobyear
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                        mm == dobmonth &&
                        yyyy == dobyear
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            /* call for disabled   */

            this.callDataTableDisabled();
            /*code ends*/

            //Income of The familiy

            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income > 10000 && Income < 25000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 25000 && Income < 50000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 50000 && Income < 100000) {
                    Lakh++;
                    Lakh1++;
                  }
                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
            });
          })

          .catch(e => {
            console.log("error returned - ", e);
          });
      }
      //3 months code here
      else if (selectedOption.value === "Last 3 Month") {
        // from here ******************************************
        var today = new Date();
        var year = today.getFullYear();
        var dt1 = 0;
        var dt2 = 0;
        var dt3 = 0;
        var c = 0;
        var mm = today.getMonth() + 1;
        var yyyy = today.getFullYear();
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

        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;

            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobYear = str.substring(0, 4);

                      // var dobyear = str.substring(0, 4);
                      // console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Disease1
                      // );
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Diabetes") &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        yyyy == dobYear
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        yyyy == dobYear
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease3 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease1 === "Asthama") &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        yyyy == dobYear
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === " No disease") &&
                        (dobmonth == dt1 ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        yyyy == dobYear
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }

            /* call for diesease 3 moths*/
            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // unemployment code
                    Designation =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .Designation;
                    Literate =
                      data[i].Demographic.HouseholdMember[obj][obj1]
                        .LiteracyRate;
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);
                      if (
                        Designation === "UnEmployed" &&
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }

            /*call occupation*/

            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var ebinifitt = 0;
                var ddate = 0;
                var domonth = 0;
                var ddYear = 0;
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;

                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddate = ebinifitt.substring(8, 10);
                    domonth = ebinifitt.substring(5, 7);
                    ddYear = ebinifitt.substring(0, 4);

                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (
                      (dt1 == domonth || dt2 == domonth || dt3 == domonth) &&
                      year == dobYear
                    ) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }

                for (let index in subdata) {
                  var str = subdata[index].LPerioddate;
                  var dobmonth = str.substring(5, 7);
                  var dobyear = str.substring(0, 4);
                  if (
                    subdata[index].Delivery === "No" &&
                    (dobmonth == dt1 || dobmonth == dt2 || dobmonth == dt3) &&
                    dobyear == year
                  ) {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );

                    var str =
                      data[i].Demographic.HouseholdMember[obj][obj1].DOB;
                    var dobmonth = str.substring(5, 7);
                    if (
                      (data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                        "Female" &&
                        dobmonth == dt1) ||
                      dobmonth == dt2 ||
                      dobmonth == dt3
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }

                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }
            /*call pregnancy*/

            this.callDataTablePregnency();

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);
                      console.log(
                        "DObMonth",
                        dobmonth,
                        " dt1",
                        dt1,
                        "dt2",
                        dt2,
                        "dt3",
                        dt3
                      );
                      if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }

                  Gender.push({
                    //donot delete the below comment
                    //  ...childSnapshot.val(),
                    Genderanganwadicode: data[i].anganwadicode,
                    GenderMale: countmale1,
                    GenderFemale: countfemale11,
                    GenderTotal: total
                  });
                }
                var Genderfilteredarray = Object.values(Gender);
                var Gendertotables = Genderfilteredarray.map(Genderel =>
                  Object.values(Genderel)
                );
                this.setState({
                  Gender: Gendertotables
                });
              }
              /*call gender*/
              this.callDataTableGender();

              // Literacy var LiteracyRate = 0;
              var Illiteratecount = 0;
              var sslc = 0;
              var puc = 0;
              var HighSchool = 0;
              var Graduvated = 0;

              for (i = 0; i < data.length; i++) {
                if (
                  // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                  data[i].Demographic &&
                  selectedplace === data[i].anganwadidetails.talukname
                ) {
                  var Illiteratecount1 = 0;
                  var sslc1 = 0;
                  var puc1 = 0;
                  var HighSchool1 = 0;
                  var Graduvated1 = 0;
                  for (const obj in data[i].Demographic.HouseholdMember) {
                    for (const obj1 in data[i].Demographic.HouseholdMember[
                      obj
                    ]) {
                      if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                        var str =
                          data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                        var dobmonth = str.substring(5, 7);
                        var dobyear = str.substring(0, 4);
                        if (
                          ((data[i].Demographic.HouseholdMember[obj][obj1]
                            .LiteracyRate === "SSLC" &&
                            dobmonth == dt1) ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == yyyy
                        ) {
                          sslc++;
                          sslc1++;
                        } else if (
                          ((data[i].Demographic.HouseholdMember[obj][obj1]
                            .LiteracyRate === "PUC" &&
                            dobmonth == dt1) ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == yyyy
                        ) {
                          puc++;
                          puc1++;
                        } else if (
                          ((data[i].Demographic.HouseholdMember[obj][obj1]
                            .LiteracyRate === "Primary" &&
                            dobmonth == dt1) ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == yyyy
                        ) {
                          HighSchool++;
                          HighSchool1++;
                        } else if (
                          ((data[i].Demographic.HouseholdMember[obj][obj1]
                            .LiteracyRate === "Graduvated" &&
                            dobmonth == dt1) ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == yyyy
                        ) {
                          Graduvated++;
                          Graduvated1++;
                        } else if (
                          ((data[i].Demographic.HouseholdMember[obj][obj1]
                            .LiteracyRate === "illiterate" &&
                            dobmonth == dt1) ||
                            dobmonth == dt2 ||
                            dobmonth == dt3) &&
                          dobyear == yyyy
                        ) {
                          Illiteratecount++;
                          Illiteratecount1++;
                        }
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      var dobmonth = str.substring(5, 7);
                      var dobyear = str.substring(0, 4);
                      if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        ((data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                          dobmonth == dt1) ||
                          dobmonth == dt2 ||
                          dobmonth == dt3) &&
                        dobyear == yyyy
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }

            this.callDataTableDisabled();

            //Income of The familiy

            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income > 10000 && Income < 25000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 25000 && Income < 50000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 50000 && Income < 100000) {
                    Lakh++;
                    Lakh1++;
                  }
                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
            });
          });
      }
      // Year wise code
      else {
        //copy code

        firebase
          .database()
          .ref("users")
          .once("value")
          .then(snapshot => {
            const data = firebaseLooper(snapshot);

            var i;
            var Diabitescount = 0;
            var HIVcount = 0;
            var Asthamacount = 0;
            var Nodiseasecount = 0;
            for (i = 0; i < data.length; i++) {
              console.log(data[i]);
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Diabitescount1 = 0;
                var HIVcount1 = 0;
                var Asthamacount1 = 0;
                var Nodiseasecount1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    console.log(
                      "year",
                      data[i].Demographic.HouseholdMember[obj][obj1].DOB
                    );
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);
                      // console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                      if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Diabetes" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Diabetes") &&
                        dobyear == selectedOption.value
                      ) {
                        Diabitescount++;
                        Diabitescount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "HIV" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "HIV") &&
                        dobyear == selectedOption.value
                      ) {
                        HIVcount++;
                        HIVcount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === "Asthama" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === "Asthama") &&
                        dobyear == selectedOption.value
                      ) {
                        Asthamacount++;
                        Asthamacount1++;
                      } else if (
                        (data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disease1 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease2 === " No disease" ||
                          data[i].Demographic.HouseholdMember[obj][obj1]
                            .Disease3 === " No disease") &&
                        dobyear == selectedOption.value
                      ) {
                        Nodiseasecount++;
                        Nodiseasecount1++;
                      }
                    }
                  }
                }
                diseasedata.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  diseaseanganwadicode: data[i].anganwadicode,
                  diseaseDiabetes: Diabitescount1,
                  diseaseHIV: HIVcount1,
                  diseaseAsthama: Asthamacount1,
                  diseaseNodisease: Nodiseasecount1
                });
              }
              // var Diabitescount = 0;
              // var HIVcount = 0;
              // var Asthamacount = 0;
              // var Nodiseasecount = 0;

              var diseasefilteredarray = Object.values(diseasedata);
              var diseasedatatotables = diseasefilteredarray.map(diseaseel =>
                Object.values(diseaseel)
              );
              this.setState({
                diseasedata: diseasedatatotables
              });
              //
            }

            this.callDataTableDisease();

            var Agriculturecount = 0;
            var HouseWifecount = 0;
            var Teachercount = 0;
            var Paultrycount = 0;
            var Othercount = 0;
            var Designation = "";
            var Literate = "";
            var countUnemployment = 0;

            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Agriculturecount1 = 0;
                var HouseWifecount1 = 0;
                var Teachercount1 = 0;
                var Paultrycount1 = 0;
                var Othercount1 = 0;
                var unemployed1 = 0;

                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);
                      // unemployment code
                      Designation =
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation;
                      Literate =
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate;
                      if (
                        Designation === "UnEmployed" &&
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate !== "illiterate" &&
                        dobyear == selectedOption.value
                      ) {
                        countUnemployment++;
                        unemployed1++;
                      }
                      //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Agriculture" &&
                        dobyear == selectedOption.value
                      ) {
                        Agriculturecount++;
                        Agriculturecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "HouseWife" &&
                        dobyear == selectedOption.value
                      ) {
                        HouseWifecount++;
                        HouseWifecount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Teacher" &&
                        dobyear == selectedOption.value
                      ) {
                        Teachercount++;
                        Teachercount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Poultry" &&
                        dobyear == selectedOption.value
                      ) {
                        Paultrycount++;
                        Paultrycount1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Designation === "Other" &&
                        dobyear == selectedOption.value
                      ) {
                        Othercount++;
                        Othercount1++;
                      }
                    }
                  }
                }

                Occupations.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Occupationanganwadicode: data[i].anganwadicode,
                  Occupation1: Agriculturecount1,
                  Occupation2: HouseWifecount1,
                  Occupation3: Teachercount1,
                  Occupation4: Paultrycount1,
                  Occupation5: Othercount1,
                  Occupation6: unemployed1
                });
              }

              var Occupationfilteredarray = Object.values(Occupations);
              var Occupationtotables = Occupationfilteredarray.map(
                Occupationsel => Object.values(Occupationsel)
              );
              this.setState({
                Occupations: Occupationtotables
              });
            }
            this.callDataTableOccupation();

            //pregnancy code
            var Deliverycount = 0;
            var Nursing = 0;
            var TotalCountFemale = 0;
            for (i = 0; i < data.length; i++) {
              //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Deliverycount1 = 0;
                var Nursing1 = 0;
                var countfemale1 = 0;
                var ebinifitt = 0;
                var ddYear = 0;
                const subdata = data[i].Demographic.Pregnancy;
                const subdata1 = data[i].Maternal.ChildRegistration;
                for (let index in subdata1) {
                  //today code

                  if (subdata1[index].ebenifit) {
                    ebinifitt = subdata1[index].ebenifit;

                    ddYear = ebinifitt.substring(0, 4);
                    console.log(ebinifitt, "ebinifitt count here");
                    var GivenDate = ebinifitt;
                    var CurrentDate = new Date();
                    GivenDate = new Date(GivenDate);
                    if (ddYear == selectedOption.value) {
                      Nursing++;
                      Nursing1++;
                      console.log(Nursing1, "nursing count here");
                    }
                  }
                }
                for (let index in subdata) {
                  var str = subdata[index].LPerioddate;
                  // console.log("year", str);

                  var dobyear = str.substring(0, 4);
                  console.log("ddate", dobyear);
                  if (
                    subdata[index].Delivery === "No" &&
                    selectedOption.value == ddYear
                  ) {
                    Deliverycount++;
                    Deliverycount1++;
                  }
                }
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    // console.log(
                    //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                    // );
                    if (
                      data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                      "Female"
                    ) {
                      TotalCountFemale++;
                      countfemale1++;
                    }
                  }
                }
                Pregnancy.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Pregnancyanganwadicode: data[i].anganwadicode,
                  TotalFemale: countfemale1,
                  ExpectantWomen: Deliverycount1,
                  NursingMother: Nursing1
                });
              }
              var Pregnancyfilteredarray = Object.values(Pregnancy);
              var Pregnancytotables = Pregnancyfilteredarray.map(Pregnancyel =>
                Object.values(Pregnancyel)
              );
              this.setState({
                Pregnancy: Pregnancytotables
              });
            }
            this.callDataTablePregnency();

            // Gender
            var countmale = 0;
            var countfemale = 0;
            var total = 0;
            for (i = 0; i < data.length; i++) {
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var countmale1 = 0;
                var countfemale11 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);
                      // console.log(
                      //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                      // );
                      //else
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Male" &&
                        dobyear == selectedOption.value
                      ) {
                        countmale++;
                        countmale1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                          "Female" &&
                        dobyear == selectedOption.value
                      ) {
                        countfemale++;
                        countfemale11++;
                      }
                      total = countfemale11 + countmale1;
                    }
                  }
                }

                Gender.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Genderanganwadicode: data[i].anganwadicode,
                  GenderMale: countmale1,
                  GenderFemale: countfemale11,
                  GenderTotal: total
                });
              }
              var Genderfilteredarray = Object.values(Gender);
              var Gendertotables = Genderfilteredarray.map(Genderel =>
                Object.values(Genderel)
              );
              this.setState({
                Gender: Gendertotables
              });
            }
            this.callDataTableGender();

            // Literacy var LiteracyRate = 0;
            var Illiteratecount = 0;
            var sslc = 0;
            var puc = 0;
            var HighSchool = 0;
            var Graduvated = 0;

            for (i = 0; i < data.length; i++) {
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentsupervisorid &&
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Illiteratecount1 = 0;
                var sslc1 = 0;
                var puc1 = 0;
                var HighSchool1 = 0;
                var Graduvated1 = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE) {
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                      // console.log("year", str);

                      var dobyear = str.substring(0, 4);
                      console.log("dob", dobyear);

                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "SSLC" &&
                        dobyear == selectedOption.value
                      ) {
                        sslc++;
                        sslc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "PUC" &&
                        dobyear == selectedOption.value
                      ) {
                        puc++;
                        puc1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Primary" &&
                        dobyear == selectedOption.value
                      ) {
                        HighSchool++;
                        HighSchool1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "Graduvated" &&
                        dobyear == selectedOption.value
                      ) {
                        Graduvated++;
                        Graduvated1++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .LiteracyRate === "illiterate" &&
                        dobyear == selectedOption.value
                      ) {
                        Illiteratecount++;
                        Illiteratecount1++;
                      }
                    }
                  }
                }
                LiteracyRatio.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  LiteracyRatioanganwadicode: data[i].anganwadicode,
                  HighSchool: HighSchool1,
                  sslc: sslc1,
                  puc: puc1,
                  Graduvated: Graduvated1,
                  Illiterate: Illiteratecount1
                });
              }
              var LiteracyRatiofilteredarray = Object.values(LiteracyRatio);
              var LiteracyRatiototables = LiteracyRatiofilteredarray.map(
                LiteracyRatioel => Object.values(LiteracyRatioel)
              );
              this.setState({
                LiteracyRatio: LiteracyRatiototables
              });
            }

            this.callDataTableLiteracy();

            //Disbality
            var total1 = 0;
            var DisbaledYes = 0;
            var DisbaledNo = 0;

            for (i = 0; i < data.length; i++) {
              if (
                data[i].Demographic &&
                selectedplace === data[i].anganwadidetails.talukname
              ) {
                var Disbaled1Yes = 0;
                var Disbaled1No = 0;
                for (const obj in data[i].Demographic.HouseholdMember) {
                  for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                    if (data[i].Demographic.HouseholdMember[obj][obj1].DOE)
                      var str =
                        data[i].Demographic.HouseholdMember[obj][obj1].DOE;
                    // console.log("year", str);

                    var dobyear = str.substring(0, 4);
                    {
                      if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "Yes" &&
                        dobyear == selectedOption.value
                      ) {
                        DisbaledYes++;
                        Disbaled1Yes++;
                      } else if (
                        data[i].Demographic.HouseholdMember[obj][obj1]
                          .Disability === "No" &&
                        dobyear == selectedOption.value
                      ) {
                        DisbaledNo++;
                        Disbaled1No++;
                      }
                    }
                    total1 = Disbaled1Yes + Disbaled1No;
                  }
                }
                Disability.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Disabilityanganwadicode: data[i].anganwadicode,
                  Disabled: Disbaled1Yes,
                  DisabledNo: Disbaled1No,
                  Total1: total1
                });
              }
              var Disabilityfilteredarray = Object.values(Disability);
              var Disabilitytotables = Disabilityfilteredarray.map(
                Disabilityel => Object.values(Disabilityel)
              );
              this.setState({
                Disability: Disabilitytotables
              });
            }
            this.callDataTableDisabled();

            //Income of The familiy

            var Ten = 0;
            var Twentyfive = 0;
            var Fifty = 0;
            var TotalHousesChart = 0;
            var Lakh = 0;
            var Income = "";

            for (i = 0; i < data.length; i++) {
              var TotalHouse = 0;
              if (
                // data[i].anganwadidetails.cdpo_acdpo === currentcdpo &&
                data[i].Demographic
              ) {
                var Ten1 = 0;
                var Twentyfive1 = 0;
                var Fifty1 = 0;
                var TotalHousesChart1 = 0;
                var Lakh1 = 0;
                for (const obj in data[i].Demographic.HouseHold) {
                  console.log("Total Houses", TotalHouse);

                  Income = data[i].Demographic.HouseHold[obj].Income;
                  if (Income < 11000) {
                    Ten++;
                    Ten1++;
                  } else if (Income >= 11000 && Income < 35000) {
                    Twentyfive++;
                    Twentyfive1++;
                  } else if (Income >= 35000 && Income < 100000) {
                    Fifty++;
                    Fifty1++;
                  } else if (Income > 100000) {
                    Lakh++;
                    Lakh1++;
                  }

                  if (
                    data[i].Demographic.HouseHold[obj].HHNumber !== undefined
                  ) {
                    TotalHouse++;
                  }
                  //
                }

                Incomes.push({
                  //donot delete the below comment
                  //  ...childSnapshot.val(),
                  Incomesanganwadicode: data[i].anganwadicode,
                  TotalHouses: TotalHouse,
                  TenT: Ten1,
                  TwentyfiveT: Twentyfive1,
                  FiftyT: Fifty1,
                  LakhT: Lakh1
                });
              }
              var Incomesfilteredarray = Object.values(Incomes);
              var Incomestotables = Incomesfilteredarray.map(Incomesel =>
                Object.values(Incomesel)
              );
              this.setState({
                Incomes: Incomestotables
              });
            }
            this.callDataTableIncome();

            this.setState({
              Diabitescount: Diabitescount,
              HIVcount: HIVcount,
              Asthamacount: Asthamacount,
              Nodiseasecount: Nodiseasecount,
              Agriculturecount: Agriculturecount,
              HouseWifecount: HouseWifecount,
              Teachercount: Teachercount,
              Paultrycount: Paultrycount,
              Othercount: Othercount,
              UnEmployed: countUnemployment,
              expectantwomencount: Deliverycount,
              NursingMothercount: Nursing,
              countmale: countmale,
              countfemale: countfemale,
              TCount: TotalCountFemale,
              value1: HighSchool,
              value2: sslc,
              value3: puc,
              value4: Graduvated,
              value5: Illiteratecount,
              Disableded: DisbaledYes,
              D: DisbaledNo,
              Incomea: Ten,
              Incomeb: Twentyfive,
              Incomec: Fifty,
              Incomed: Lakh
            });
          })

          .catch(e => {
            console.log("error returned - ", e);
          });
      }

      // console.log("Not All places");
    }
    // place code
    // var currentsupervisorid = this.props.user.uid;
  };

  //handle table
  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });

  // function

  callDataTableDisease() {
    console.log("calling");
    if (!this.diseaseel) return;
    this.$diseaseel = $(this.diseaseel);
    this.$diseaseel.DataTable({
      data:
        this.state.diseasedata === ""
          ? "No data available"
          : this.state.diseasedata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Diabetes" },
        { title: "HIV" },
        { title: "Asthama" },
        { title: "Nodisease" }
      ],
      ordering: false,
      destroy: true
    });
  }

  callDataTableLiteracy() {
    if (!this.LiteracyRatioel) return;
    this.$LiteracyRatioel = $(this.LiteracyRatioel);
    this.$LiteracyRatioel.DataTable({
      data:
        this.state.LiteracyRatio === ""
          ? "No data available"
          : this.state.LiteracyRatio,
      columns: [
        { title: "Anganwadi Code" },
        { title: "High School" },
        { title: "Sslc" },
        { title: "Puc" },
        { title: "Graduvated" },
        { title: "Illiterate" }
      ],
      ordering: false,
      destroy: true
    });
  }

  //Ocuupation

  callDataTableOccupation() {
    if (!this.Occupationsel) return;
    this.$Occupationsel = $(this.Occupationsel);
    this.$Occupationsel.DataTable({
      data:
        this.state.Occupations === ""
          ? "No data available"
          : this.state.Occupations,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Agriculture" },
        { title: "Housewife" },
        { title: "Teacher" },
        { title: "Poultry" },
        { title: "Others" },
        { title: "Unemployed" }
      ],
      ordering: false,
      destroy: true
    });
  }

  // Expectant women && Nursing Mohter

  callDataTablePregnency() {
    if (!this.Pregnancyel) return;
    this.$Pregnancyel = $(this.Pregnancyel);
    this.$Pregnancyel.DataTable({
      data:
        this.state.Pregnancy === ""
          ? "No data available"
          : this.state.Pregnancy,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Female" },
        { title: "Expectant Women" },
        { title: "Nursing Mother" }
      ],
      ordering: false,
      destroy: true
    });
  }
  //Gender
  callDataTableGender() {
    if (!this.Genderel) return;
    this.$Genderel = $(this.Genderel);
    this.$Genderel.DataTable({
      data: this.state.Gender === "" ? "No data available" : this.state.Gender,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Male" },
        { title: "Female" },
        { title: "Total" }
      ],
      ordering: false,
      destroy: true
    });
  }
  //Literacy

  callDataTableDisabled() {
    if (!this.Disabilityel) return;
    this.$Disabilityel = $(this.Disabilityel);
    this.$Disabilityel.DataTable({
      data:
        this.state.Disability === ""
          ? "No data available"
          : this.state.Disability,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Disabled" },
        { title: "No" },
        { title: "Total" }
      ],
      ordering: false,
      destroy: true
    });
  }

  //Income

  callDataTableIncome() {
    if (!this.Incomesel) return;
    this.$Incomesel = $(this.Incomesel);
    this.$Incomesel.DataTable({
      data:
        this.state.Incomes === "" ? "No data available" : this.state.Incomes,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Total Number of  Houses" },
        { title: "Below 11 Thoushand" },
        { title: "Between 11 to 35   Thoushand" },
        { title: "Between 35 Thoushand to  1 Lakh" },
        { title: "above 1 Lakh" }
      ],
      ordering: false,
      destroy: true
    });
  }
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
        {/* {console.log(
          this.state.selecteddatatypeoption.value,
          this.state.selectedTableoption.value
        )} */}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Disease rates in households" ? (
          <div>
            <br />
            Places
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={diseaseel => (this.diseaseel = diseaseel)}
            />
          </div>
        ) : null}

        {/* this.callDataTableDisease(); */}
        <br />
        {/* Disease rates in households*/}
        {this.state.selectedchartoption.value ===
          "Disease rates in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Place
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Disease rates in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [" Diabetes ", this.state.Diabitescount],
                ["HIV", this.state.HIVcount],
                [" Asthama", this.state.Asthamacount],
                ["  No disease", this.state.Nodiseasecount]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}

        {/*occupation */}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Occupations in households" ? (
          <div>
            <br />
            Place
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={Occupationsel => (this.Occupationsel = Occupationsel)}
            />
          </div>
        ) : null}

        {/* Occupations in households */}
        {this.state.selectedchartoption.value === "Occupations in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Place
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Occupations in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              width={"100%"}
              height={"100%"}
              chartType="BarChart"
              chartPackages={["corechart", "controls"]}
              loader={<div>Loading Chart</div>}
              data={[
                ["Name", "Occupation"],
                ["Agriculture", parseInt(this.state.Agriculturecount)],
                ["Housewife", parseInt(this.state.HouseWifecount)],
                ["Teacher", parseInt(this.state.Teachercount)],
                ["Poultry", parseInt(this.state.Paultrycount)],
                ["Other", parseInt(this.state.Othercount)]
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
            />
          </div>
        ) : null}

        {/* Expectant women's in households */}
        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Expectant women's in households" ? (
          <div>
            Place
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <br />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={Pregnancyel => (this.Pregnancyel = Pregnancyel)}
            />
          </div>
        ) : null}

        {this.state.selectedchartoption.value ===
          "Expectant women's in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            Place
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Expectant women's in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["Title", "Value"],
                ["Number of expectant women's", this.state.expectantwomencount],
                ["Number of Nursing Mother :", this.state.NursingMothercount],
                [" Total Number of Females:", this.state.TCount]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}

        {/*Sex ratio in households*/}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Sex ratio in households" ? (
          <div>
            Place
            <br />
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <br />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={Genderel => (this.Genderel = Genderel)}
            />
          </div>
        ) : null}
        {this.state.selectedchartoption.value === "Sex ratio in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Sex ratio in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Male", this.state.countmale],
                ["Female", this.state.countfemale]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}

        {/*Literacy rate*/}
        {this.state.selectedchartoption.value ===
          "Literacy rate in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Literacy rate in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["HighSchool", this.state.value1],
                ["SSLC", this.state.value2],
                ["puc", this.state.value3],
                ["Graduvated", this.state.value4]
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
          "Literacy rate in households" ? (
          <div>
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <br />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={LiteracyRatioel => (this.LiteracyRatioel = LiteracyRatioel)}
            />
          </div>
        ) : null}

        {/*Disablity*/}
        {this.state.selectedchartoption.value === "Disability in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Disability in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["HighSchool", this.state.Disableded],
                ["SSLC", this.state.D]
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
        this.state.selectedTableoption.value === "Disability in households" ? (
          <div>
            Places
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <br />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={Disabilityel => (this.Disabilityel = Disabilityel)}
            />
          </div>
        ) : null}

        {/*Income of the family*/}
        {this.state.selectedchartoption.value === "Income rate in households" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            Income rate in households
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              width={"800px"}
              height={"400px"}
              chartType="PieChart"
              loader={<div>Loading Chart</div>}
              data={[
                ["Income", "Range"],
                ["below 11 Thoushand", this.state.Incomea],
                ["Between  11 Thoushand to 35000", this.state.Incomeb],
                ["Between  35 Thoushand to 1 Lakh", this.state.Incomec],
                ["above 1 Lakh", this.state.Incomed]
              ]}
              options={{
                title: "HouseHold Income Chart"
                //sliceVisibilityThreshold: 0.2, // 20%
              }}
            />
          </div>
        ) : null}

        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value === "Income rate in households" ? (
          <div>
            Place
            <Select
              value={this.state.selectedOptionplace}
              onChange={this.handleChangePlace}
              options={this.state.optionplace}
            />
            <br />
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <br />
            <table
              id="diseasetable"
              className="display"
              width="100%"
              ref={Incomesel => (this.Incomesel = Incomesel)}
            />
          </div>
        ) : null}

        <br />
      </CEO_DD_DCLayout>
    );
  }
}

