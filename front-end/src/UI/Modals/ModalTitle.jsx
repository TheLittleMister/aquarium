import React from "react";

import { Typography as Text } from "@mui/material";

const ModalTitle = (props) => {
  return (
    <Text
      id="transition-modal-title"
      variant="h5"
      component="h2"
      fontWeight={500}
      p={0.5}
      marginBottom={2}
      textAlign="center"
    >
      {props.children}
    </Text>
  );
};

export default ModalTitle;
