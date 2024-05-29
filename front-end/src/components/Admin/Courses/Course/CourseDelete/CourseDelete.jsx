import React, { useState, useContext } from "react";
import Form from "../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../UI/Modals/ModalUI";

import { TextField, Typography as Text } from "@mui/material";
import {
  completeDate,
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../utils/utils";
import { AuthContext } from "../../../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const CourseDelete = ({ course, setReload }) => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const courseDeleteHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(
      urlAPI + `courses/deleteCourse/?id=${course.id}`,
      {
        method: "DELETE",
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

      if (refreshed) courseDeleteHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
      setLoading(false);
    } else {
      setReload(true);
      navigate(`/admin/courses`, { replace: true });
    }
  };

  return (
    <ModalUI open={true} closePath={`/admin/courses/${course.id}`}>
      <ModalTitle>Eliminar Clase</ModalTitle>

      <Form
        onSubmit={courseDeleteHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={"Eliminar"}
      >
        <Text component="span" textAlign="center" color="red.main">
          ¿Está seguro que desea eliminar la clase del
          <strong>
            <br />
            {completeDate(course.date)} DE {getHour(course.start_time)} A{" "}
            {getHour(course.end_time)}
            <br />
          </strong>
          de manera permanente?
        </Text>
        <TextField
          color="red"
          id="outlined-password-input"
          label="Confirmar Contraseña"
          placeholder="Contraseña"
          type="password"
          autoComplete="current-password"
          name="password"
          required
          // fullWidth
        />
      </Form>
    </ModalUI>
  );
};

export default CourseDelete;
