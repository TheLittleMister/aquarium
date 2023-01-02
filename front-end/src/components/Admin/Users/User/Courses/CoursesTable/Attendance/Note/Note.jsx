import React, { useState, useContext } from "react";

import { TextareaAutosize } from "@mui/material";

import ModalUI from "../../../../../../../../UI/Modals/ModalUI";
import Form from "../../../../../../../../UI/Forms/Form";
import ModalTitle from "../../../../../../../../UI/Modals/ModalTitle";
import { AuthContext } from "../../../../../../../../context/AuthContext";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../../utils/utils";

const Note = ({ open, setOpen, setNote, note, attendanceID }) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const noteFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    // if (Boolean(authCtx.user.username)) return;

    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);
    const tokens = getTokens();

    const result = await fetch(urlAPI + "courses/change/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access,
      },
      body: JSON.stringify({
        id: attendanceID,
        type: "note",
        note: dataObj.note.trim(),
      }),
    });

    const data = await result.json();

    if (!result.ok) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );
      if (refreshed) noteFormHandler(e);
      return;
    }

    setNote(data.note);
    setOpen(false);
    setLoading(false);
  };

  return (
    <ModalUI open={open} setOpen={setOpen} closePath="">
      <ModalTitle>Actualizar Nota</ModalTitle>
      <Form
        onSubmit={noteFormHandler}
        messages={[]}
        loading={loading}
        collapseOpen={false}
        setCollapseOpen={() => {}}
        submitText="Actualizar"
      >
        <TextareaAutosize
          minRows={5}
          maxRows={5}
          name="note"
          defaultValue={note}
          placeholder="Escribe aquí la nota..."
          style={{ borderRadius: "0.5rem", p: 1, outline: "none", border: "0" }}
        />
      </Form>
    </ModalUI>
  );
};

export default Note;
