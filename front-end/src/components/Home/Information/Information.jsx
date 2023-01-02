import React from "react";

import { Container, Stack, Box } from "@mui/material";

import * as styles from "./InformationStyles";
import classes from "./Information.module.css";

import AboutUs from "./AboutUs/AboutUs";
import Courses from "./Courses/Courses";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";

const Information = () => {
  return (
    <Box className={classes.information} id="info">
      <Container>
        <ChipPrimary label="INFORMACIÓN" />
        <br />
        <br />
        <Stack sx={styles.stack} flexWrap="wrap" gap={2}>
          <AboutUs />
          <Courses />
        </Stack>
      </Container>
    </Box>
  );
};

export default Information;
