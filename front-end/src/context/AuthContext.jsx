import React, { createContext, useState, useEffect } from "react";

import { getTokens, refreshTokens, urlAPI, userBase } from "../utils/utils";
import ButtonLoading from "../UI/Buttons/ButtonLoading";

export const AuthContext = createContext();

const AuthProvider = (props) => {
  const [user, setUser] = useState(userBase);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tokens = getTokens();

    if (!tokens.expired) {
      const getUser = async (tokens) => {
        const result = await fetch(urlAPI + "users/login/", {
          method: "GET",
          headers: {
            "Content-Type": "application/ json",
            Authorization: "Bearer " + tokens.access,
          },
        });

        const data = await result.json();

        if (!result.ok) {
          const refreshed = await refreshTokens(
            result.statusText,
            tokens.refresh
          );
          if (refreshed) getUser(getTokens());
          else setReady(true);

          return;
        } else {
          setUser(data);
          setReady(true);
        }
      };

      getUser(tokens);
    } else setReady(true);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {ready ? (
        props.children
      ) : (
        <ButtonLoading loading>Cargando...</ButtonLoading>
      )}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
