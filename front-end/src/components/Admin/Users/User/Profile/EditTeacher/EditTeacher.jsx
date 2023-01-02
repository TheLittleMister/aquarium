import React, { useState, useEffect, useContext } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { AuthContext } from "../../../../../../context/AuthContext";

import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";

import Form from "../../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../UI/Modals/ModalUI";

const EditTeacher = (props) => {
  const authCtx = useContext(AuthContext);
  const [value, setValue] = useState(null);
  const [options, setOptions] = useState([]);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  useEffect(() => {
    const getTeachers = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + "users/teacher/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
      });

      const data = await result.json();

      if (!result.ok) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getTeachers();
        return;
      }
      setOptions(data.teachers);

      if (props.user.teacherID)
        setValue(
          data.teachers[
            data.teachers.indexOf(
              data.teachers.filter(
                (item) => item.id === props.user.teacherID
              )[0]
            )
          ]
        );

      setReady(true);
    };

    getTeachers();
  }, [authCtx.setUser, props.user.teacherID]);

  const editTeacherHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataObj = { username: props.user.username, teacher: value };

    const result = await fetch(urlAPI + "users/teacher/", {
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
      if (refreshed) editTeacherHandler(e);
      return;
    }

    props.setUser((prevState) => {
      return {
        ...prevState,
        teacher: data.teacher,
        teacherID: data.teacherID,
      };
    });

    props.setOpen(false);
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Profesor</ModalTitle>
      {!ready ? (
        "Loading..."
      ) : (
        <Form
          onSubmit={editTeacherHandler}
          messages={[]}
          loading={loading}
          collapseOpen={collapseOpen}
          setCollapseOpen={setCollapseOpen}
          submitText="Asignar Profesor"
        >
          <Autocomplete
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            disablePortal
            id="combo-box-demo"
            options={options}
            sx={{ width: 300 }}
            renderInput={(params) => (
              <TextField {...params} label="Profesores" />
            )}
          />
        </Form>
      )}
    </ModalUI>
  );
};

export default EditTeacher;
