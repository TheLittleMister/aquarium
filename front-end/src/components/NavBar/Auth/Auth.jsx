import React, { useContext } from "react";

import { Link, Route, Routes } from "react-router-dom";

import ButtonPrimary from "../../../UI/Buttons/ButtonPrimary";

import LoginIcon from "@mui/icons-material/Login";
import LogInForm from "./AuthForms/LogInForm";
import PublicRoute from "../../../utils/PublicRoute";
import { AuthContext } from "../../../context/AuthContext";

import ProfileMenu from "./ProfileMenu/ProfileMenu";

const Content = () => {
  const authCtx = useContext(AuthContext);

  return !Boolean(authCtx.user.username) ? (
    <Link to="login/" tabIndex={-1}>
      <ButtonPrimary tabIndex={-1} endIcon={<LoginIcon />}>
        Ingresar
      </ButtonPrimary>
    </Link>
  ) : (
    <ProfileMenu />
  );
};

const Auth = () => {
  return (
    <>
      <Content />
      <Routes>
        <Route element={<PublicRoute redirectPath="/" />}>
          <Route path="login/*" element={<LogInForm />} />
        </Route>
      </Routes>
    </>
  );
};

export default Auth;
