import React, { useEffect, useState } from "react";
import { Typography as Text } from "@mui/material";

import ModalUI from "../../../../../UI/Modals/ModalUI";
import AccordionLevel from "./AccordionLevel/AccordionLevel";
import ModalTitle from "../../../../../UI/Modals/ModalTitle";
import { urlAPI } from "../../../../../utils/utils";

const ModalLevel = (props) => {
  const [levels, setLevels] = useState([]);

  useEffect(() => {
    const getLevels = async () => {
      const result = await fetch(
        urlAPI + `levels/levelsInfo/?category=${props.title}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await result.json();
      setLevels(data.levels);
    };

    getLevels();
  }, [props.title]);

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>{props.title}</ModalTitle>
      <Text id="transition-modal-description">
        {props.title + " está compuesto por " + levels.length + " niveles:"}
      </Text>
      <br />
      <AccordionLevel levels={levels} />
    </ModalUI>
  );
};

export default ModalLevel;
