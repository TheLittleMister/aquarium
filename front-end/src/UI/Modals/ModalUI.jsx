import React from "react";

import { useNavigate } from "react-router-dom";

import {
  Backdrop,
  Box,
  Modal,
  Fade,
  Stack,
  Tooltip,
  IconButton,
} from "@mui/material";

import * as styles from "./ModalUIStyles";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";

import classes from "./ModalUI.module.css";

const ModalUI = (props) => {
  const navigate = useNavigate();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={props.open}
      onClose={() =>
        props.closePath
          ? navigate(props.closePath, { replace: false })
          : props.setOpen(false)
      }
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={props.open}>
        <Box sx={styles.modalBox} className={classes.modal}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Tooltip
              title="Atrás"
              sx={!props.closePath ? { visibility: "hidden" } : {}}
            >
              <IconButton onClick={() => navigate(-1)}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>

            <Box>{props.children}</Box>

            <Tooltip title="Cerrar">
              <IconButton
                onClick={() =>
                  props.closePath
                    ? navigate(props.closePath, { replace: false })
                    : props.setOpen(false)
                }
              >
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          <br />
        </Box>
      </Fade>
    </Modal>
  );
};

export default ModalUI;
