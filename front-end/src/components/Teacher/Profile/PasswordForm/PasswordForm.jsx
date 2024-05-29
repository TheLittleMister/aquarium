import React, { useState, useContext } from "react";

import { TextField } from "@mui/material";
import Form from "../../../../UI/Forms/Form";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../UI/Modals/ModalUI";

import { urlAPI, getTokens, refreshTokens } from "../../../../utils/utils";
import { AuthContext } from "../../../../context/AuthContext";

const PasswordForm = (props) => {
  const authCtx = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordFormHandler = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + `users/changePassword/`, {
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
      if (refreshed) passwordFormHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
    } else {
      setMessages(data.messages);
      setSuccess(true);
      e.target.reset();
    }
    setCollapseOpen(true);
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Actualizar Contraseña</ModalTitle>
      <Form
        onSubmit={passwordFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Actualizar"
        success={success}
      >
        <TextField
          id="id_old_password"
          label="Contraseña Antigua"
          placeholder="Contraseña Antigua"
          type="password"
          name="old_password"
          autoComplete="current-password"
          required
        />
        <TextField
          id="id_new_password1"
          label="Contraseña Nueva"
          placeholder="Contraseña Nueva"
          type="password"
          name="new_password1"
          autoComplete="new-password"
          required
        />
        <TextField
          id="id_new_password2"
          label="Confirmar Contraseña Nueva"
          placeholder="Confirmar Contraseña Nueva"
          type="password"
          name="new_password2"
          autoComplete="new-password"
          required
        />
      </Form>
    </ModalUI>
  );
};

export default PasswordForm;
