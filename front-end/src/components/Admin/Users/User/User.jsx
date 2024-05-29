import React, { useContext, useEffect, useState } from "react";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PoolIcon from "@mui/icons-material/Pool";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";

import { AuthContext } from "../../../../context/AuthContext";
import {
  Route,
  Routes,
  Navigate,
  useParams,
  useLocation,
} from "react-router-dom";
import Panel from "../../../../UI/Panels/Panel";
import { getTokens, refreshTokens, urlAPI } from "../../../../utils/utils";
import Profile from "./Profile/Profile";
import Courses from "./Courses/Courses";
import Levels from "./Levels/Levels";
import ButtonLoading from "../../../../UI/Buttons/ButtonLoading";

const User = ({ setClosePath }) => {
  const params = useParams();
  const { state } = useLocation();
  const authCtx = useContext(AuthContext);
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState({});

  let tabs = [
    {
      options: {
        icon: <AccountCircleIcon />,
        iconPosition: "top",
        label: "Perfil",
      },
      link: `/admin/users/${params.username}/profile/`,
    },
  ];

  if (user.type === "Estudiante") {
    tabs.push(
      ...[
        {
          options: {
            icon: <PoolIcon />,
            iconPosition: "top",
            label: "Clases",
          },
          link: `/admin/users/${params.username}/courses/`,
        },
        {
          options: {
            icon: <EmojiEventsIcon />,
            iconPosition: "top",
            label: "Niveles",
          },
          link: `/admin/users/${params.username}/levels/`,
        },
      ]
    );
  }

  useEffect(() => {
    const getUser = async () => {
      const tokens = getTokens();
      const result = await fetch(
        urlAPI +
          `users/user/?username=${params.username ? params.username : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokens.access,
          },
        }
      );

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );
        if (refreshed) getUser();
        return;
      }

      setUser(data);

      if (state) setClosePath(state.previousPath);
      setReady(true);
    };

    getUser();
  }, [params.username, authCtx.setUser, state, setClosePath]);

  const panelOptions = {
    tabs,
    user,
    setUser,
  };

  return !ready ? (
    <ButtonLoading loading>Cargando Usuario</ButtonLoading>
  ) : (
    <Routes>
      <Route
        path="profile/*"
        element={
          <Panel tab={0} {...panelOptions}>
            <Profile user={user} setUser={setUser} />
          </Panel>
        }
      />

      {user.type === "Estudiante" && (
        <>
          <Route
            path="courses/*"
            element={
              <Panel tab={1} {...panelOptions}>
                <Courses />
              </Panel>
            }
          />
          <Route
            path="levels/"
            element={
              <Panel tab={2} {...panelOptions}>
                <Levels studentID={user.studentID} />
              </Panel>
            }
          />
        </>
      )}

      <Route
        path="*"
        element={
          <Navigate
            replace
            to={user.type === "Estudiante" ? "courses/" : "profile/"}
          />
        }
      />
    </Routes>
  );
};

export default User;
