import React, { useState } from "react";

import {
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Typography as Text,
} from "@mui/material";
import ShortTextIcon from "@mui/icons-material/ShortText";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import WcIcon from "@mui/icons-material/Wc";
import CakeIcon from "@mui/icons-material/Cake";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import EditIcon from "@mui/icons-material/Edit";

import TableRowNoBorder from "../../../UI/Tables/TableRows/TableRowNoBorder";
import ButtonSecondary from "../../../UI/Buttons/ButtonSecondary";
import ButtonWarning from "../../../UI/Buttons/ButtonWarning";
import { prettyDate } from "../../../utils/utils";
import ProfileForm from "./ProfileForm/ProfileForm";
import PasswordForm from "./PasswordForm/PasswordForm";

const Profile = (props) => {
  const [openProfileForm, setOpenProfileForm] = useState(false);
  const [openPasswordForm, setOpenPasswordForm] = useState(false);

  return (
    <>
      <PasswordForm
        user={props.user}
        setUser={props.setUser}
        open={openPasswordForm}
        setOpen={setOpenPasswordForm}
      />
      <ProfileForm
        user={props.user}
        setUser={props.setUser}
        open={openProfileForm}
        setOpen={setOpenProfileForm}
      />
      <Stack direction="row" justifyContent="space-around" p={3}>
        <ButtonSecondary
          startIcon={<EditIcon />}
          onClick={() => setOpenProfileForm(true)}
        >
          Datos
        </ButtonSecondary>
        <ButtonWarning
          startIcon={<EditIcon />}
          onClick={() => setOpenPasswordForm(true)}
        >
          Contraseña
        </ButtonWarning>
      </Stack>
      <TableContainer>
        <Table aria-label="simple table" size="small">
          <TableBody>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <ShortTextIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Nombres</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.firstName}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <ShortTextIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Apellidos</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.lastName}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <AssignmentIndIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Documento</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.idDocument}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <WcIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Género</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.gender}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <CakeIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Nacimiento</Text>
              </TableCell>
              <TableCell>
                <Text>
                  {prettyDate(props.user.birthDate)} ({props.user.age} años)
                </Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <EmailIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Correo</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.email}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <PhoneIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Celular</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.phoneNumber}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <HistoryEduIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Firma</Text>
              </TableCell>
              <TableCell>
                <img
                  src={props.user.eSignature || "/"}
                  alt="Sin firma, debe enviar firma a administración"
                  style={{ height: "8rem", borderRadius: "1rem" }}
                />
              </TableCell>
            </TableRowNoBorder>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Profile;
