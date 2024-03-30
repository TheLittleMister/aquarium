import React from "react";

import * as styles from "./ModalPreinscriptionStyles";

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography as Text,
  Tooltip,
  Link,
} from "@mui/material";

import ModalUI from "../../../../../UI/Modals/ModalUI";
import ModalTitle from "../../../../../UI/Modals/ModalTitle";
import TableRowNoBorder from "../../../../../UI/Tables/TableRows/TableRowNoBorder";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import CakeIcon from "@mui/icons-material/Cake";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ButtonSecondary from "../../../../../UI/Buttons/ButtonSecondary";

function ModalPreinscription(props) {
  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Pre-Inscripción</ModalTitle>
      <Text>
        Envíe la siguiente información para realizar la pre-inscripción:
      </Text>
      <br />
      <TableContainer component={Paper} sx={styles.table}>
        <Table size="small" aria-label="simple table">
          <TableBody>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <ChildCareIcon fontSize="small" sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell align="left">
                <Text>Nombre completo del alumno</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <AssignmentIndIcon
                  fontSize="small"
                  sx={{ color: "blue.font" }}
                />
              </TableCell>
              <TableCell align="left">
                <Text>Número de documento</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <CakeIcon fontSize="small" sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell align="left">
                <Text>Fecha de nacimiento</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <PhoneAndroidIcon
                  fontSize="small"
                  sx={{ color: "blue.font" }}
                />
              </TableCell>
              <TableCell align="left">
                <Text>Celular de contacto</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <EscalatorWarningIcon
                  fontSize="small"
                  sx={{ color: "blue.font" }}
                />
              </TableCell>
              <TableCell align="left">
                <Text>Nombre de la persona responsable</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <AccessTimeIcon fontSize="small" sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell align="left">
                <Text>Horario de su interés</Text>
              </TableCell>
            </TableRowNoBorder>
          </TableBody>
        </Table>
      </TableContainer>
      <br />
      <Text textAlign="center">
        Inscripción previa requerida, cupos limitados. <br />
        Para asegurar el cupo, realice el pago por Nequi o Daviplata <br />
        al número{" "}
        <Link
          href="https://api.whatsapp.com/send?phone=573118381534"
          target="_blank"
          rel="noopener noreferrer"
        >
          +57 (311) 8381534
        </Link>{" "}
        y envíe el pantallazo <br />
        para validar la información.
      </Text>
      <br />
      <Box textAlign="center">
        <Tooltip title="+57 (311) 8381534">
          <ButtonSecondary
            startIcon={<WhatsAppIcon />}
            href="https://api.whatsapp.com/send?phone=573118381534"
            target="_blank"
            rel="noopener noreferrer"
          >
            Inscríbete&nbsp;
          </ButtonSecondary>
        </Tooltip>
      </Box>
    </ModalUI>
  );
}

export default ModalPreinscription;
