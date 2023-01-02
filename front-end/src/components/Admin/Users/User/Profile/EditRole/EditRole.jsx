import React, { useContext, useState } from "react";
import {
  FormControl,
  FormControlLabel,
  // FormLabel,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";

import Form from "../../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";

import { AuthContext } from "../../../../../../context/AuthContext";
const EditRole = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [value, setValue] = useState(props.user.type);

  const editRoleHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    dataObj["username"] = props.user.username;

    const result = await fetch(urlAPI + "users/changeRole/", {
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
      if (refreshed) editRoleHandler(e);
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setCollapseOpen(true);
    } else {
      props.setUser((prevState) => {
        return {
          ...prevState,
          type: data.type,
        };
      });

      props.setOpen(false);
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Role</ModalTitle>
      <Form
        onSubmit={editRoleHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText="Cambiar Role"
      >
        <FormControl>
          {/* <FormLabel id="demo-radio-buttons-group-label">Role</FormLabel> */}
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            name="radio-buttons-group"
          >
            <FormControlLabel
              value="Estudiante"
              control={<Radio />}
              label="Estudiante"
            />
            <FormControlLabel
              value="Profesor"
              control={<Radio />}
              label="Profesor"
            />
            <FormControlLabel
              value="Administrador"
              control={<Radio />}
              label="Administrador"
            />
          </RadioGroup>
        </FormControl>
        <TextField
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

export default EditRole;
