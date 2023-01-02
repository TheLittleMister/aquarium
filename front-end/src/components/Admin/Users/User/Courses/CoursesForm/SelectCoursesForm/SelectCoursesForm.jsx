import React, { useContext, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Form from "../../../../../../../UI/Forms/Form";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../utils/utils";
import { AuthContext } from "../../../../../../../context/AuthContext";

const SelectCoursesForm = ({ dates, username, setReload, setOpen }) => {
  const authCtx = useContext(AuthContext);
  const defaultDates = dates.filter((date) => date.default);
  const [courses, setCourses] = useState(defaultDates);

  // FORM STATES
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const selectCoursesFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();

    const result = await fetch(
      urlAPI + `courses/editCourses/?username=${username}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify({
          courses: [...courses.map((course) => course.id)],
        }),
      }
    );

    const data = await result.json();

    if (!result.ok) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );
      if (refreshed) selectCoursesFormHandler(e);
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setMessages(data.errors);
      setCollapseOpen(true);
      setLoading(false);
    } else {
      setReload(true);
      setOpen(false);
    }
  };

  return (
    <Form
      sx={{ maxWidth: "60rem" }}
      onSubmit={selectCoursesFormHandler}
      messages={messages}
      loading={loading}
      collapseOpen={collapseOpen}
      setCollapseOpen={setCollapseOpen}
      submitText="Guardar"
    >
      <Autocomplete
        sx={{ minWidth: "30rem" }}
        multiple
        id="tags-outlined"
        options={dates}
        getOptionLabel={(date) => date.date}
        disableCloseOnSelect
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option.date === value.date}
        defaultValue={defaultDates}
        onChange={(event, value) => setCourses(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Clases"
            placeholder="Clases Disponibles"
          />
        )}
      />
    </Form>
  );
};

export default SelectCoursesForm;
