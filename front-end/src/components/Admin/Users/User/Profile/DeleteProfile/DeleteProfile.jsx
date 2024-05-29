import React, { useState, useContext } from "react";
import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import { Typography as Text, TextField } from "@mui/material";
import Form from "../../../../../../UI/Forms/Form";
import { useNavigate } from "react-router-dom";
import {
  getTokens,
  logOut,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";
import { AuthContext } from "../../../../../../context/AuthContext";

const DeleteProfile = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const deleteProfileHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["username"] = props.user.username;

    const result = await fetch(urlAPI + "users/user/", {
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

      if (refreshed) deleteProfileHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
      setLoading(false);
    } else {
      if (props.user === authCtx.user) logOut(authCtx.setUser);

      navigate(`/admin/users`, { replace: true });
    }
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Eliminar Usuario</ModalTitle>

      <Form
        onSubmit={deleteProfileHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={"Eliminar"}
      >
        <Text component="span" textAlign="center" color="red.main">
          ¿Está seguro que desea eliminar a
          <strong>
            <br />
            {props.user.firstName} {props.user.lastName}
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
          fullWidth
        />
      </Form>
    </ModalUI>
  );
};

export default DeleteProfile;
