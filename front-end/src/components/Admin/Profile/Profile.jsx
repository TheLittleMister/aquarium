import React, { useState } from "react";

import {
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Tooltip,
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
import UploadImage from "../../../utils/UploadImage/UploadImage";
import ProfileForm from "./ProfileForm/ProfileForm";
import PasswordForm from "./PasswordForm/PasswordForm";

const Profile = (props) => {
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState("");

  const [openProfileForm, setOpenProfileForm] = useState(false);
  const [openPasswordForm, setOpenPasswordForm] = useState(false);

  const imageSelected = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
      setOpen(true);
    }
  };

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
      <UploadImage
        photo={photo}
        open={open}
        setOpen={setOpen}
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
                <Text fontWeight={500}>{props.user.idType}</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.identityDocument}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <WcIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Sexo</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.sex}</Text>
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
                  {prettyDate(props.user.dateBirth)} ({props.user.age} años)
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
                <Text fontWeight={500}>Tel / Cel (1)</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.phone1}</Text>
              </TableCell>
            </TableRowNoBorder>
            <TableRowNoBorder hover={true}>
              <TableCell align="center" component="th" scope="row">
                <PhoneIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Tel / Cel (2)</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.phone2}</Text>
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
                  src={props.user.signature || "/"}
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
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// const Profile = (props) => {
//   return (
//     <>
//       <Content user={props.user} setUser={props.setUser} />
//       <Routes>
//         <Route
//           path="edit/"
//           element={<ProfileForm user={props.user} setUser={props.setUser} />}
//         />
//         <Route path="changePassword/" element={<h1>Cógelo Easy!</h1>} />
//       </Routes>
//     </>
//   );
// };

export default Profile;
