import React, { useContext } from "react";

import Users from "./Users/Users";
import { AuthContext } from "../../context/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import Panel from "../../UI/Panels/Panel";
import Profile from "./Profile/Profile";
import Courses from "./Courses/Courses";
import Levels from "./Levels/Levels";
import Schedules from "./Schedules/Schedules";
import Statistics from "./Statistics/Statistics";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import GroupsIcon from "@mui/icons-material/Groups";
import PoolIcon from "@mui/icons-material/Pool";
import DateRangeIcon from "@mui/icons-material/DateRange";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import InsightsIcon from "@mui/icons-material/Insights";

const Admin = () => {
  const authCtx = useContext(AuthContext);

  const tabs = [
    {
      options: {
        icon: <AccountCircleIcon />,
        iconPosition: "top",
        label: "Perfil",
      },
      link: "/admin/profile",
    },
    {
      options: {
        icon: <GroupsIcon />,
        iconPosition: "top",
        label: "Usuarios",
      },
      link: "/admin/users",
    },
    {
      options: {
        icon: <PoolIcon />,
        iconPosition: "top",
        label: "Clases",
      },
      link: "/admin/courses",
    },
    {
      options: {
        icon: <InsightsIcon />,
        iconPosition: "top",
        label: "Estadísticas",
      },
      link: "/admin/statistics",
    },
    {
      options: {
        icon: <EmojiEventsIcon />,
        iconPosition: "top",
        label: "Niveles",
      },
      link: "/admin/levels",
    },
    {
      options: {
        icon: <DateRangeIcon />,
        iconPosition: "top",
        label: "Costo y Horarios",
      },
      link: "/admin/schedules",
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
      <Route
        path="courses/*"
        element={
          <Panel tab={2} {...panelOptions}>
            <Courses />
          </Panel>
        }
      />
      <Route
        path="statistics/"
        element={
          <Panel tab={3} {...panelOptions}>
            <Statistics />
          </Panel>
        }
      />
      <Route
        path="levels/*"
        element={
          <Panel tab={4} {...panelOptions}>
            <Levels />
          </Panel>
        }
      />
      <Route
        path="schedules/"
        element={
          <Panel tab={5} {...panelOptions}>
            <Schedules />
          </Panel>
        }
      />
      <Route path="*" element={<Navigate replace to="users/" />} />
    </Routes>
  );
};

export default Admin;
