import React, { useState } from "react";
import { useParams } from "react-router-dom";

import { urlAPI } from "../../../../../utils/utils";
import ModalUI from "../../../../../UI/Modals/ModalUI";
import ModalTitle from "../../../../../UI/Modals/ModalTitle";
import { TextField } from "@mui/material";
import Form from "../../../../../UI/Forms/Form";

const PasswordResetConfirmForm = () => {
  const params = useParams();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordResetConfirmFormHandler = async (e) => {
    e.preventDefault();
    setCollapseOpen(false);
    setLoading(true);
    setSuccess(false);
    setMessages([]);

    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["token"] = params.token;

    const result = await fetch(urlAPI + "login/password_reset/confirm/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();

    if (!result.ok) {
      if (data.detail) setMessages(["Contraseña ya ha sido cambiada."]);
      if (data.password) setMessages(data.password);
      setLoading(false);
    } else {
      setSuccess(true);
      setMessages(["Contraseña cambiada."]);
    }
    setCollapseOpen(true);
  };

  return (
    <ModalUI open={true} closePath="/">
      <ModalTitle>Nueva Contraseña</ModalTitle>
      <Form
        onSubmit={passwordResetConfirmFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Cambiar"
        success={success}
      >
        <TextField
          type="password"
          id="id_password"
          label="Nueva Contraseña"
          placeholder="Nueva Contraseña"
          name="password"
          required
          fullWidth
        />
      </Form>
    </ModalUI>
  );
};

export default PasswordResetConfirmForm;
