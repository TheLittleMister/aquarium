import React, { useContext, useState } from "react";
import { Box, InputLabel, Stack, TextField } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Form from "../../../../../../../UI/Forms/Form";
import {
  completeDate,
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../utils/utils";
import { AuthContext } from "../../../../../../../context/AuthContext";

const AddCourseForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [date, setDate] = useState(null);

  const addCourseFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["date"] = date ? date.toISOString().split("T")[0] : "";

    const result = await fetch(
      urlAPI + `courses/addCourses/?username=${props.username}`,
      {
        method: "POST",
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
      if (refreshed) addCourseFormHandler(e);
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setCollapseOpen(true);
    } else {
      props.setDates(
        data.courses.map((item, index, arr) => {
          return {
            date: (
              `${item.count} - ` +
              completeDate(item.date) +
              " de " +
              getHour(item.start_time) +
              " a " +
              getHour(item.end_time)
            ).toUpperCase(),
            default: item.default,
            id: item.id,
          };
        })
      );
      setSuccess(true);
      setMessages(["Curso Agregado"]);
      setCollapseOpen(true);
    }
    setLoading(false);
  };

  return (
    <Form
      onSubmit={addCourseFormHandler}
      messages={messages}
      loading={loading}
      collapseOpen={collapseOpen}
      setCollapseOpen={setCollapseOpen}
      submitText="Agregar"
      success={success}
    >
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="end"
        gap={2}
        flexWrap="wrap"
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            name="date_course"
            inputFormat="dd/MM/yyyy"
            label="Fecha de clase"
            minDate={new Date()}
            value={date}
            onChange={(newValue) => {
              setDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
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
            />
          </Box>
        </Stack>
      </Stack>
    </Form>
  );
};

export default AddCourseForm;
