import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography as Text,
} from "@mui/material";
import Form from "../../../../../../UI/Forms/Form";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthContext } from "../../../../../../context/AuthContext";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";

const LevelsForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [level, setLevel] = useState(props.level ? props.level.level__id : "");
  const [date, setDate] = useState(
    props.level ? new Date(props.level.date + " ") : null
  );

  const [levels, setLevels] = useState([]);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState(false);

  useEffect(() => {
    const getLevels = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + `courses/level/`, {
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

        if (refreshed) getLevels();
        return;
      }

      setLevels(data.levels);
    };

    getLevels();

    // if (reload) setReload(false);
  }, [authCtx.setUser]);

  const levelsFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    // if (!Boolean(props.user.username)) return;

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["date"] =
      date && date instanceof Date && !isNaN(date)
        ? date.toISOString().split("T")[0]
        : "";
    dataObj["student"] = props.userID;

    const result = await fetch(
      urlAPI + `courses/studentLevel/?id=${props.level ? props.level.id : ""}`,
      {
        method: props.level ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify(dataObj),
      }
    );

    const data = await result.json();
    if (!result.ok) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );
      if (refreshed) levelsFormHandler(e);
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setCollapseOpen(true);
    } else {
      props.setReload(true);
      props.setOpen(false);
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>{props.level ? "Editar" : "Activar"} Nivel</ModalTitle>
      <Form
        onSubmit={levelsFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={props.level ? "Editar" : "Activar"}
      >
        <Stack gap={2}>
          <FormControl
            variant="filled"
            sx={{
              m: 1,
              minWidth: 160,
              display: props.level ? "none" : "",
            }}
          >
            <InputLabel id="userLevel-select-small">Niveles</InputLabel>
            <Select
              labelId="userLevel-select-small"
              id="userLevel-select-small"
              value={level}
              label="level"
              autoWidth
              onChange={(e) => setLevel(e.target.value)}
              name="level"
              sx={{ backgroundColor: "transparent" }}
            >
              <ListSubheader>Principiante</ListSubheader>

              {levels
                .filter((item) => item.category__id === 1)
                .map((item, index, arr) => (
                  <MenuItem key={index} value={item.id}>
                    <Text>{item.name}</Text>
                  </MenuItem>
                ))}
              <ListSubheader>Intermedio</ListSubheader>
              {levels
                .filter((item) => item.category__id === 2)
                .map((item, index, arr) => (
                  <MenuItem key={index} value={item.id}>
                    <Text>{item.name}</Text>
                  </MenuItem>
                ))}
              <ListSubheader>Avanzado</ListSubheader>
              {levels
                .filter((item) => item.category__id === 3)
                .map((item, index, arr) => (
                  <MenuItem key={index} value={item.id}>
                    <Text>{item.name}</Text>
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          <Box sx={{ width: "25rem" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                name="date"
                inputFormat="dd/MM/yyyy"
                label="Empieza desde:"
                value={date}
                onChange={(newValue) => {
                  setDate(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <TextField
            id="outlined-attendances-input"
            label="Asistencias"
            placeholder="Asistencia Requeridas"
            type="number"
            autoComplete="current-attendances"
            name="attendances"
            required
            defaultValue={props.level ? props.level.attendances : 1}
            // fullWidth
          />
        </Stack>
      </Form>
    </ModalUI>
  );
};

export default LevelsForm;
