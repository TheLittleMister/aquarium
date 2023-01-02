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

import * as styles from "./SchedulesTableStyles";
import TableRowNoBorder from "../../../../UI/Tables/TableRows/TableRowNoBorder";

import ScheduleItem from "./ScheduleItem/ScheduleItem";

const SchedulesTable = ({ schedules, setReload }) => {
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
            <TableCell align="center">
              <Text fontWeight={600}>•</Text>
            </TableCell>
          </TableRowNoBorder>
        </TableHead>
        <TableBody>
          {schedules.map((item, index, arr) => (
            <React.Fragment key={index}>
              <ScheduleItem item={item} setReload={setReload} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default SchedulesTable;
