import React from "react";

import HeroTitle from "./HeroTitle/HeroTitle";
import HeroImages from "./HeroImages/HeroImages";

import { Box, Container, Stack } from "@mui/material";

import * as styles from "./HeroStyles";

const Hero = () => {
  return (
    <Box sx={styles.hero}>
      <Container>
        <Stack sx={styles.stack}>
          <HeroTitle />
          <HeroImages />
        </Stack>
      </Container>
    </Box>
  );
};

export default Hero;
