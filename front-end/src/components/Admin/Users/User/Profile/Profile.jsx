import React, { useState } from "react";

import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Tooltip,
  Link,
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
import SchoolIcon from "@mui/icons-material/School";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import TableRowNoBorder from "../../../../../UI/Tables/TableRows/TableRowNoBorder";
import ButtonSecondary from "../../../../../UI/Buttons/ButtonSecondary";
import ButtonWarning from "../../../../../UI/Buttons/ButtonWarning";
import { prettyDate } from "../../../../../utils/utils";
import UploadImage from "../../../../../utils/UploadImage/UploadImage";
import ProfileForm from "./ProfileForm/ProfileForm";
import ButtonDanger from "../../../../../UI/Buttons/ButtonDanger";
import DeleteProfile from "./DeleteProfile/DeleteProfile";
import PasswordForm from "./PasswordForm/PasswordForm";

const Profile = (props) => {
  const [openUpdateSignature, setOpenUpdateSignature] = useState(false);
  const [openDeleteProfile, setOpenDeleteProfile] = useState(false);
  const [openProfileForm, setOpenProfileForm] = useState(false);
  const [openPasswordForm, setOpenPasswordForm] = useState(false);
  const [photo, setPhoto] = useState("");

  const imageSelected = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
      setOpenUpdateSignature(true);
    }
  };

  return (
    <>
      <ProfileForm
        user={props.user}
        setUser={props.setUser}
        open={openProfileForm}
        setOpen={setOpenProfileForm}
      />
      <PasswordForm
        user={props.user}
        setUser={props.setUser}
        open={openPasswordForm}
        setOpen={setOpenPasswordForm}
      />
      <DeleteProfile
        open={openDeleteProfile}
        setOpen={setOpenDeleteProfile}
        setUser={props.setUser}
        user={props.user}
      />
      <UploadImage
        photo={photo}
        open={openUpdateSignature}
        setOpen={setOpenUpdateSignature}
        setUser={props.setUser}
        uploadPath={"users/changeSignature/"}
        aspect={2 / 1}
        title="Foto Firma"
        username={props.user.username}
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
        <ButtonDanger
          startIcon={<DeleteForeverIcon />}
          onClick={() => setOpenDeleteProfile(true)}
        >
          Eliminar
        </ButtonDanger>
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
                <Link
                  href={`https://api.whatsapp.com/send?phone=${props.user.phoneNumber.slice(
                    1
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text>{props.user.phoneNumber}</Text>
                </Link>
              </TableCell>
            </TableRowNoBorder>
            {props.user.type === "Estudiante" && (
              <>
                <TableRowNoBorder hover={true}>
                  <TableCell align="center" component="th" scope="row">
                    <PhoneIcon sx={{ color: "blue.font" }} />
                  </TableCell>
                  <TableCell>
                    <Text fontWeight={500}>Celular 2</Text>
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`https://api.whatsapp.com/send?phone=57${props.user.phoneNumber2.slice(
                        1
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Text>{props.user.phoneNumber2}</Text>
                    </Link>
                  </TableCell>
                </TableRowNoBorder>
                <TableRowNoBorder hover={true}>
                  <TableCell align="center" component="th" scope="row">
                    <EscalatorWarningIcon sx={{ color: "blue.font" }} />
                  </TableCell>
                  <TableCell>
                    <Text fontWeight={500}>Acudiente</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{props.user.parentName}</Text>
                  </TableCell>
                </TableRowNoBorder>
                <TableRowNoBorder hover={true}>
                  <TableCell align="center" component="th" scope="row">
                    <SchoolIcon sx={{ color: "blue.font" }} />
                  </TableCell>
                  <TableCell>
                    <Text fontWeight={500}>Profesor</Text>
                  </TableCell>
                  <TableCell>
                    <Text>{props.user.teacherName}</Text>
                  </TableCell>
                </TableRowNoBorder>
              </>
            )}
            {props.user.type === "Profesor" && (
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
                    alt="Signature"
                    style={{ height: "8rem", borderRadius: "1rem" }}
                  />
                  <Tooltip title="Editar">
                    <IconButton
                      onClick={() =>
                        document.querySelector("#upload_signature").click()
                      }
                    >
                      <EditIcon color="primary" />
                      <input
                        type="file"
                        name="image"
                        id="upload_signature"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={imageSelected}
                      />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRowNoBorder>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Profile;
