import React from "react";
import { Route, Redirect } from "react-router-dom";

const HomePublicRoutes = ({ user, component: Comp, ...rest }) => {
  return (
    <Route {...rest} component={props => <Comp {...props} user={user} />} />
  );
};

export default HomePublicRoutes;
