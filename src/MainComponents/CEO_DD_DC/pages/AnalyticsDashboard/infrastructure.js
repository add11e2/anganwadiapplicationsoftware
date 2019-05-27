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

const chartselectoptions = [
  {
    value: "Medicine kit Facility in Anganwadi's",
    label: "Medicine kit Facility in Anganwadi's"
  },
  {
    value: "Playground Facility in Anganwadi's",
    label: "Playground Facility in Anganwadi's"
  },
  {
    value: "Toilet Facility in Anganwadi's",
    label: "Toilet Facility in Anganwadi's"
  },
  {
    value: "Power Facility in Anganwadi's",
    label: "Power Facility in Anganwadi's"
  },
  { value: "Weighing scale for infant", label: "Weighing scale for infant" },
  { value: "Weighing scale for mother", label: "Weighing scale for mother" },
  { value: "Building Type", label: "Building Type" },
  {
    value: "Water Facility in Anganwadi's",
    label: "Water Facility in Anganwadi's"
  }
];
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
export default class supervisoranalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedchartoption: "",
      currentsupervisorid: "",
      selectedTableoption: "",
      selecteddatatypeoption: "",
      selectedchartoption: "",
      infradata: []
    };
  }
  componentWillMount() {
    var currentsupervisorid = this.props.user.uid;
    let infradata = [];
    console.log(currentsupervisorid);
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
    firebase
      .database()
      .ref(`users`)
      .once("value")
      .then(snapshot => {
        var count = 0;
        const data = firebaseLooper(snapshot);

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
        for (i = 0; i < data.length; i++) {
          //if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
        for (i = 0; i < data.length; i++) {
          //   if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
          //  }
        }
        for (i = 0; i < data.length; i++) {
          // if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
          // }
        }
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
          //  }
        }

        for (i = 0; i < data.length; i++) {
          //   if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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

        for (i = 0; i < data.length; i++) {
          //if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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

        for (i = 0; i < data.length; i++) {
          //  if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
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
        console.log(infradatatotables, "hello");
        this.setState({
          infradata: infradatatotables
        });
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
          Infra_medicine_No: medicinecountNo
        });
      })
      .catch(e => {
        console.log("error returned - ", e);
      });
  }
  componentDidUpdate() {
    this.callDataTableInfra();
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
      ]
      //  ordering: false
    });
    //}
  }
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
          Application / Add ceo/dd/dc Analytics Dashboard(Infrastructure)
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
          <table
            className="display"
            width="100%"
            ref={infrael => (this.infrael = infrael)}
          />
        ) : null}
        <br />
        {/* Water facility */}
        {this.state.selectedchartoption.value ===
        "Water Facility in Anganwadi's" ? (
          <div>
            {" "}
            Number of Anganwadi's with Water Facility
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
        {/* Building Type */}
        {this.state.selectedchartoption.value === "Building Type" ? (
          <div>
            {" "}
            <div>
              Number of Anganwadi's with different building types <br />
            </div>
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

        {/* Weighing scale for infant*/}
        {this.state.selectedchartoption.value ===
        "Weighing scale for infant" ? (
          <div>
            {" "}
            <div>
              Weighing scale for infant <br />
            </div>
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

        {/* Weighing scale for mother*/}
        {this.state.selectedchartoption.value ===
        "Weighing scale for mother" ? (
          <div>
            {" "}
            <div>
              Weighing scale for mother <br />
            </div>
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
        {/* Power Facility in Anganwadi's */}
        {this.state.selectedchartoption.value ===
        "Power Facility in Anganwadi's" ? (
          <div>
            {" "}
            <div>
              Power Facility in Anganwadi's <br />
            </div>
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Anganwadi's with Power Facility",
                  this.state.Infra_power_Yes
                ],
                [
                  "Number of Anganwadi's without Power Facility",
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
        {/* Toilet Facility in Anganwadi's */}
        {this.state.selectedchartoption.value ===
        "Toilet Facility in Anganwadi's" ? (
          <div>
            {" "}
            <div>
              Toilet Facility in Anganwadi's <br />
            </div>
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Anganwadi's with Toilet Facility",
                  this.state.Infra_toilet_Yes
                ],
                [
                  "Number of Anganwadi's without Toilet Facility",
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
        {/* Playground Facility in Anganwadi's */}
        {this.state.selectedchartoption.value ===
        "Playground Facility in Anganwadi's" ? (
          <div>
            {" "}
            <div>
              Playground Facility in Anganwadi's <br />
            </div>
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Anganwadi's with Playground Facility",
                  this.state.Infra_play_Yes
                ],
                [
                  "Number of Anganwadi's without Playground Facility",
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
        {/* Medicine kit Facility in Anganwadi's */}
        {this.state.selectedchartoption.value ===
        "Medicine kit Facility in Anganwadi's" ? (
          <div>
            {" "}
            <div>
              Medicine kit Facility in Anganwadi's <br />
            </div>
            <Chart
              chartType="PieChart"
              data={[
                ["title", "value"],
                [
                  "Number of Anganwadi's with Medicine-kit Facility",
                  this.state.Infra_medicine_Yes
                ],
                [
                  "Number of Anganwadi's without Medicine-kit Facility",
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
        <br />
      </CEO_DD_DCLayout>
    );
  }
}
