import React, { useContext } from "react";

import { AuthContext } from "../../context/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import Panel from "../../UI/Panels/Panel";
import Profile from "./Profile/Profile";
import Courses from "./Courses/Courses";
import Levels from "./Levels/Levels";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PoolIcon from "@mui/icons-material/Pool";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

const Student = () => {
  const authCtx = useContext(AuthContext);

  const tabs = [
    {
      options: {
        icon: <AccountCircleIcon />,
        iconPosition: "top",
        label: "Perfil",
      },
      link: "/student/profile",
    },
    {
      options: {
        icon: <PoolIcon />,
        iconPosition: "top",
        label: "Clases",
      },
      link: "/student/courses",
    },
    {
      options: {
        icon: <EmojiEventsIcon />,
        iconPosition: "top",
        label: "Niveles",
      },
      link: "/student/levels",
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
        path="courses/*"
        element={
          <Panel tab={1} {...panelOptions}>
            <Courses />
          </Panel>
        }
      />
      <Route
        path="levels/*"
        element={
          <Panel tab={2} {...panelOptions}>
            <Levels />
          </Panel>
        }
      />

      <Route path="*" element={<Navigate replace to="courses/" />} />
    </Routes>
  );
};

export default Student;
