import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../../../../context/AuthContext";
import Form from "../../../../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../../../UI/Modals/ModalUI";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../../utils/utils";

import { Typography as Text } from "@mui/material";

const TaskDelete = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const taskDeleteHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tokens = getTokens();

    const result = await fetch(
      urlAPI + `levels/deleteTask/?id=${props.task.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
      }
    );

    // const data = await result.json();
    if (!result.ok) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );

      if (refreshed) taskDeleteHandler(e);
      return;
    }

    props.setReload(true);
    props.setOpen(false);

    setLoading(false);
  };
  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>Eliminar Actividad</ModalTitle>
      <Form
        onSubmit={taskDeleteHandler}
        messages={[]}
        loading={loading}
        collapseOpen={false}
        setCollapseOpen={() => {}}
        submitText={"Eliminar"}
      >
        <Text component="span" textAlign="center" color="red.main">
          ¿Está seguro que desea eliminar la actividad{" "}
          <strong>
            <br />
            {props.task.task}
            <br />
          </strong>{" "}
          de manera permanente?
        </Text>
      </Form>
    </ModalUI>
  );
};

export default TaskDelete;
