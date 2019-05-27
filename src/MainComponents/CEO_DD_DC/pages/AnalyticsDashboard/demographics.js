import "../../../../Resources/Css/jquery.dataTables.css";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import CEO_DD_DCLayout from "../../../../OtherComponents/Layout/CEO_DD_DCLayout";
import { Link } from "react-router-dom";
import firebase from "../../../../Firebase";
import plusImage from "../../../../Resources/Images/elements/plus_button.png";
import globalStyles from "../../../styles";
import Chart from "react-google-charts";
import Select from "react-select"; // v 1.3.0
import "react-select/dist/react-select.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";

const $ = require("jquery");
$.DataTable = require("datatables.net-dt");

require("datatables.net-dt");
require("datatables.net-autofill-dt");
require("datatables.net-buttons-dt");
require("datatables.net-buttons/js/buttons.colVis.js");
require("datatables.net-buttons/js/buttons.flash.js");
require("datatables.net-buttons/js/buttons.html5.js");
require("datatables.net-buttons/js/buttons.print.js");

$(document).ready(function() {
  $("#diseasetable").DataTable({
    dom: "Bfrtip",
    buttons: ["copy", "csv", "excel", "pdf", "print"]
  });
});

// require("datatables.net-buttons")(window, $);
// require("datatables.net-buttons/js/buttons.print.js")(window, $);
// require("datatables.net-buttons/js/buttons.colVis.js")(window, $);
let options = [];
let index = 1;
options[0] = {};
options[0].value = "All";
options[0].label = "All";

const dt1 = new Date();
const year = dt1.getFullYear() - 10;
for (let i = dt1.getFullYear(); i > year; i--) {
  options[index] = {};
  options[index].value = i;
  options[index].label = i;
  index++;
}
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
export default class supervisoranalyticsmaternalchild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      selectedTableoption: "",
      currentsupervisorid: "",
      selecteddatatypeoption: "",
      diseasedata: []
    };
  }
  componentDidUpdate() {
    this.callDataTableDisease();
  }
  componentWillMount() {
    let diseasedata = [];
    var currentsupervisorid = this.props.user.uid;
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
          //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
          if (data[i].Demographic) {
            var Diabitescount1 = 0;
            var HIVcount1 = 0;
            var Asthamacount1 = 0;
            var Nodiseasecount1 = 0;
            for (const obj in data[i].Demographic.HouseholdMember) {
              for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                // console.log(
                //   data[i].Demographic.HouseholdMember[obj][obj1].Disease1
                // );
                console.log(data[i].Demographic.HouseholdMember[obj][obj1]);
                if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "Diabetes" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "Diabetes" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "Diabetes"
                ) {
                  Diabitescount++;
                  Diabitescount1++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "HIV" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "HIV" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "HIV"
                ) {
                  HIVcount++;
                  HIVcount1++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "Asthama" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "Asthama" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    "Asthama"
                ) {
                  Asthamacount++;
                  Asthamacount1++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    " No disease" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    " No disease" ||
                  data[i].Demographic.HouseholdMember[obj][obj1].Disease1 ===
                    " No disease"
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

        var Agriculturecount = 0;
        var HouseWifecount = 0;
        var Teachercount = 0;
        var Paultrycount = 0;
        var Othercount = 0;
        for (i = 0; i < data.length; i++) {
          //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
          if (data[i].Demographic) {
            for (const obj in data[i].Demographic.HouseholdMember) {
              for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                //console.log(data[i].Demographic.HouseholdMember[obj][obj1].sex);
                if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Designation ===
                  "Agriculture"
                ) {
                  Agriculturecount++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Designation ===
                  "HouseWife"
                ) {
                  HouseWifecount++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Designation ===
                  "Teacher"
                ) {
                  Teachercount++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Designation ===
                  "Paultry"
                ) {
                  Paultrycount++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].Designation ===
                  "Other"
                ) {
                  Othercount++;
                }
              }
            }
          }
        }
        var Deliverycount = 0;
        for (i = 0; i < data.length; i++) {
          //data[i].anganwadidetails.supervisorid === currentsupervisorid &&
          if (data[i].Demographic) {
            const subdata = data[i].Demographic.Pregnancy;
            for (let index in subdata) {
              if (subdata[index].Delivery === "No") {
                Deliverycount++;
              }
            }
          }
        }
        var countmale = 0;
        var countfemale = 0;
        for (i = 0; i < data.length; i++) {
          // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
          if (data[i].Demographic) {
            for (const obj in data[i].Demographic.HouseholdMember) {
              for (const obj1 in data[i].Demographic.HouseholdMember[obj]) {
                // console.log(
                //   data[i].Demographic.HouseholdMember[obj][obj1].Status
                // );
                if (
                  data[i].Demographic.HouseholdMember[obj][obj1].sex === "Male"
                ) {
                  countmale++;
                } else if (
                  data[i].Demographic.HouseholdMember[obj][obj1].sex ===
                  "Female"
                ) {
                  countfemale++;
                }
              }
            }
          }
        }
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
          expectantwomencount: Deliverycount,
          countmale: countmale,
          countfemale: countfemale
        });
      })

      .catch(e => {
        console.log("error returned - ", e);
      });
  }

  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });

  callDataTableDisease() {
    if (!this.diseaseel) return;
    this.$diseaseel = $(this.diseaseel);
    this.$diseaseel.DataTable({
      data: this.state.diseasedata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Diabetes" },
        { title: "HIV" },
        { title: "Asthama" },
        { title: "Nodisease" }
      ],
      ordering: false
    });
  }
  render() {
    console.log(this.state.diseasedata);
    // console.log(this.state.selectedchartoption);
    return (
      <CEO_DD_DCLayout>
        <h3 style={globalStyles.navigation}>
          Application / Add ceo/dd/dc Analytics Dashboard (Demographics)
        </h3>

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
        {console.log(
          this.state.selecteddatatypeoption.value,
          this.state.selectedTableoption.value
        )}
        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Disease rates in households" ? (
          <div>
            <br />
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
            Disease rates in households
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
        {/* Occupations in households */}
        {this.state.selectedchartoption.value ===
        "Occupations in households" ? (
          <div>
            {" "}
            Occupations in households
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                ["Agriculture ", this.state.Agriculturecount],
                ["HouseWife", this.state.HouseWifecount],
                ["Teacher", this.state.Teachercount],
                ["Paultry", this.state.Paultrycount],
                ["Other", this.state.Othercount]
              ]}
              options={pieOptions}
              graph_id="PieChart"
              width={"100%"}
              height={"400px"}
              legend_toggle
            />
          </div>
        ) : null}
        {/* Expectant women's in households */}
        {this.state.selectedchartoption.value ===
        "Expectant women's in households" ? (
          <div>
            {" "}
            Expectant women's in households
            <Chart
              chartType="PieChart"
              data={[
                ["Title", "Value"],
                ["Number of expectant women's", this.state.expectantwomencount]
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
        {this.state.selectedchartoption.value === "Sex ratio in households" ? (
          <div>
            {" "}
            Sex ratio in households
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
        <br />
      </CEO_DD_DCLayout>
    );
  }
}
