import React from "react";

import {
  Typography as Text,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
} from "@mui/material";

import TableRowBorder from "../../../../UI/Tables/TableRows/TableRowBorder";
import { completeDate, getHour } from "../../../../utils/utils";
import { useNavigate } from "react-router-dom";

const CoursesTable = (props) => {
  const navigate = useNavigate();

  return (
    <TableContainer>
      <Table aria-label="simple table" size="small">
        <TableHead sx={{ backgroundColor: "blue.font" }}>
          <TableRowBorder>
            <TableCell>
              <Text fontWeight={500} color="blue.light">
                No.
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
          {props.courses.map((item, index, arr) => (
            <TableRowBorder
              key={item.id}
              hover={true}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate(`/admin/courses/${item.id}`)}
            >
              <TableCell>
                <Text>{item.count}</Text>
              </TableCell>
              <TableCell>
                <Text>{completeDate(item.date)}</Text>
              </TableCell>
              <TableCell>
                <Text>{getHour(item.start_time)}</Text>
              </TableCell>
              <TableCell>
                <Text>{getHour(item.end_time)}</Text>
              </TableCell>
            </TableRowBorder>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoursesTable;
