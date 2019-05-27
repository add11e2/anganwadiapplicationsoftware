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
    value: "Food Consumption in anganwadi's",
    label: "Food Consumption in anganwadi's"
  },
  {
    value: "Anganwadi's currently using this application",
    label: "Anganwadi's currently using this application"
  },
  {
    value: "Beneficieries of food services",
    label: "Beneficieries of food services"
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
export default class supervisoranalytics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedOption: "",
      selectedchartoption: "",
      currentsupervisorid: "",
      yearselectedfromdropdown: 0,
      stockdata: [],
      selectedTableoption: "",
      selecteddatatypeoption: ""
    };
  }
  componentWillMount() {
    let stockdata = [];
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
        var totalsalt = 0;
        var totalwheat = 0;
        var i;
        for (i = 0; i < data.length; i++) {
          if (
            // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].Timeline
          ) {
            const subdata = data[i].Timeline.DailyUsageStock;
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
              totaljaggery = +parseFloat(subdata[index].jaggery);
              totalmustard_seeds =
                totalmustard_seeds + parseFloat(subdata[index].mustard_seeds);
              totaloil = totaloil + parseFloat(subdata[index].oil);
              totalrice = totalrice + parseFloat(subdata[index].rice);
              totalwheat = totalwheat + parseFloat(subdata[index].wheat);
              totalsalt = totalsalt + parseFloat(subdata[index].salt);
              //}
            }
          }
          if (
            // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
            data[i].Timeline
          ) {
            // console.log(data[i].anganwadicode, data[i].Timeline);
            const subdata = data[i].Timeline.DailyUsageStock;

            for (let index in subdata) {
              stockdata.push({
                //donot delete the below comment
                //  ...childSnapshot.val(),
                stockanganwadicode: data[i].anganwadicode,
                DPickdobStock: subdata[index].DPickdobStock,
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
                food_provided_today: subdata[index].food_provided_today
              });
            }
          }
        }
        var stockfilteredarray = Object.values(stockdata);

        var stockdatatotables = stockfilteredarray.map(stockel =>
          Object.values(stockel)
        );
        console.log(stockdatatotables, "hello");
        this.setState({
          stockdata: stockdatatotables
        });
      });
  }
  componentDidUpdate() {
    this.callDataTableStock();
  }
  handleChange = selectedchartoption => this.setState({ selectedchartoption });

  // handleChange2 = e => {
  //   console.log(e.value);
  //   var currentsupervisorid = this.props.user.uid;

  //   console.log(currentsupervisorid, "currentsupervisorid");
  //   firebase
  //     .database()
  //     .ref(`users`)
  //     .once("value")
  //     .then(snapshot => {
  //       var count = 0;
  //       const data = firebaseLooper(snapshot);
  //       var totalamalice_rich = 0;
  //       var totalchilli = 0;
  //       var totalegg = 0;
  //       var totalgrams = 0;
  //       var totalgreen_gram = 0;
  //       var totaljaggery = 0;
  //       var totalmustard_seeds = 0;
  //       var totaloil = 0;
  //       var totalrice = 0;
  //       var totalsalt = 0;
  //       var i;

  //       for (i = 0; i < data.length; i++) {
  //         if (data[i].anganwadidetails.supervisorid === currentsupervisorid) {
  //           const subdata = data[i].Timeline.DailyUsageStock;
  //           for (let index in subdata) {
  //             var stockadddate = new Date(subdata[index].DPickdobStock);
  //             var comparestockadddate = stockadddate.getFullYear();
  //             console.log(comparestockadddate, "comparestockadddate");
  //             if (comparestockadddate === e.value) {
  //               console.log("hello-----------------------------------------");
  //               totalamalice_rich = subdata[index].amalice_rich;
  //               totalchilli = subdata[index].chilli;
  //               totalegg = subdata[index].egg; //converts into kg * 0.001
  //               totalgrams = subdata[index].grams;
  //               totalgreen_gram = subdata[index].green_gram;
  //               totaljaggery = subdata[index].jaggery;
  //               totalmustard_seeds = subdata[index].mustard_seeds;
  //               totaloil = subdata[index].oil;
  //               totalrice = subdata[index].rice;
  //               totalsalt = subdata[index].salt;
  //             }
  //           }
  //         }
  //       }
  //       if (data !== null) {
  //         this.setState({
  //           yearselectedfromdropdown: 1,
  //           totalamalice_rich: totalamalice_rich,
  //           totalchilli: totalchilli,
  //           totalegg: totalegg,
  //           totalgrams: totalgrams,
  //           totalgreen_gram: totalgreen_gram,
  //           totaljaggery: totaljaggery,
  //           totalmustard_seeds: totalmustard_seeds,
  //           totaloil: totaloil,
  //           totalrice: totalrice,
  //           totalsalt: totalsalt
  //         });
  //       }
  //     })
  //     .catch(e => {
  //       console.log("error returned - ", e);
  //     });
  // };

  //handleChangeYear;

  handleChangeYear = selectedOption => {
    let stockdata = [];
    var currentsupervisorid = this.props.user.uid;
    this.setState({ selectedOption });
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
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Timeline
            ) {
              const subdata = data[i].Timeline.DailyUsageStock;
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
                totaljaggery = +parseFloat(subdata[index].jaggery);
                totalmustard_seeds =
                  totalmustard_seeds + parseFloat(subdata[index].mustard_seeds);
                totaloil = totaloil + parseFloat(subdata[index].oil);
                if (subdata[index].rice != undefined) {
                  totalrice = totalrice + parseInt(subdata[index].rice);
                }
                if (subdata[index].wheat != undefined) {
                  totalwheat = totalwheat + parseInt(subdata[index].wheat);
                }

                totalsalt = totalsalt + parseFloat(subdata[index].salt);
                //}
              }
            }
          }

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
            if (
              // data[i].anganwadidetails.supervisorid === currentsupervisorid &&
              data[i].Timeline
            ) {
              const subdata = data[i].Timeline.DailyUsageStock;

              for (let index in subdata) {
                // if (
                //   subdata[index].DPickdobStock.getFullYear() ===
                //   this.state.selectedyearoption.value
                // ) {
                var str = subdata[index].DPickdobStock;
                var dobyear = str.substring(0, 4);
                if (dobyear == selectedOption.value) {
                  totalamalice_rich =
                    totalamalice_rich + parseInt(subdata[index].amalice_rich);
                  totalchilli = totalchilli + parseInt(subdata[index].chilli);
                  totalegg = totalegg + parseInt(subdata[index].egg); //converts into kg * 0.001
                  totalgrams = totalgrams + parseInt(subdata[index].grams);
                  totalgreen_gram =
                    totalgreen_gram + parseInt(subdata[index].green_gram);
                  totaljaggery = +parseInt(subdata[index].jaggery);
                  totalmustard_seeds =
                    totalmustard_seeds + parseInt(subdata[index].mustard_seeds);
                  totaloil = totaloil + parseInt(subdata[index].oil);
                  if (subdata[index].rice != undefined) {
                    totalrice = totalrice + parseInt(subdata[index].rice);
                  }
                  if (subdata[index].wheat != undefined) {
                    totalwheat = totalwheat + parseInt(subdata[index].wheat);
                  }
                  totalsalt = totalsalt + parseInt(subdata[index].salt);
                  //}
                }
              }
            }
          }

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
  };

  handleChangeTable = selectedTableoption =>
    this.setState({ selectedTableoption });
  handleChange = selectedchartoption => this.setState({ selectedchartoption });
  handleChangedatatype = selecteddatatypeoption =>
    this.setState({ selecteddatatypeoption });

  handleChange2 = selectedyeartoption => this.setState({ selectedyeartoption });

  callDataTableStock() {
    // if (this.state.stockdata != null) {
    console.log(this.state.stockdata, "this.state.stockdata");
    if (!this.foodstockel) return;
    this.$foodstockel = $(this.foodstockel);
    this.$foodstockel.DataTable({
      data: this.state.stockdata,
      columns: [
        { title: "Anganwadi Code" },
        { title: "Date" },
        { title: "Amalice Rich (Kgs)" },
        { title: "Mustard seeds (Kgs)" },
        { title: "Grams (Kgs)" },
        { title: "Chilli (Kgs)" },
        { title: "Jaggery (Kgs)" },
        { title: "Rice (Kgs)" },
        { title: "Wheat (Kgs)" },
        { title: "Salt (Kgs)" },
        { title: "Oil (Litres)" },
        { title: "Green Grams (Kgs)" },
        { title: "Eggs (Kgs)" },
        { title: "Food Provided Today" }
      ]
      //  ordering: false
    });
    //}
  }
  render() {
    console.log(this.state.totalrice);
    console.log(this.state.totalwheat);
    return (
      <CEO_DD_DCLayout>
        <h3 style={globalStyles.navigation}>
          Application / Add ceo/dd/dc Analytics Dashboard(Timeline)
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
        {console.log(
          this.state.selecteddatatypeoption.value,
          this.state.selectedTableoption.value
        )}
        {this.state.selecteddatatypeoption.value === "Table" &&
        this.state.selectedTableoption.value ===
          "Food Consumption in anganwadi's" ? (
          <table
            className="display"
            width="100%"
            ref={foodstockel => (this.foodstockel = foodstockel)}
          />
        ) : null}

        {this.state.selectedchartoption.value ===
          "Food Consumption in anganwadi's" &&
        this.state.selecteddatatypeoption.value === "Chart" ? (
          <div>
            {" "}
            {/* <Select
              onChange={e => this.handleChange2(e)}
              value={this.state.selectedyeartoption}
              options={yearselectoptions}
            /> */}
            <Select
              value={this.state.selectedOption}
              onChange={this.handleChangeYear}
              options={options}
            />
            <Chart
              width={"500px"}
              height={"300px"}
              chartType="BarChart"
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
              options={{
                title: " Food Consumption in kgs,litres",
                width: 600,
                height: 400,
                bars: "vertical",
                bar: { groupWidth: "95%" },
                legend: { position: "none" }
              }}
              // For tests
              rootProps={{ "data-testid": "6" }}
            />
          </div>
        ) : null}

        <br />
      </CEO_DD_DCLayout>
    );
  }
}
