import React from "react";
import {
  Table,
  TableContainer,
  Typography as Text,
  Paper,
  TableHead,
  TableCell,
  TableBody,
} from "@mui/material";
import TableRowNoBorder from "../../../../../UI/Tables/TableRows/TableRowNoBorder";

import * as styles from "./CoursesTableStyles";
import { getHour, weekday } from "../../../../../utils/utils";

const CoursesTable = ({ schedules }) => {
  return (
    <TableContainer component={Paper} sx={styles.table}>
      <Table size="small" aria-label="simple table">
        <TableHead>
          <TableRowNoBorder hover={true}>
            <TableCell align="center">
              <Text fontWeight={600}>Día</Text>
            </TableCell>
            <TableCell align="center">
              <Text fontWeight={600}>Inicia</Text>
            </TableCell>
            <TableCell align="center">
              <Text fontWeight={600}>Termina</Text>
            </TableCell>
          </TableRowNoBorder>
        </TableHead>
        <TableBody>
          {schedules.map((item, index, arr) => (
            <TableRowNoBorder key={index} hover={true}>
              <TableCell align="center" component="th" scope="row">
                <Text>{weekday[item.weekday]}</Text>
              </TableCell>
              <TableCell align="center">
                <Text>{getHour(item.start_time)}</Text>
              </TableCell>
              <TableCell align="center">
                <Text>{getHour(item.end_time)}</Text>
              </TableCell>
            </TableRowNoBorder>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoursesTable;
