import React from "react";
import Assessment from "@material-ui/icons/Assessment";
import Location from "@material-ui/icons/AddLocationOutlined";
import SubLocation from "@material-ui/icons/AddLocation";
import GroupAdd from "@material-ui/icons/GroupAdd";
import PersonAdd from "@material-ui/icons/PersonAdd";

const data = {
  menus: [
    {
      text: "DashBoard",
      icon: <Assessment />,
      link: "/admin/admindashboard"
    },
    {
      text: "Add details",
      icon: <Location />,
      // link: "/table",
      subMenus: [
        {
          text: "Add Taluka",
          icon: <SubLocation />,
          link: "/admin/taluka"
        },
        {
          text: "Add Villages",
          icon: <SubLocation />,
          link: "/admin/village"
        },
        {
          text: "Add A.W.C.Place",
          icon: <SubLocation />,
          link: "/admin/awcplace"
        }
      ]
    },
    {
      text: "Add authorities",
      icon: <GroupAdd />,
      // link: "/admin",
      subMenus: [
        {
          text: "Add CEO/DD/DC",
          icon: <PersonAdd />,
          link: "/admin/ceodcdd"
        }
      ]
    }
  ]
};

export default data;
