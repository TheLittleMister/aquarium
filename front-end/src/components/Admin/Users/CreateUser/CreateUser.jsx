import React, { useState, useContext, useEffect } from "react";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,
  Autocomplete,
} from "@mui/material";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Form from "../../../../UI/Forms/Form";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../UI/Modals/ModalUI";

import * as styles from "./CreateUserStyles";

import { urlAPI, getTokens, refreshTokens } from "../../../../utils/utils";
import { AuthContext } from "../../../../context/AuthContext";
import ButtonLoading from "../../../../UI/Buttons/ButtonLoading";

const CreateUser = ({ setReload, open, setOpen }) => {
  const authCtx = useContext(AuthContext);

  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [ready, setReady] = useState(false);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  // Form States
  const [type, setType] = useState("Estudiante");
  const [gender, setGender] = useState("");
  const [birth, setBirth] = useState(null);

  const createUserHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["birth_date"] =
      birth && birth instanceof Date && !isNaN(birth)
        ? birth.toISOString().split("T")[0]
        : "";

    dataObj["teacher"] = value ? value.id : "";

    const result = await fetch(urlAPI + `users/user/`, {
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
      if (refreshed) createUserHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
    } else {
      setReload(true);
      setOpen(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    const getTeachers = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + "users/teacher/", {
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

        if (refreshed) getTeachers();
        return;
      }
      setOptions(data.teachers);
      setReady(true);
    };

    getTeachers();
  }, [authCtx.setUser, type]);

  return (
    <ModalUI open={open} setOpen={setOpen}>
      <ModalTitle>Crear Usuario</ModalTitle>
      <Form
        onSubmit={createUserHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Crear"
      >
        <Stack sx={styles.stack}>
          <FormControl variant="filled">
            <InputLabel id="demo-simple-select-label">Tipo</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="type"
              name="type"
              onChange={(e) => setType(e.target.value)}
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              required
            >
              <MenuItem value="Estudiante">Estudiante</MenuItem>
              <MenuItem value="Profesor">Profesor</MenuItem>
            </Select>
          </FormControl>
          {type === "Estudiante" ? (
            <>
              {!ready ? (
                <ButtonLoading loading>Cargando Profesores</ButtonLoading>
              ) : (
                <Stack sx={styles.stack}>
                  <Autocomplete
                    value={value}
                    onChange={(event, newValue) => {
                      setValue(newValue);
                    }}
                    disablePortal
                    id="combo-box-demo"
                    options={options}
                    sx={{ width: 300 }}
                    renderInput={(params) => (
                      <TextField {...params} label="Profesor" />
                    )}
                  />
                </Stack>
              )}{" "}
            </>
          ) : (
            <Box></Box>
          )}
        </Stack>

        <Stack sx={styles.stack}>
          <TextField
            id="outlined-textarea"
            label="Usuario"
            placeholder="Usuario"
            name="username"
            required
          />
          <TextField
            id="outlined-textarea"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
          />
        </Stack>

        <Stack sx={styles.stack}>
          <TextField
            id="outlined-textarea"
            label="Nombres"
            placeholder="Nombres"
            name="first_name"
            required
          />
          <TextField
            id="outlined-textarea"
            label="Apellidos"
            placeholder="Apellidos"
            name="last_name"
            required
          />
        </Stack>

        <Stack sx={styles.stack}>
          <FormControl variant="filled" sx={{ width: "25rem" }}>
            <InputLabel id="demo-simple-select-label">Género</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              label="gender"
              name="gender"
              onChange={(e) => setGender(e.target.value)}
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
              required
            >
              <MenuItem value="Femenino">Femenino</MenuItem>
              <MenuItem value="Masculino">Masculino</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-textarea"
            label="Número de documento"
            placeholder="Número de documento"
            name="id_document"
            type="number"
          />
        </Stack>

        <Stack sx={styles.stack}>
          <Box sx={{ width: "25rem" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                name="birth_date"
                inputFormat="dd/MM/yyyy"
                label="Fecha de nacimiento"
                value={birth}
                onChange={(newValue) => {
                  setBirth(newValue);
                }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Box>
          <TextField
            id="outlined-textarea"
            label="Celular"
            placeholder="+57 (311) 8381534"
            name="phone_number"
            type="text"
          />
        </Stack>
        {type === "Estudiante" && (
          <Stack sx={styles.stack}>
            <TextField
              id="outlined-textarea"
              label="Acudiente"
              placeholder="Acudiente"
              name="parent_name"
            />
            <TextField
              id="outlined-textarea"
              label="Celular (2)"
              placeholder="+57 (311) 8381534"
              name="phone_number_2"
              type="text"
            />
          </Stack>
        )}
      </Form>
    </ModalUI>
  );
};

export default CreateUser;
