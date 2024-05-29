import React, { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import ButtonPrimary from "../../../UI/Buttons/ButtonPrimary";
import LevelsForm from "./LevelsForm/LevelsForm";
import { getTokens, refreshTokens, urlAPI } from "../../../utils/utils";
import { AuthContext } from "../../../context/AuthContext";
import AccordionLevels from "./AccordionLevels/AccordionLevels";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";

const Levels = (props) => {
  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getLevels = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + `levels/level/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
      });

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getLevels();
        return;
      }

      setLevels(data.levels);
    };

    getLevels();

    if (reload) setReload(false);
  }, [authCtx.setUser, reload]);

  return (
    <>
      <LevelsForm open={open} setOpen={setOpen} setReload={setReload} />
      <Box textAlign="center" p={2}>
        <ButtonPrimary onClick={() => setOpen(true)}>Crear Nivel</ButtonPrimary>
      </Box>
      <Box>
        <ChipPrimary label="PRINCIPIANTE" sx={{ m: 2 }} />
        <AccordionLevels
          levels={levels.filter((item) => item.category === 1)}
          setReload={setReload}
        />
      </Box>
      <Box>
        <ChipPrimary label="INTERMEDIO" sx={{ m: 2 }} />
        <AccordionLevels
          levels={levels.filter((item) => item.category === 2)}
          setReload={setReload}
        />
      </Box>
      <Box>
        <ChipPrimary label="AVANZADO" sx={{ m: 2 }} />
        <AccordionLevels
          levels={levels.filter((item) => item.category === 3)}
          setReload={setReload}
        />
      </Box>
    </>
  );
};

export default Levels;
