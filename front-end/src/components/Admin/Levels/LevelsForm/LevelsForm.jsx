import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import Form from "../../../../UI/Forms/Form";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../UI/Modals/ModalUI";
import { getTokens, refreshTokens, urlAPI } from "../../../../utils/utils";
import { AuthContext } from "../../../../context/AuthContext";

const LevelsForm = (props) => {
  const authCtx = useContext(AuthContext);
  const [category, setCategory] = useState(
    props.level ? props.level.category__id : ""
  );
  const [position, setPosition] = useState(
    props.level ? props.level.position : 1
  );
  const [availablePositions, setAvailablePositions] = useState(0);
  const [positionDisabled, setPositionDisabled] = useState(
    props.level ? false : true
  );

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const getAvailablePositions = useCallback(
    async (categoryID) => {
      const tokens = getTokens();

      const result = await fetch(
        urlAPI + `courses/category/?id=${categoryID}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokens.access,
          },
        }
      );

      const data = await result.json();

      if (!result.ok) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getAvailablePositions();
        return;
      }

      setAvailablePositions(
        props.level
          ? props.level.category__id === categoryID
            ? data.positions
            : data.positions + 1
          : data.positions + 1
      );
      setPositionDisabled(false);
    },
    [authCtx.setUser, props.level]
  );

  useEffect(() => {
    props.level && getAvailablePositions(props.level.category__id);
  }, [getAvailablePositions, props.level]);

  const handlePositionChange = (e) => {
    const positionInput = e.target.value;

    if (positionInput > availablePositions) setPosition(availablePositions);
    else if (positionInput < 1) setPosition(1);
    else setPosition(positionInput);
  };

  const handleCategoryChange = async (e) => {
    setCategory(e.target.value);
    setPosition(1);
    getAvailablePositions(e.target.value);
  };

  const levelsFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(
      urlAPI + `courses/level/?id=${props.level ? props.level.id : ""}`,
      {
        method: props.level ? "PUT" : "POST",
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
      if (refreshed) levelsFormHandler(e);
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setCollapseOpen(true);
    } else {
      getAvailablePositions(dataObj["category"]);
      props.setOpen(false);
      props.setReload(true);
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>{props.level ? "Editar" : "Crear"} Nivel</ModalTitle>
      <Form
        onSubmit={levelsFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={props.level ? "Editar" : "Crear"}
      >
        <Stack gap={2}>
          <TextField
            id="outlined-textarea"
            label="Nombre"
            placeholder="Titulo del nivel"
            name="name"
            type="text"
            required
            defaultValue={props.level && props.level.name}
          />
          <FormControl variant="filled">
            <InputLabel id="demo-simple-select-label">Categoría</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="category"
              required
              onChange={handleCategoryChange}
              name="category"
              sx={{
                backgroundColor: "transparent",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              <MenuItem value={1}>Principiante</MenuItem>
              <MenuItem value={2}>Intermedio</MenuItem>
              <MenuItem value={3}>Avanzado</MenuItem>
            </Select>
          </FormControl>
          <TextField
            id="outlined-textarea"
            label="Posición"
            placeholder="Posición"
            name="position"
            type="number"
            value={position}
            onChange={handlePositionChange}
            // defaultValue={props.user.email}
            required
            disabled={positionDisabled}
          />
        </Stack>
      </Form>
    </ModalUI>
  );
};

export default LevelsForm;
