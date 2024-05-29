import React, { useState, useContext } from "react";
import { TextareaAutosize } from "@mui/material";
import Form from "../../../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../../UI/Modals/ModalUI";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../utils/utils";
import { AuthContext } from "../../../../../../../context/AuthContext";

const TasksForm = ({ open, setOpen, levelID, setReload, task }) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const tasksFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    const tokens = getTokens();

    const result = await fetch(
      urlAPI + `levels/task/?id=${task ? task.id : ""}`,
      {
        method: task ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify({
          levelID: levelID,
          task: dataObj.task.trim(),
        }),
      }
    );

    const data = await result.json();

    if (result.status === 401) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );
      if (refreshed) tasksFormHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
    } else {
      setReload(true);
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <ModalUI open={open} setOpen={setOpen} closePath="">
      <ModalTitle>{task ? "Editar" : "Agregar"} Actividad</ModalTitle>
      <Form
        onSubmit={tasksFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={task ? "Editar" : "Agregar"}
      >
        <TextareaAutosize
          minRows={5}
          maxRows={5}
          name="task"
          defaultValue={task ? task.task : ""}
          placeholder="Escribe aquí la actividad..."
          style={{ borderRadius: "0.5rem", p: 1, outline: "none", border: "0" }}
        />
      </Form>
    </ModalUI>
  );
};

export default TasksForm;
