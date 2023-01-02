import React from "react";

import {
  Typography as Text,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Chip,
} from "@mui/material";

import TableRowBorder from "../../../../../../UI/Tables/TableRows/TableRowBorder";
import { completeDate, getHour } from "../../../../../../utils/utils";

const CoursesTable = ({ attendances }) => {
  const today = new Date();

  return (
    <TableContainer>
      <Table aria-label="simple table" size="small">
        <TableHead sx={{ backgroundColor: "blue.font" }}>
          <TableRowBorder>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Asistencia
              </Text>
            </TableCell>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Fecha
              </Text>
            </TableCell>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Inicio
              </Text>
            </TableCell>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                Termina
              </Text>
            </TableCell>
          </TableRowBorder>
        </TableHead>
        <TableBody sx={{ backgroundColor: "blue.light" }}>
          {attendances.map((item, index, arr) => (
            <TableRowBorder key={item.id} hover={true}>
              <TableCell>
                <Text variant="subtitle1">
                  {item.attendance ? (
                    <Chip label={"ASISTIÓ"} color="success" />
                  ) : new Date(item.course__date + " ") < today ? (
                    <Chip label={"NO ASISTIÓ"} color="error" />
                  ) : (
                    <Chip label={"PENDIENTE"} />
                  )}
                </Text>
              </TableCell>
              <TableCell>
                <Text>{completeDate(item.course__date)}</Text>
              </TableCell>
              <TableCell>
                <Text>{getHour(item.course__start_time)}</Text>
              </TableCell>
              <TableCell>
                <Text>{getHour(item.course__end_time)}</Text>
              </TableCell>
            </TableRowBorder>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoursesTable;
