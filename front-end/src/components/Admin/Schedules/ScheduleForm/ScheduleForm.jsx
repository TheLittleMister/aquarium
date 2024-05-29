import React, { useState, useContext } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Form from "../../../../UI/Forms/Form";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../UI/Modals/ModalUI";
import { getTokens, refreshTokens, urlAPI } from "../../../../utils/utils";
import { AuthContext } from "../../../../context/AuthContext";

const ScheduleForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [weekday, setWeekday] = useState("");
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const scheduleFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    const result = await fetch(urlAPI + `courses/schedules/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access,
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();
    if (result.status === 401) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );

      if (refreshed) scheduleFormHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
    } else {
      props.setReload(true);
      props.setOpen(false);
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>Crear Horario</ModalTitle>
      <Form
        onSubmit={scheduleFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={"Crear"}
      >
        <FormControl variant="filled" sx={{ width: "25rem" }}>
          <InputLabel id="demo-simple-select-label">
            Dia de la semana
          </InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={weekday}
            label="type"
            onChange={(e) => setWeekday(e.target.value)}
            name="weekday"
            sx={{
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "transparent",
              },
            }}
          >
            <MenuItem value={1}>Lunes</MenuItem>
            <MenuItem value={2}>Martes</MenuItem>
            <MenuItem value={3}>Miércoles</MenuItem>
            <MenuItem value={4}>Jueves</MenuItem>
            <MenuItem value={5}>Viernes</MenuItem>
            <MenuItem value={6}>Sábado</MenuItem>
            <MenuItem value={7}>Domingo</MenuItem>
          </Select>
        </FormControl>
        <Stack
          direction="row"
          gap={2}
          flexWrap="wrap"
          justifyContent="center"
          alignItems="center"
        >
          <Box>
            <InputLabel>Hora Inicio:</InputLabel>
            <TextField
              id="outlined-start-input"
              // label="start"
              name="start_time"
              type="time"
              autoComplete="current-start"
              // defaultValue={props.course.start_time}
            />
          </Box>
          <Box>
            <InputLabel>Hora Termina:</InputLabel>
            <TextField
              id="outlined-end-input"
              // label="end"
              name="end_time"
              type="time"
              autoComplete="current-end"
              // defaultValue={props.course.end_time}
            />
          </Box>
        </Stack>
      </Form>
    </ModalUI>
  );
};

export default ScheduleForm;
