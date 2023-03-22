import React from "react";

import {
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
import SchoolIcon from "@mui/icons-material/School";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";

import TableRowNoBorder from "../../../../../UI/Tables/TableRows/TableRowNoBorder";
import { prettyDate } from "../../../../../utils/utils";

const Profile = (props) => {
  return (
    <>
      <TableContainer sx={{ mt: 10 }}>
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
                <Text>{props.user.firstName.slice(0, 15)}</Text>
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
                <Text>{props.user.lastName.slice(0, 15)}</Text>
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
                <Text>{props.user.identityDocument.slice(0, 15)}</Text>
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
                <SchoolIcon sx={{ color: "blue.font" }} />
              </TableCell>
              <TableCell>
                <Text fontWeight={500}>Profesor</Text>
              </TableCell>
              <TableCell>
                <Text>{props.user.teacher.slice(0, 15)}</Text>
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
                <Text>{props.user.parent.slice(0, 15)}</Text>
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
                <Text>{props.user.email.slice(0, 15)}</Text>
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
                <Text>{props.user.phone1.slice(0, 15)}</Text>
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
                <Text>{props.user.phone2.slice(0, 15)}</Text>
              </TableCell>
            </TableRowNoBorder>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Profile;
