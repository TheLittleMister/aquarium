import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  IconButton,
  Stack,
  Tooltip,
  Typography as Text,
} from "@mui/material";

import * as styles from "./SchedulesStyles";
import SchedulesTable from "./SchedulesTable/SchedulesTable";

import EditIcon from "@mui/icons-material/Edit";
import PriceForm from "./PriceForm/PriceForm";
import { getTokens, refreshTokens, urlAPI, fixPrice } from "../../../utils/utils";
import { AuthContext } from "../../../context/AuthContext";
import ButtonSecondary from "../../../UI/Buttons/ButtonSecondary";
import ScheduleForm from "./ScheduleForm/ScheduleForm";

const Schedules = () => {
  const authCtx = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [openSchedule, setOpenSchedule] = useState(false);
  const [price, setPrice] = useState(0);
  const [schedules, setSchedules] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getSchedules = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + `courses/schedules/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
      });

      const data = await result.json();

      if (!result.ok) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getSchedules();
        return;
      }

      setPrice(data.price);
      setSchedules(data.schedules);
    };

    getSchedules();

    if (reload) setReload(false);
  }, [authCtx.setUser, reload]);

  return (
    <Box flex={1} sx={styles.schedulesBox}>
      <PriceForm
        open={open}
        setOpen={setOpen}
        price={price}
        setPrice={setPrice}
      />
      <ScheduleForm
        open={openSchedule}
        setOpen={setOpenSchedule}
        setReload={setReload}
      />
      <Text
        variant="h5"
        fontWeight={600}
        color="blue.light"
        textAlign={"center"}
        sx={styles.schedulesTitle}
      >
        Horarios y Costo
      </Text>
      <Box p={3} sx={styles.cost}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-around"
          flexWrap="wrap"
        >
          <Text variant="h6">
            Mensualidad: ${fixPrice(price)}{" "}
            <Tooltip title="Editar Precio">
              <IconButton onClick={() => setOpen(true)}>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Text>
          <ButtonSecondary onClick={() => setOpenSchedule(true)}>
            Crear Horario
          </ButtonSecondary>
        </Stack>
        <br />
        <SchedulesTable schedules={schedules} setReload={setReload} />
      </Box>
    </Box>
  );
};

export default Schedules;
