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
      link: "/ceodddc/ceodddcdashboard"
    },
    {
      text: "Analytics Dashboard"
    },
    {
      text: "District level",
      icon: <InsertChart />,

      // link: "/table",
      subMenus: [
        {
          text: "Timeline",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/district/timeline"
        },
        {
          text: "Infrastructure",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/district/infrastructure"
        },
        {
          text: "Demographics",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/district/demographics"
        },
        {
          text: "Maternal &\n Child Nutrition",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/district/maternal_child"
        }
      ]
    },
    {
      text: "Taluk level",
      icon: <InsertChart />,

      // link: "/table",
      subMenus: [
        {
          text: "Timeline",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/taluk/timeline"
        },
        {
          text: "Infrastructure",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/taluk/infrastructure"
        },
        {
          text: "Demographics",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/taluk/demographics"
        },
        {
          text: "Maternal &\n Child Nutrition",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/taluk/maternal_child"
        }
      ]
    },
    {
      text: "Village level",
      icon: <InsertChart />,

      // link: "/table",
      subMenus: [
        {
          text: "Timeline",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/village/timeline"
        },
        {
          text: "Infrastructure",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/village/infrastructure"
        },
        {
          text: "Demographics",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/village/demographics"
        },
        {
          text: "Maternal &\n Child Nutrition",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/village/maternal_child"
        }
      ]
    },
    {
      text: "Awc place level",
      icon: <InsertChart />,

      // link: "/table",
      subMenus: [
        {
          text: "Timeline",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/awcplace/timeline"
        },
        {
          text: "Infrastructure",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/awcplace/infrastructure"
        },
        {
          text: "Demographics",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/awcplace/demographics"
        },
        {
          text: "Maternal &\n Child Nutrition",
          icon: <SubLocation />,
          link: "/ceodddc/analyticsdashboardceodddc/awcplace/maternal_child"
        }
      ]
    },

    {
      text: "Map DashBoard"
    },
    {
      text: "District Map",
      icon: <InsertChart />,
      link: "/ceodddc/mapdashboardceodddc"
    },
    {
      text: "Add authorities",
      icon: <GroupAdd />,
      // link: "/admin",
      subMenus: [
        {
          text: "Add CDPO/ACDPO",
          icon: <PersonAdd />,
          link: "/ceodddc/cdpoacdpo"
        }
      ]
    }
  ]
};

export default data;
