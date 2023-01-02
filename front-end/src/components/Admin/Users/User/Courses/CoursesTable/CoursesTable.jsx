import React from "react";
import { Table, TableBody, TableContainer } from "@mui/material";
import Attendance from "./Attendance/Attendance";

const CoursesTable = ({ attendances }) => {
  return (
    <TableContainer>
      <Table size="small">
        <TableBody>
          {attendances.map((attendance, index, arr) => (
            <React.Fragment key={attendance.id}>
              <Attendance attendance={attendance} />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CoursesTable;
