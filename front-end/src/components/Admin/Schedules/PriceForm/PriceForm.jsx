import React, { useState, useContext } from "react";
import { TextareaAutosize } from "@mui/material";
import Form from "../../../../UI/Forms/Form";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../UI/Modals/ModalUI";
import { AuthContext } from "../../../../context/AuthContext";
import { getTokens, refreshTokens, urlAPI } from "../../../../utils/utils";

const PriceForm = (props) => {
  const authCtx = useContext(AuthContext);

  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [collapseOpen, setCollapseOpen] = useState(false);

  const priceFormHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    setCollapseOpen(false);

    const tokens = getTokens();
    const dataArr = [...new FormData(e.target)];
    const dataObj = Object.fromEntries(dataArr);

    const result = await fetch(urlAPI + `courses/price/`, {
      method: "POST",
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

      if (refreshed) priceFormHandler(e);
      return;
    }

    if (data.detail || (data.errors && data.errors.length > 0)) {
      setMessages(data.errors || [data.detail]);
      setCollapseOpen(true);
    } else {
      props.setPrice(data.price);
      props.setOpen(false);
    }
    setLoading(false);
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>Editar Precio</ModalTitle>
      <Form
        onSubmit={priceFormHandler}
        messages={messages}
        loading={loading}
        collapseOpen={collapseOpen}
        setCollapseOpen={setCollapseOpen}
        submitText={"Editar"}
      >
        <TextareaAutosize
          minRows={12}
          maxRows={15}
          name="price"
          defaultValue={props.price}
          placeholder="Informacion de precios..."
          style={{ borderRadius: "0.5rem", p: 1, outline: "none", border: "0" }}
          required
        />
      </Form>
    </ModalUI>
  );
};

export default PriceForm;
