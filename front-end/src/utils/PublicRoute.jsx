import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { getTokens } from "./utils";

const PublicRoute = (props) => {
  const tokens = getTokens();

  return tokens.expired ? (
    <Outlet />
  ) : (
    <Navigate replace to={props.redirectPath} />
  );
};

export default PublicRoute;
