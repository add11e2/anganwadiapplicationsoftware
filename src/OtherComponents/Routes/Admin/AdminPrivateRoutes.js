import React from "react";
import { Route, Redirect } from "react-router-dom";

const AdminPrivateRoutes = ({ user, component: Comp, ...rest }) => {
  return (
    <Route
      {...rest}
      component={props =>
        user ? <Comp {...props} user={user} /> : <Redirect to="/admin/login" />
      }
    />
  );
};

export default AdminPrivateRoutes;
