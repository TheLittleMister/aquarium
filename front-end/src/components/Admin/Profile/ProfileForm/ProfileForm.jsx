import React, { useState, useContext } from "react";

import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Box,
} from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import Form from "../../../../UI/Forms/Form";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../UI/Modals/ModalUI";

import * as styles from "./ProfileFormStyles";

import { urlAPI, getTokens, refreshTokens } from "../../../../utils/utils";
import { AuthContext } from "../../../../context/AuthContext";

const ProfileForm = (props) => {
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  // Form States
  const [gender, setGender] = useState(props.user.gender);
  const [birth, setBirth] = useState(
    props.user.birthDate ? new Date(props.user.birthDate + " ") : null
  );

  const profileFormHandler = async (e) => {
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

    const result = await fetch(urlAPI + `users/user/`, {
      method: "PUT",
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
      if (refreshed) profileFormHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
    } else {
      props.setUser(data);
      props.setOpen(false);
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Actualizar Datos</ModalTitle>
      <Form
        onSubmit={profileFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Actualizar"
      >
        <Stack sx={styles.stack}>
          <TextField
            id="outlined-textarea"
            label="Usuario"
            placeholder="Usuario"
            name="username"
            defaultValue={props.user.username}
            required
          />
          <TextField
            id="outlined-textarea"
            label="Email"
            placeholder="Email"
            name="email"
            type="email"
            defaultValue={props.user.email}
          />
        </Stack>

        <Stack sx={styles.stack}>
          <TextField
            id="outlined-textarea"
            label="Nombres"
            placeholder="Nombres"
            name="first_name"
            defaultValue={props.user.firstName}
            required
          />
          <TextField
            id="outlined-textarea"
            label="Apellidos"
            placeholder="Apellidos"
            name="last_name"
            defaultValue={props.user.lastName}
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
            defaultValue={props.user.idDocument}
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
            defaultValue={props.user.phoneNumber}
            type="text"
          />
        </Stack>
      </Form>
    </ModalUI>
  );
};

export default ProfileForm;
