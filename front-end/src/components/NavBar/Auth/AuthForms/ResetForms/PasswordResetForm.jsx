import React, { useState } from "react";
import { TextField } from "@mui/material";
import Form from "../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../UI/Modals/ModalUI";
import { urlAPI } from "../../../../../utils/utils";

const PasswordResetForm = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const passwordResetFormHandler = async (e) => {
    e.preventDefault();
    setCollapseOpen(false);
    setLoading(true);
    setSuccess(false);
    setMessages([]);

    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + "login/password_reset/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataObj),
    });

    // const data = await result.json();

    if (!result.ok) {
      setMessages([
        "No pudimos encontrar una cuenta asociada con ese correo electrónico.",
      ]);
      setLoading(false);
    } else {
      setSuccess(true);
      setMessages([
        "Se ha enviado un correo electrónico con instrucciones para restablecer su contraseña.",
      ]);
    }
    setCollapseOpen(true);
  };

  return (
    <ModalUI open={true} closePath="/">
      <ModalTitle>Recuperar Contraseña</ModalTitle>
      <Form
        onSubmit={passwordResetFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Enviar"
        success={success}
      >
        <TextField
          id="id_email"
          label="Email"
          placeholder="Email"
          name="email"
          type="email"
          required
          fullWidth
        />
      </Form>
    </ModalUI>
  );
};

export default PasswordResetForm;
