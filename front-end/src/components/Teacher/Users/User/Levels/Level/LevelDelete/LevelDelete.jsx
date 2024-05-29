import React, { useContext, useState } from "react";

import { TextField, Typography as Text } from "@mui/material";
import { AuthContext } from "../../../../../../../context/AuthContext";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../utils/utils";
import ModalUI from "../../../../../../../UI/Modals/ModalUI";
import ModalTitle from "../../../../../../../UI/Modals/ModalTitle";
import Form from "../../../../../../../UI/Forms/Form";

const LevelDelete = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const levelDeleteHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["student"] = props.studentID;
    dataObj["studentLevelID"] = props.level.id;

    const result = await fetch(urlAPI + `levels/studentLevel/`, {
      method: "DELETE",
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

      if (refreshed) levelDeleteHandler(e);
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
      <ModalTitle>Desactivar Nivel</ModalTitle>
      <Form
        onSubmit={levelDeleteHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={"Desactivar"}
      >
        <Text component="span" textAlign="center" color="red.main">
          ¿Está seguro que desea desactivar el nivel{" "}
          <strong>
            <br />
            {props.level.level__name}
          </strong>
          ?
          <br />
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

export default LevelDelete;
