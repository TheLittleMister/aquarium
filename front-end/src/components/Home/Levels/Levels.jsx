import React from "react";
import { Container, Stack, Box } from "@mui/material";

import Level from "./Level/Level";

import classes from "./Levels.module.css";

import { information } from "./LevelsInfo";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";

const Levels = () => {
  return (
    <Box className={classes.levels}>
      <Container>
        <ChipPrimary label="NIVELES" />
        <br />
        <br />
        <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={2}>
          {information.map((item, index) => (
            <Level
              key={index}
              index={index}
              title={item.title}
              text={item.text}
              Icon={item.Icon}
              levels={item.levels}
            />
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default Levels;
