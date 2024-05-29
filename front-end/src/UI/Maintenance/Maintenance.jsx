import { Box, Stack, Typography as Text } from "@mui/material";
import React, { useLayoutEffect, useState } from "react";

import logo from "../Logo/logo.png";
import classes from "./Maintenance.module.css";

import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";

function Maintenance({ setMaintenance }) {
  const [countDown, setCountDown] = useState("");

  useLayoutEffect(() => {
    const countDownDate = new Date("May 31, 2024 23:59:59").getTime();

    const interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = countDownDate - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setCountDown(days + "d " + hours + "h " + minutes + "m " + seconds + "s");

      if (distance < 0) {
        clearInterval(interval);
        setMaintenance(false);
      }
    }, 1000);
  }, [setMaintenance]);

  return (
    <Stack
      justifyContent={"center"}
      alignContent={"center"}
      alignItems={"center"}
      height="100vh"
      className={classes.maintenance}
      gap={0.5}
    >
      <Box>
        <img
          src={logo}
          style={{ maxWidth: "30rem" }}
          alt="Aquarium School Logo"
        />
      </Box>
      <Stack direction={"row"} gap={1} flexWrap={"wrap"}>
        <AutoFixHighIcon sx={{ color: "blue.font" }} />
        <Text>EN MANTENIMIENTO</Text>
      </Stack>
      <Text>{countDown}</Text>
    </Stack>
  );
}

export default Maintenance;
