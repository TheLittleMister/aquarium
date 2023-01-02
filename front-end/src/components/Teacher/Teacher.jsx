import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import Panel from "../../UI/Panels/Panel";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";

import Profile from "./Profile/Profile";
import Users from "./Users/Users";

const Teacher = () => {
  const authCtx = useContext(AuthContext);

  const tabs = [
    {
      options: {
        icon: <AccountCircleIcon />,
        iconPosition: "top",
        label: "Perfil",
      },
      link: "/teacher/profile",
    },
    {
      options: {
        icon: <GroupsIcon />,
        iconPosition: "top",
        label: "Usuarios",
      },
      link: "/teacher/users",
    },
  ];

  const panelOptions = {
    tabs,
    user: authCtx.user,
    setUser: authCtx.setUser,
  };

  return (
    <Routes>
      <Route
        path="profile/*"
        element={
          <Panel tab={0} {...panelOptions}>
            <Profile user={authCtx.user} setUser={authCtx.setUser} />
          </Panel>
        }
      />
      <Route
        path="users/*"
        element={
          <Panel tab={1} {...panelOptions}>
            <Users />
          </Panel>
        }
      />

      <Route path="*" element={<Navigate replace to="users/" />} />
    </Routes>
  );
};

export default Teacher;
