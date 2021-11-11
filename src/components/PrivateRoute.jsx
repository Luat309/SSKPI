import { PERMISSION_MENU } from "constants/appPath";
import React from "react";
import { Redirect, Route } from "react-router";
import ForBiddenPage from "./ForbiddenPage";
// import { isLogin } from "../services/authenticate";

const isLogin = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return Boolean(currentUser?.email && currentUser?.accessToken);
};

const PrivateRoute = (props) => {
  const pathName = window.location.pathname;

  const findPermission = PERMISSION_MENU.find((item) => item.path === pathName);

  const {
    user: { role },
  } = JSON.parse(localStorage.getItem("currentUser"));

  if (findPermission) {
    const check = findPermission.role.indexOf(role);
    if (check === -1) {
      props = {
        ...props,
        component: ForBiddenPage,
      };
    }
  }

  console.log(props);

  return isLogin() ? <Route {...props} /> : <Redirect to="/login" />;
};

export default React.memo(PrivateRoute);
