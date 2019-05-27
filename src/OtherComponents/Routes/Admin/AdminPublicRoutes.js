import React from "react";
import { Route, Redirect } from "react-router-dom";

const AdminPublicRoutes = ({ user, component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      component={props =>
        rest.restricted ? (
          user ? (
            <Redirect to="/admin/admindashboard" />
          ) : (
            <Comp {...props} user={user} />
          )
        ) : (
          <Comp {...props} user={user} />
        )
      }
    />
  );
};

export default AdminPublicRoutes;
