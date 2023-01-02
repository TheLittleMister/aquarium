import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Outlet, Navigate } from "react-router-dom";
import { getTokens } from "./utils";

const PrivateRoute = (props) => {
  const authCtx = useContext(AuthContext);
  let authenticated = false;

  const tokens = getTokens();
  if (!tokens.expired && authCtx.user.type === props.type) authenticated = true;

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate replace to={props.redirectPath} />
  );
};

export default PrivateRoute;
