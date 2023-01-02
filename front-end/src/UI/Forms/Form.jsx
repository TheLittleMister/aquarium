import { Alert, Box, Collapse, Stack } from "@mui/material";
import React from "react";
import ButtonSecondaryLoading from "../Buttons/ButtonSecondaryLoading";

// import * as styles from "./FormStyles";

const Form = (props) => {
  return (
    <Box onSubmit={props.onSubmit} component="form" sx={props.sx}>
      <Collapse in={props.collapseOpen}>
        <Alert
          onClose={() => props.setCollapseOpen(false)}
          severity={props.success ? "success" : "error"}
        >
          {props.messages.length > 0 && (
            <ul>
              {props.messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          )}
        </Alert>
        <br />
      </Collapse>
      <Stack
        direction={props.direction || "column"}
        gap={2}
        justifyContent="center"
        alignItems="center"
      >
        {props.children}
        <ButtonSecondaryLoading
          variant="contained"
          type="submit"
          loading={props.loading}
        >
          {props.submitText}
        </ButtonSecondaryLoading>
      </Stack>
    </Box>
  );
};

export default Form;
