import React, { useEffect, useState, useContext } from "react";
import { Stack } from "@mui/material";

import Level from "./Level/Level";
import { getTokens, refreshTokens, urlAPI } from "../../../utils/utils";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";
import { AuthContext } from "../../../context/AuthContext";

const Levels = () => {
  const authCtx = useContext(AuthContext);
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const getStudentLevels = async () => {
      const tokens = getTokens();

      const result = await fetch(
        urlAPI + `levels/studentLevel/?studentID=${authCtx.user.studentID}`,
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

        if (refreshed) getStudentLevels();
        return;
      }

      setLevels(data.studentLevels);
    };

    getStudentLevels();
  }, [authCtx.setUser, authCtx.user.studentID]);

  return (
    <>
      <br />
      <ChipPrimary label="PRINCIPIANTE" sx={{ m: 2 }} />
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {levels
          .filter((item) => item.level__category === 1)
          .map((item, index) => (
            <Level key={index} level={item} />
          ))}
      </Stack>
      <ChipPrimary label="INTERMEDIO" sx={{ m: 2 }} />
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {levels
          .filter((item) => item.level__category === 2)
          .map((item, index) => (
            <Level key={index} level={item} />
          ))}
      </Stack>
      <ChipPrimary label="AVANZADO" sx={{ m: 2 }} />
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {levels
          .filter((item) => item.level__category === 3)
          .map((item, index) => (
            <Level key={index} level={item} />
          ))}
      </Stack>
    </>
  );
};

export default Levels;
