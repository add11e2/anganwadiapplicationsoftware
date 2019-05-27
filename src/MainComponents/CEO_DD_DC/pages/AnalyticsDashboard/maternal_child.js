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
const $ = require("jquery");
$.DataTable = require("datatables.net");
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
export default class supervisoranalyticsmaternalchild extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      currentsupervisorid: "",
      selectedOption: "",
      childsexratiodata: [],
      selectedTableoption: "",
      selecteddatatypeoption: ""
    };
  }
  componentWillMount() {}

  callDataTableChildSexRatio() {
    // if (this.state.stockdata != null) {
    // console.log(this.state.childsexratiodata, "this.state.stockdata");
    if (!this.childsexratioel) return;
    this.$childsexratioel = $(this.childsexratioel);
    this.$childsexratioel.DataTable({
      dom: "lBfrtip",
      buttons: ["excel", "pdf", "print"],
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

  handleChangeYear = selectedOption => {
    this.setState({ selectedOption });
    var currentsupervisorid = this.props.user.uid;
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
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                if (subdata[index].option === "Male") {
                  gendercountMale++;
                } else if (subdata[index].option === "Female") {
                  gendercountFemale++;
                }
              }
            }
            childsexrationdata.push({
              childsexanganwadicode: data[i].anganwadicode,
              Male: gendercountMale,
              Female: gendercountFemale
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
          this.callDataTableChildSexRatio();

          //child mortality

          for (i = 0; i < data.length; i++) {
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Maternal
            ) {
              const subdata = data[i].Maternal.ChildRegistration;
              for (let index in subdata) {
                if (subdata[index].status === "Born") {
                  borncount++;
                } else if (subdata[index].status === "Died") {
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
                if (subdata[index].health === "healthy") {
                  healthy++;
                } else if (subdata[index].health === "unhealthy") {
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
    console.log(this.state.selectedchartoption);
    return (
      <CEO_DD_DCLayout>
        <h3 style={globalStyles.navigation}>
          Application / Add ceo/dd/dc Analytics Dashboard (Maternal & Child)
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
        <br />
      </CEO_DD_DCLayout>
    );
  }
}
