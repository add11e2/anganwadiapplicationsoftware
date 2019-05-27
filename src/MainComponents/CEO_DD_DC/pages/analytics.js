import React, { Component } from "react";
import CEO_DD_DCLayout from "../../../OtherComponents/Layout/CEO_DD_DCLayout";
import { Link } from "react-router-dom";
import firebase from "../../../Firebase";
import { Rnd } from "react-rnd";
import Chart from "react-google-charts";
import ShowChart from "@material-ui/icons/ShowChart";
import Typography from "@material-ui/core/Typography";
import ArrowForward from "@material-ui/icons/ArrowForward";
const style = {
  display: "inline",
  alignItems: "center",
  justifyContent: "center",
  verticalAlign: "center",
  border: "solid 2px #3a3633",
  background: "#e9e9e9"
};

export default class cdpoacdpo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mappanelheight: "40%",
      mappanelwidth: "70%",
      bubblepanelheight: "30%",
      bubblepanelwidth: "30%"
    };
  }
  render() {
    return (
      <CEO_DD_DCLayout>
        <Rnd
          style={style}
          default={{
            x: 250,
            y: 0,
            width: "" + this.state.mappanelwidth + "",
            height: "" + this.state.mappanelheight + ""
          }}
          onResizeStop={(e, direction, ref, delta, position) => {
            this.setState({
              mappanelheight: ref.offsetHeight,
              mappanelwidth: ref.offsetWidth
            });
          }}
        >
          <div
            style={{
              backgroundColor: "#3a3633",
              color: "#e9e9e9",
              lineHeight: "-1.5"
            }}
          >
            {" "}
            <Typography style={{ color: "#e9e9e9", fontSize: 13 }}>
              &nbsp;
              <ShowChart style={{ color: "#e9e9e9", fontSize: 10 }} /> &nbsp;
              GEO LOCATION CHART
            </Typography>
          </div>
          <Chart
            width="100%"
            height="97.5%"
            chartType="GeoChart"
            options={this.state.options}
            data={[
              ["Country", "Popularity"],
              ["Germany", 200],
              ["United States", 300],
              ["Brazil", 400],
              ["Canada", 500],
              ["France", 600],
              ["RU", 700]
            ]}
            // style={"position: 'absolute',overflow:auto "}
            // Note: you will need to get a mapsApiKey for your project.
            // See: https://developers.google.com/chart/interactive/docs/basic_load_libs#load-settings
            mapsApiKey="YOUR_KEY_HERE"
            rootProps={{ "data-testid": "1" }}
          />
        </Rnd>
        <Rnd
          style={style}
          default={{
            x: 250,
            y: 400,
            width: "" + this.state.bubblepanelwidth + "",
            height: "" + this.state.bubblepanelheight + ""
          }}
          onResize={(e, direction, ref, delta, position) => {
            this.setState({
              mappanelheight: ref.offsetHeight,
              mappanelwidth: ref.offsetWidth
            });
          }}
        >
          <div
            style={{
              backgroundColor: "#3a3633",
              color: "#e9e9e9",
              lineHeight: "-1.5"
            }}
          >
            {" "}
            <Typography style={{ color: "#e9e9e9", fontSize: 13 }}>
              &nbsp;
              <ShowChart style={{ color: "#e9e9e9", fontSize: 10 }} /> &nbsp;
              BUBBLE CHART
            </Typography>
          </div>
          <Chart
            width="100%"
            height="96.3%"
            chartType="BubbleChart"
            loader={<div>Loading Chart</div>}
            data={[
              ["ID", "X", "Y", "Temperature"],
              ["", 80, 167, 120],
              ["", 79, 136, 130],
              ["", 78, 184, 50],
              ["", 72, 278, 230],
              ["", 81, 200, 210],
              ["", 72, 170, 100],
              ["", 68, 477, 80]
            ]}
            options={{
              colorAxis: { colors: ["yellow", "red"] }
            }}
            rootProps={{ "data-testid": "2" }}
          />
        </Rnd>
      </CEO_DD_DCLayout>
    );
  }
}
