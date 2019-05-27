import React from "react";
import { Switch, Route } from "react-router-dom";
import MainLayout from "./OtherComponents/Common/MainLayout";

//HOME COMPONENT
import Home from "./MainComponents/Home";
import HomePublicRoute from "./OtherComponents/Routes/Home/HomePublicRoute";

//ADMIN COMPONENT
//components
import AdminLogin from "./OtherComponents/Login/Admin";
import AdminDash from "./MainComponents/Admin";
//AdminRoutes
import AdminPublicRoute from "./OtherComponents/Routes/Admin/AdminPublicRoutes";
import AdminPrivateRoute from "./OtherComponents/Routes/Admin/AdminPrivateRoutes";

//Admin-pages
//Admin-pages-taluka
import AdminTaluka from "./MainComponents/Admin/pages/taluka";
import AdmintalukaEdit from "./MainComponents/Admin/pages/taluka/Edit";
import AdmintalukaCreate from "./MainComponents/Admin/pages/taluka/Create";
import AdmintalukaShow from "./MainComponents/Admin/pages/taluka/Show";

//Admin-pages-village
import AdminVillage from "./MainComponents/Admin/pages/village";
import AdminvillageEdit from "./MainComponents/Admin/pages/village/Edit";
import AdminvillageCreate from "./MainComponents/Admin/pages/village/Create";
import AdminvillageShow from "./MainComponents/Admin/pages/village/Show";

//Admin-pages-awcplace
import Adminawcplace from "./MainComponents/Admin/pages/awcplace";
import AdminawcplaceEdit from "./MainComponents/Admin/pages/awcplace/Edit";
import AdminawcplaceCreate from "./MainComponents/Admin/pages/awcplace/Create";
import AdminawcplaceShow from "./MainComponents/Admin/pages/awcplace/Show";

//Admin-pages-ceodcdd cdodcdd
import AdminCEODCDD from "./MainComponents/Admin/pages/ceo_dc_dd";
import AdminCEODCDDEdit from "./MainComponents/Admin/pages/ceo_dc_dd/Edit";
import AdminCEODCDDCreate from "./MainComponents/Admin/pages/ceo_dc_dd/Create";
import AdminCEODCDDShow from "./MainComponents/Admin/pages/ceo_dc_dd/Show";

//CEO/DD/DC COMPONENT
//components
import CEO_DD_DCLogin from "./OtherComponents/Login/CEO_DD_DC";
import CEO_DD_DCDash from "./MainComponents/CEO_DD_DC";
//CEO/DD/DC Routes
import CEO_DD_DCPublicRoute from "./OtherComponents/Routes/CEO_DD_DC/CEO_DD_DCPublicRoutes";
import CEO_DD_DCPrivateRoute from "./OtherComponents/Routes/CEO_DD_DC/CEO_DD_DCPrivateRoutes";

import CEO_DD_DC_AD_AWCPLACE_infrastructure from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Awcplacelevel/infrastructure";
import CEO_DD_DC_AD_AWCPLACE_maternal_child from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Awcplacelevel/maternal_child";
import CEO_DD_DC_AD_AWCPLACE_demographics from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Awcplacelevel/demographics";
import CEO_DD_DC_AD_AWCPLACE_timeline from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Awcplacelevel/timeline";

import CEO_DD_DC_AD_TALUK_infrastructure from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Taluklevel/infrastructure";
import CEO_DD_DC_AD_TALUK_maternal_child from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Taluklevel/maternal_child";
import CEO_DD_DC_AD_TALUK_demographics from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Taluklevel/demographics";
import CEO_DD_DC_AD_TALUK_timeline from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Taluklevel/timeline";

import CEO_DD_DC_AD_VILLAGE_infrastructure from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Villagelevel/infrastructure";
import CEO_DD_DC_AD_VILLAGE_maternal_child from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Villagelevel/maternal_child";
import CEO_DD_DC_AD_VILLAGE_demographics from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Villagelevel/demographics";
import CEO_DD_DC_AD_VILLAGE_timeline from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Villagelevel/timeline";

import CEO_DD_DC_AD_DISTRICT_infrastructure from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Districtlevel/infrastructure";
import CEO_DD_DC_AD_DISTRICT_maternal_child from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Districtlevel/maternal_child";
import CEO_DD_DC_AD_DISTRICT_demographics from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Districtlevel/demographics";
import CEO_DD_DC_AD_DISTRICT_timeline from "./MainComponents/CEO_DD_DC/pages/AnalyticsDashboard/Districtlevel/timeline";

import CEO_DD_DC_MapDashboard from "./MainComponents/CEO_DD_DC/pages/MapDashboard";

//CEO/DD/DC-pages-cdpoacdpo
import CEO_DD_DC__CDPOACDPO from "./MainComponents/CEO_DD_DC/pages/cdpoacdpo";
import CEO_DD_DC__CDPOACDPOEdit from "./MainComponents/CEO_DD_DC/pages/cdpoacdpo/Edit";
import CEO_DD_DC__CDPOACDPOCreate from "./MainComponents/CEO_DD_DC/pages/cdpoacdpo/Create";
import CEO_DD_DC__CDPOACDPOShow from "./MainComponents/CEO_DD_DC/pages/cdpoacdpo/Show";
//CEO/DD/DC-OPTION
import CEO_DD_DC_OPTION1 from "./MainComponents/CEO_DD_DC/pages/analytics";
import CEO_DD_DC_anganwadi from "./MainComponents/CEO_DD_DC/pages/anganwadidetails";

//CDPO/ACDPO
import CDPO_ACDPOLogin from "./OtherComponents/Login/CDPO_ACDPO";
import CDPO_ACDPODash from "./MainComponents/CDPO_ACDPO";
//CDPO/ACDPO Routes
import CDPO_ACDPOPublicRoute from "./OtherComponents/Routes/CDPO_ACDPO/CDPO_ACDPOPublicRoutes";
import CDPO_ACDPOPrivateRoute from "./OtherComponents/Routes/CDPO_ACDPO/CDPO_ACDPOPrivateRoutes";
//CDPO/ACDPO-pages-supervisor
import CDPO_ACDPO__SUPERVISOR from "./MainComponents/CDPO_ACDPO/pages/supervisor";
import CDPO_ACDPO__SUPERVISORCreate from "./MainComponents/CDPO_ACDPO/pages/supervisor/Create";
import CDPO_ACDPO__SUPERVISORShow from "./MainComponents/CDPO_ACDPO/pages/supervisor/Show";
//CDPO/ACDPO-pages-addassign
import CDPO_ACDPO__addassignawc from "./MainComponents/CDPO_ACDPO/pages/addassignawc";
import CDPO_ACDPO__addassignawcCreate from "./MainComponents/CDPO_ACDPO/pages/addassignawc/Create";
import CDPO_ACDPO__addassignawcShow from "./MainComponents/CDPO_ACDPO/pages/addassignawc/Show";

import CDPO_ACDPO_AD_AWCPLACE_maternal_child from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Awcplacelevel/maternal_child";
import CDPO_ACDPO_AD_AWCPLACE_demographics from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Awcplacelevel/demographics";
import CDPO_ACDPO_AD_AWCPLACE_Infrastructure from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Awcplacelevel/infrastructure";
import CDPO_ACDPO_AD_AWCPLACE_Timeline from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Awcplacelevel/timeline";

import CDPO_ACDPO_AD_TALUK_maternal_child from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Taluklevel/maternal_child";
import CDPO_ACDPO_AD_TALUK_demographics from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Taluklevel/demographics";
import CDPO_ACDPO_AD_TALUK_Infrastructure from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Taluklevel/infrastructure";
import CDPO_ACDPO_AD_TALUK_Timeline from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Taluklevel/timeline";

import CDPO_ACDPO_AD_VILLAGE_maternal_child from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Villagelevel/maternal_child";
import CDPO_ACDPO_AD_VILLAGE_demographics from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Villagelevel/demographics";
import CDPO_ACDPO_AD_VILLAGE_Infrastructure from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Villagelevel/infrastructure";
import CDPO_ACDPO_AD_VILLAGE_Timeline from "./MainComponents/CDPO_ACDPO/pages/AnalyticsDashboard/Villagelevel/timeline";

import CDPO_ACDPO_MapDashboard from "./MainComponents/CDPO_ACDPO/pages/MapDashboard";

//CDPO/ACDPO-pages-assignsupervisor
import CDPO_ACDPO__assignsupervisortoawc from "./MainComponents/CDPO_ACDPO/pages/assignsupervisortoawc";
import CDPO_ACDPO__assignsupervisortoawcCreate from "./MainComponents/CDPO_ACDPO/pages/assignsupervisortoawc/Create";
import CDPO_ACDPO__assignsupervisortoawcShow from "./MainComponents/CDPO_ACDPO/pages/assignsupervisortoawc/Show";
//CDPO/ACDPO-pages-option
import CDPO_ACDPO_OPTION1 from "./MainComponents/CDPO_ACDPO/pages/analytics";
import CDPO_ACDPO_anganwadi from "./MainComponents/CDPO_ACDPO/pages/anganwadidetails";

//SUPERVISOR
import SupervisorLogin from "./OtherComponents/Login/Supervisor";
import SupervisorDash from "./MainComponents/Supervisor";
//SUPERVISOR Routes
import SupervisorPublicRoute from "./OtherComponents/Routes/Supervisor/SupervisorPublicRoutes";
import SupervisorPrivateRoute from "./OtherComponents/Routes/Supervisor/SupervisorPrivateRoutes";

//SUPERVISOR pages add anganwadi worker
import Supervisor_addanganwadiworker from "./MainComponents/Supervisor/pages/addanganwadiworker";
import Supervisor_addanganwadiworkerCreate from "./MainComponents/Supervisor/pages/addanganwadiworker/Create";
import Supervisor_addanganwadiworkerShow from "./MainComponents/Supervisor/pages/addanganwadiworker/Show";
//SUPERVISOR assign worker to center
import Supervisor_assignworkertoawc from "./MainComponents/Supervisor/pages/assignworkertoawc";
import Supervisor_assignworkertoawcCreate from "./MainComponents/Supervisor/pages/assignworkertoawc/Create";
import Supervisor_assignworkertoawcShow from "./MainComponents/Supervisor/pages/assignworkertoawc/Show";
//Supervisor_addanganwadiworker
//supervisor/analyticsdashboard
import supervisor_analytics_infrastructure from "./MainComponents/Supervisor/pages/AnalyticsDashboard/infrastructure";
import supervisor_analytics_maternal_child from "./MainComponents/Supervisor/pages/AnalyticsDashboard/maternal_child";
import supervisor_analytics_demographics from "./MainComponents/Supervisor/pages/AnalyticsDashboard/demographics";
import supervisor_analytics_timeline from "./MainComponents/Supervisor/pages/AnalyticsDashboard/timeline";
import supervisor_MapDashboard from "./MainComponents/Supervisor/pages/MapDashboard";
import request from "./MainComponents/Supervisor/pages/request";
import requestshow from "./MainComponents/Supervisor/pages/request/Show";

import supervisor_anganwadi from "./MainComponents/Supervisor/pages/anganwadidetails";

import firebase from "./Firebase.js";
const Routes = props => {
  return (
    <MainLayout>
      <Switch>
        <AdminPublicRoute
          {...props}
          exact
          restricted={true}
          path="/admin/login"
          component={AdminLogin}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/admindashboard"
          exact
          component={AdminDash}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/taluka"
          exact
          component={AdminTaluka}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/talukaEdit/:id"
          exact
          component={AdmintalukaEdit}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/talukaCreate"
          exact
          component={AdmintalukaCreate}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/talukaShow/:id"
          exact
          component={AdmintalukaShow}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/village"
          exact
          component={AdminVillage}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/villageEdit/:id"
          exact
          component={AdminvillageEdit}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/villageCreate"
          exact
          component={AdminvillageCreate}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/villageShow/:id"
          exact
          component={AdminvillageShow}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/awcplace"
          exact
          component={Adminawcplace}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/awcplaceEdit/:id"
          exact
          component={AdminawcplaceEdit}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/awcplaceCreate"
          exact
          component={AdminawcplaceCreate}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/awcplaceShow/:id"
          exact
          component={AdminawcplaceShow}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/ceodcdd"
          exact
          component={AdminCEODCDD}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/ceodcddEdit/:id"
          exact
          component={AdminCEODCDDEdit}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/ceodcddCreate"
          exact
          component={AdminCEODCDDCreate}
        />
        <AdminPrivateRoute
          {...props}
          path="/admin/ceodcddShow/:id"
          exact
          component={AdminCEODCDDShow}
        />
        <CEO_DD_DCPublicRoute
          {...props}
          exact
          restricted={true}
          path="/ceodddc/login"
          component={CEO_DD_DCLogin}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/ceodddcdashboard"
          exact
          component={CEO_DD_DCDash}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/cdpoacdpo"
          exact
          component={CEO_DD_DC__CDPOACDPO}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/cdpoacdpoEdit/:id"
          exact
          component={CEO_DD_DC__CDPOACDPOEdit}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/cdpoacdpoCreate"
          exact
          component={CEO_DD_DC__CDPOACDPOCreate}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/cdpoacdpoShow/:id"
          exact
          component={CEO_DD_DC__CDPOACDPOShow}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/option1"
          exact
          component={CEO_DD_DC_OPTION1}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/awcplace/infrastructure"
          exact
          component={CEO_DD_DC_AD_AWCPLACE_infrastructure}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/awcplace/maternal_child"
          exact
          component={CEO_DD_DC_AD_AWCPLACE_maternal_child}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/awcplace/demographics"
          exact
          component={CEO_DD_DC_AD_AWCPLACE_demographics}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/awcplace/timeline"
          exact
          component={CEO_DD_DC_AD_AWCPLACE_timeline}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/taluk/infrastructure"
          exact
          component={CEO_DD_DC_AD_TALUK_infrastructure}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/taluk/maternal_child"
          exact
          component={CEO_DD_DC_AD_TALUK_maternal_child}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/taluk/demographics"
          exact
          component={CEO_DD_DC_AD_TALUK_demographics}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/taluk/timeline"
          exact
          component={CEO_DD_DC_AD_TALUK_timeline}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/village/infrastructure"
          exact
          component={CEO_DD_DC_AD_VILLAGE_infrastructure}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/village/maternal_child"
          exact
          component={CEO_DD_DC_AD_VILLAGE_maternal_child}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/village/demographics"
          exact
          component={CEO_DD_DC_AD_VILLAGE_demographics}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/village/timeline"
          exact
          component={CEO_DD_DC_AD_VILLAGE_timeline}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/district/infrastructure"
          exact
          component={CEO_DD_DC_AD_DISTRICT_infrastructure}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/district/maternal_child"
          exact
          component={CEO_DD_DC_AD_DISTRICT_maternal_child}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/district/demographics"
          exact
          component={CEO_DD_DC_AD_DISTRICT_demographics}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/analyticsdashboardceodddc/district/timeline"
          exact
          component={CEO_DD_DC_AD_DISTRICT_timeline}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/mapdashboardceodddc"
          exact
          component={CEO_DD_DC_MapDashboard}
        />
        <CEO_DD_DCPrivateRoute
          {...props}
          path="/ceodddc/anganwadidetails/:id"
          exact
          component={CEO_DD_DC_anganwadi}
        />
        <CDPO_ACDPOPublicRoute
          {...props}
          exact
          restricted={true}
          path="/cdpoacdpo/login"
          component={CDPO_ACDPOLogin}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/cdpoacdpodashboard"
          exact
          component={CDPO_ACDPODash}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/supervisor"
          exact
          component={CDPO_ACDPO__SUPERVISOR}
        />
        {/* <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/supervisorEdit/:id"
          exact
          component={CDPO_ACDPO__SUPERVISOREdit}
        /> */}
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/supervisorCreate"
          exact
          component={CDPO_ACDPO__SUPERVISORCreate}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/supervisorShow/:id"
          exact
          component={CDPO_ACDPO__SUPERVISORShow}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/option1"
          exact
          component={CDPO_ACDPO_OPTION1}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/addassignawc"
          exact
          component={CDPO_ACDPO__addassignawc}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/addassignawcCreate"
          exact
          component={CDPO_ACDPO__addassignawcCreate}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/addassignawcShow/:id"
          exact
          component={CDPO_ACDPO__addassignawcShow}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/assignsupervisortoawc"
          exact
          component={CDPO_ACDPO__assignsupervisortoawc}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/assignsupervisortoawcCreate"
          exact
          component={CDPO_ACDPO__assignsupervisortoawcCreate}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/assignsupervisortoawcShow/:id"
          exact
          component={CDPO_ACDPO__assignsupervisortoawcShow}
        />
        {/* <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboard/infrastructure"
          exact
          component={CDPO_ACDPO_analytics_infrastructure}
        /> */}
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/awcplace/maternal_child"
          exact
          component={CDPO_ACDPO_AD_AWCPLACE_maternal_child}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/awcplace/demographics"
          exact
          component={CDPO_ACDPO_AD_AWCPLACE_demographics}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/awcplace/infrastructure"
          exact
          component={CDPO_ACDPO_AD_AWCPLACE_Infrastructure}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/awcplace/timeline"
          exact
          component={CDPO_ACDPO_AD_AWCPLACE_Timeline}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/village/maternal_child"
          exact
          component={CDPO_ACDPO_AD_VILLAGE_maternal_child}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/village/demographics"
          exact
          component={CDPO_ACDPO_AD_VILLAGE_demographics}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/village/infrastructure"
          exact
          component={CDPO_ACDPO_AD_VILLAGE_Infrastructure}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/village/timeline"
          exact
          component={CDPO_ACDPO_AD_VILLAGE_Timeline}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/taluk/maternal_child"
          exact
          component={CDPO_ACDPO_AD_TALUK_maternal_child}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/taluk/demographics"
          exact
          component={CDPO_ACDPO_AD_TALUK_demographics}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/taluk/infrastructure"
          exact
          component={CDPO_ACDPO_AD_TALUK_Infrastructure}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboardcdpoacdpo/taluk/timeline"
          exact
          component={CDPO_ACDPO_AD_TALUK_Timeline}
        />
        {/* <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboard/demographics"
          exact
          component={CDPO_ACDPO_analytics_demographics}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/analyticsdashboard/timeline"
          exact
          component={CDPO_ACDPO_analytics_timeline}
        /> */}
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/mapdashboard"
          exact
          component={CDPO_ACDPO_MapDashboard}
        />
        <CDPO_ACDPOPrivateRoute
          {...props}
          path="/cdpoacdpo/anganwadidetails/:id"
          exact
          component={CDPO_ACDPO_anganwadi}
        />
        <SupervisorPublicRoute
          {...props}
          exact
          restricted={true}
          path="/supervisor/login"
          component={SupervisorLogin}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/supervisordashboard"
          exact
          component={SupervisorDash}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/addanganwadiworker"
          exact
          component={Supervisor_addanganwadiworker}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/addanganwadiworkerCreate"
          exact
          component={Supervisor_addanganwadiworkerCreate}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/addanganwadiworkerShow/:id"
          exact
          component={Supervisor_addanganwadiworkerShow}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/assignworkertoawc"
          exact
          component={Supervisor_assignworkertoawc}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/assignworkertoawcCreate"
          exact
          component={Supervisor_assignworkertoawcCreate}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/request"
          exact
          component={request}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/requestshow/:awid/:awrid"
          exact
          component={requestshow}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/assignworkertoawcShow/:id"
          exact
          component={Supervisor_assignworkertoawcShow}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/analyticsdashboard/infrastructure"
          exact
          component={supervisor_analytics_infrastructure}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/analyticsdashboard/maternal_child"
          exact
          component={supervisor_analytics_maternal_child}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/analyticsdashboard/demographics"
          exact
          component={supervisor_analytics_demographics}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/analyticsdashboard/timeline"
          exact
          component={supervisor_analytics_timeline}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/mapdashboard"
          exact
          component={supervisor_MapDashboard}
        />
        <SupervisorPrivateRoute
          {...props}
          path="/supervisor/anganwadidetails/:id"
          exact
          component={supervisor_anganwadi}
        />
        supervisor_anganwadi
        <Route path="/" component={Home} />
      </Switch>
    </MainLayout>
  );
};
export default Routes;
