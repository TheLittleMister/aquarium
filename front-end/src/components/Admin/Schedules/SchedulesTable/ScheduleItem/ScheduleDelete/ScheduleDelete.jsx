import React, { useContext, useState } from "react";
import { AuthContext } from "../../../../../../context/AuthContext";
import Form from "../../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import {
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";

import { Typography as Text } from "@mui/material";

const ScheduleDelete = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const scheduleDeleteHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    const tokens = getTokens();

    const result = await fetch(
      urlAPI + `courses/schedules/?id=${props.item.id}`,
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

      if (refreshed) scheduleDeleteHandler(e);
      return;
    }

    props.setReload(true);
    props.setOpen(false);
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>Eliminar Horario</ModalTitle>
      <Form
        onSubmit={scheduleDeleteHandler}
        messages={[]}
        loading={loading}
        collapseOpen={false}
        setCollapseOpen={() => {}}
        submitText={"Eliminar"}
      >
        <Text component="span" textAlign="center" color="red.main">
          ¿Está seguro que desea eliminar el horario del{" "}
          <strong>
            <br />
            {props.item.weekday__weekday} de {getHour(props.item.start_time)} a{" "}
            {getHour(props.item.end_time)}
            <br />
          </strong>{" "}
          de manera permanente?
        </Text>
      </Form>
    </ModalUI>
  );
};

export default ScheduleDelete;
