import React, { useEffect, useState } from "react";
import { Box, Stack } from "@mui/material";
import ButtonSecondary from "../../../../../UI/Buttons/ButtonSecondary";

// import EditIcon from "@mui/icons-material/Edit";
// import { Link } from "react-router-dom";
import LevelsForm from "./LevelsForm/LevelsForm";
import Level from "./Level/Level";
import { getTokens, refreshTokens, urlAPI } from "../../../../../utils/utils";
import { AuthContext } from "../../../../../context/AuthContext";
import ChipPrimary from "../../../../../UI/Chips/ChipPrimary";

const Levels = (props) => {
  const authCtx = useState(AuthContext);
  const [open, setOpen] = useState(false);
  const [levels, setLevels] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getStudentLevels = async () => {
      const tokens = getTokens();

      const result = await fetch(
        urlAPI + `levels/studentLevel/?studentID=${props.studentID}`,
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

    if (reload) setReload(false);
  }, [authCtx.setUser, props.studentID, reload]);

  return (
    <>
      <LevelsForm
        open={open}
        setOpen={setOpen}
        studentID={props.studentID}
        setReload={setReload}
      />
      <Box textAlign="center" p={3}>
        {/* <Link to="edit/"> */}
        <ButtonSecondary onClick={() => setOpen(true)}>
          Activar Nivel
        </ButtonSecondary>
        {/* </Link> */}
      </Box>
      <br />
      <ChipPrimary label="PRINCIPIANTE" sx={{ m: 2 }} />
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {levels
          .filter((item) => item.level__category === 1)
          .map((item, index) => (
            <Level
              key={index}
              level={item}
              studentID={props.studentID}
              setReload={setReload}
            />
          ))}
      </Stack>
      <ChipPrimary label="INTERMEDIO" sx={{ m: 2 }} />
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {levels
          .filter((item) => item.level__category === 2)
          .map((item, index) => (
            <Level
              key={index}
              level={item}
              studentID={props.studentID}
              setReload={setReload}
            />
          ))}
      </Stack>
      <ChipPrimary label="AVANZADO" sx={{ m: 2 }} />
      <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
        {levels
          .filter((item) => item.level__category === 3)
          .map((item, index) => (
            <Level
              key={index}
              level={item}
              studentID={props.studentID}
              setReload={setReload}
            />
          ))}
      </Stack>
    </>
  );
};

export default Levels;
