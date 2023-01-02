import React, { useState, useContext } from "react";
import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import { Typography as Text, TextField } from "@mui/material";
import Form from "../../../../../../UI/Forms/Form";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";
import { AuthContext } from "../../../../../../context/AuthContext";

const PasswordForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [success, setSuccess] = useState(false);

  const passwordFormHandler = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["username"] = props.user.username;

    const result = await fetch(urlAPI + "users/defaultUserPassword/ ", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access,
      },
      body: JSON.stringify(dataObj),
    });

    const data = await result.json();
    if (!result.ok) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );

      if (refreshed) passwordFormHandler(e);
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setCollapseOpen(true);
    } else {
      setMessages(data.messages);
      setSuccess(true);
      setCollapseOpen(true);
      e.target.reset();
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Resetear Contraseña</ModalTitle>

      <Form
        onSubmit={passwordFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={"Resetear"}
        success={success}
      >
        <Text component="span" textAlign="center" color="red.main">
          ¿Está seguro que desea resetear la contraseña de
          <strong>
            <br />
            {props.user.firstName} {props.user.lastName}
            <br />
          </strong>
          a "AquariumSchool"?
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
          fullWidth
        />
      </Form>
    </ModalUI>
  );
};

export default PasswordForm;
