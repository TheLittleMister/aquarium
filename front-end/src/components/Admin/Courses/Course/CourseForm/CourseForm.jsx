import React, { useContext, useEffect, useState } from "react";
import { Autocomplete, Box, InputLabel, Stack, TextField } from "@mui/material";
import Form from "../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../UI/Modals/ModalUI";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AuthContext } from "../../../../../context/AuthContext";
import { getTokens, refreshTokens, urlAPI } from "../../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import ButtonLoading from "../../../../../UI/Buttons/ButtonLoading";

const CourseForm = (props) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [date, setDate] = useState(
    props.course.date ? new Date(props.course.date + " ") : null
  );

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const [users, setUsers] = useState([]); // students.filter((user) => user.default) // useEffect
  const [students, setStudents] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const getStudents = async () => {
      const tokens = getTokens();
      const result = await fetch(
        urlAPI + `courses/editCourse/?id=${props.courseID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokens.access,
          },
        }
      );

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );
        if (refreshed) getStudents();
        return;
      }

      const students = data.users.map((item, index, arr) => {
        return {
          name: item.user__first_name + " " + item.user__last_name,
          default: item.default,
          id: item.id,
        };
      });

      setStudents(students);
      setUsers(students.filter((user) => user.default));
      setReady(true);
    };

    getStudents();
  }, [authCtx.setUser, props.courseID]);

  const courseFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["date"] = date ? date.toISOString().split("T")[0] : "";
    dataObj["students"] = [...users.map((user) => user.id)];

    const result = await fetch(
      urlAPI + `courses/editCourse/?id=${props.courseID}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify(dataObj),
      }
    );

    const data = await result.json();

    if (result.status === 401) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );
      if (refreshed) courseFormHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
      setLoading(false);
    } else {
      props.setReload(true);
      navigate(`/admin/courses/${props.courseID}`);
    }
  };

  return (
    <ModalUI open={true} closePath={`/admin/courses/${props.courseID}/`}>
      <ModalTitle>Editar Clase</ModalTitle>
      <Form
        onSubmit={courseFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Editar"
        // success={false}
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
              // minDate={new Date()}
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
                defaultValue={props.course.start_time}
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
                defaultValue={props.course.end_time}
              />
            </Box>
          </Stack>
        </Stack>
        {ready ? (
          <Autocomplete
            sx={{ minWidth: "30rem" }}
            multiple
            id="tags-outlined"
            options={students}
            getOptionLabel={(user) => user.name}
            disableCloseOnSelect
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.id === value.id}
            defaultValue={students.filter((user) => user.default)}
            onChange={(event, value) => setUsers(value)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Estudiantes"
                placeholder="Estudiantes Disponibles"
              />
            )}
          />
        ) : (
          <ButtonLoading loading>Cargando Estudiantes</ButtonLoading>
        )}
      </Form>
    </ModalUI>
  );
};

export default CourseForm;
