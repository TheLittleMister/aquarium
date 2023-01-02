import React from "react";

import {
  Typography as Text,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Tooltip,
} from "@mui/material";

import TableRowBorder from "../../../../UI/Tables/TableRows/TableRowBorder";
import { prettyDate } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";

const UsersTable = ({ users }) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table aria-label="simple table" size="small">
        <TableHead sx={{ backgroundColor: "blue.font" }}>
          <TableRowBorder>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Documento
              </Text>
            </TableCell>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Nombres
              </Text>
            </TableCell>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Apellidos
              </Text>
            </TableCell>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Teléfono
              </Text>
            </TableCell>
          </TableRowBorder>
        </TableHead>
        <TableBody sx={{ backgroundColor: "blue.light" }}>
          {users.map((item, index, arr) => (
            <Tooltip
              key={index}
              title={
                item.real_last_login
                  ? prettyDate(item.real_last_login.split("T")[0])
                  : "Nunca"
              }
              placement="right"
            >
              <TableRowBorder
                hover={true}
                sx={{ cursor: "pointer" }}
                onClick={() => navigate(`/teacher/users/${item.username}`)}
              >
                <TableCell>
                  <Text>{item.identity_document}</Text>
                </TableCell>
                <TableCell>
                  <Text>{item.first_name}</Text>
                </TableCell>
                <TableCell>
                  <Text>{item.last_name}</Text>
                </TableCell>
                <TableCell>
                  <Text>{item.phone_1}</Text>
                </TableCell>
              </TableRowBorder>
            </Tooltip>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default UsersTable;
