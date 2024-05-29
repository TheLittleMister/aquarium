import React, { useState } from "react";
import { Typography as Text } from "@mui/material";

import ButtonSecondary from "../../../../UI/Buttons/ButtonSecondary";

import * as styles from "./LevelStyles";
import ModalLevel from "./ModalLevel/ModalLevel";
import PaperPrimary from "../../../../UI/Papers/PaperPrimary";

const Level = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <PaperPrimary variant="outlined" flex={1}>
      <ModalLevel
        open={open}
        setOpen={setOpen}
        value={props.value}
        title={props.title}
        levels={props.levels}
      />
      <Text variant="h5" fontWeight={600}>
        <props.Icon sx={styles.icon} />
        <br />
        {props.title}
      </Text>
      <br />
      <Text>{props.text}</Text>
      <br />
      <ButtonSecondary onClick={() => setOpen(true)}>Saber Más</ButtonSecondary>
    </PaperPrimary>
  );
};

export default Level;
