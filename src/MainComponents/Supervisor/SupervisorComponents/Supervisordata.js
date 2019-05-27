import React from "react";
import Assessment from "@material-ui/icons/Assessment";
import InsertChart from "@material-ui/icons/InsertChartOutlinedRounded";
import SubLocation from "@material-ui/icons/BarChartOutlined";
import GroupAdd from "@material-ui/icons/GroupAdd";
import PersonAdd from "@material-ui/icons/PersonAdd";

const data = {
  menus: [
    {
      text: "DashBoard",
      icon: <Assessment />,
      link: "/supervisor/supervisordashboard"
    },
    {
      text: "Analytics Dashboard",

      // link: "/table",
      subMenus: [
        {
          text: "Timeline",
          icon: <SubLocation />,
          link: "/supervisor/analyticsdashboard/timeline"
        },
        {
          text: "Infrastructure",
          icon: <SubLocation />,
          link: "/supervisor/analyticsdashboard/infrastructure"
        },
        {
          text: "Demographics",
          icon: <SubLocation />,
          link: "/supervisor/analyticsdashboard/demographics"
        },
        {
          text: "Maternal &\n Child Nutrition",
          icon: <SubLocation />,
          link: "/supervisor/analyticsdashboard/maternal_child"
        }
      ]
    },

    {
      text: "Map DashBoard"
    },
    {
      text: "Map",
      icon: <InsertChart />,
      link: "/supervisor/mapdashboard"
    },
    {
      text: "Add authorities",
      icon: <GroupAdd />,
      // link: "/admin",
      subMenus: [
        {
          text: "Add Anganwadi Worker",
          icon: <PersonAdd />,
          link: "/supervisor/addanganwadiworker"
        }
      ]
    },
    {
      text: "Others",
      icon: <GroupAdd />,
      // link: "/admin",
      subMenus: [
        {
          text: "Assign worker to awc",
          icon: <PersonAdd />,
          link: "/supervisor/assignworkertoawc"
        },
        {
          text: "RequestFromAWC",
          icon: <PersonAdd />,
          link: "/supervisor/request"
        }
      ]
    }
  ]
};

export default data;
