import React, { useContext, useState } from "react";
import {
  Box,
  IconButton,
  TableCell,
  Tooltip,
  Typography as Text,
} from "@mui/material";
import TableRowBorder from "../../../../../../../UI/Tables/TableRows/TableRowBorder";

import DescriptionIcon from "@mui/icons-material/Description";

import ButtonSuccess from "../../../../../../../UI/Buttons/ButtonSuccess";
import TableRowNoBorder from "../../../../../../../UI/Tables/TableRows/TableRowNoBorder";
import {
  completeDate,
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../../utils/utils";
import ButtonDanger from "../../../../../../../UI/Buttons/ButtonDanger";
import ButtonGrey from "../../../../../../../UI/Buttons/ButtonGrey";
import ButtonSecondary from "../../../../../../../UI/Buttons/ButtonSecondary";
import ButtonWarning from "../../../../../../../UI/Buttons/ButtonWarning";
import { AuthContext } from "../../../../../../../context/AuthContext";

import Note from "./Note/Note";
import { useLocation, useNavigate } from "react-router-dom";

const Attendance = ({ attendance }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const authCtx = useContext(AuthContext);

  const [open, setOpen] = useState(false);
  const [note, setNote] = useState(attendance.note);
  const [attendanceStatus, setAttendanceStatus] = useState(
    attendance.attendance
  );
  const [cycle, setCycle] = useState(attendance.cycle);
  const [endCycle, setEndCycle] = useState(attendance.end_cycle);
  const [quota, setQuota] = useState(attendance.quota);
  const [recover, setRecover] = useState(attendance.recover);
  const [onlyDay, setOnlyDay] = useState(attendance.onlyday);

  const today = new Date();
  const date = new Date(attendance.course__date + " ");

  const change = async (type) => {
    const tokens = getTokens();

    const result = await fetch(urlAPI + "courses/change/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access,
      },
      body: JSON.stringify({ id: attendance.id, type }),
    });

    const data = await result.json();

    if (result.status === 401) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );
      if (refreshed) change();
      return;
    }

    if (type === "attendance") setAttendanceStatus(data.attendance);
    if (type === "quota") setQuota(data.quota);
    if (type === "cycle") {
      setCycle(data.cycle);
      setEndCycle(data.endCycle);
    }
    if (type === "day") {
      setRecover(data.recover);
      setOnlyDay(data.onlyDay);
    }
  };

  return (
    <>
      <Note
        open={open}
        setOpen={setOpen}
        setNote={setNote}
        note={note}
        attendanceID={attendance.id}
      />
      <TableRowBorder
        sx={{
          cursor: "pointer",
          marginTop: 2,
          backgroundColor: "blue.font",
        }}
        onClick={() =>
          navigate(`/admin/courses/${attendance.course__id}`, {
            state: { previousPath: pathname },
          })
        }
      >
        <TableCell align="left">
          <Text color="blue.light">
            {completeDate(attendance.course__date)}
          </Text>
        </TableCell>
        <TableCell align="center">
          <Text color="blue.light">
            {getHour(attendance.course__start_time)}
          </Text>
        </TableCell>
        <TableCell align="center">
          <Text color="blue.light">{getHour(attendance.course__end_time)}</Text>
        </TableCell>

        <TableCell align="center">
          <Text color="blue.light">{attendance.count}</Text>
        </TableCell>
      </TableRowBorder>
      <TableRowNoBorder
        hover={true}
        sx={{
          border: "0.2rem solid",
          borderColor: "blue.font",
        }}
      >
        <TableCell align="center">
          <Box sx={{ display: "flex", justifyContent: "space-around" }}>
            {attendanceStatus ? (
              <ButtonSuccess onClick={change.bind(null, "attendance")}>
                Asistió
              </ButtonSuccess>
            ) : date < today ? (
              <ButtonDanger onClick={change.bind(null, "attendance")}>
                No Asistió
              </ButtonDanger>
            ) : (
              <ButtonGrey onClick={change.bind(null, "attendance")}>
                Pendiente
              </ButtonGrey>
            )}
            {quota === "PAGO" ? (
              <ButtonSuccess onClick={change.bind(null, "quota")}>
                {quota}
              </ButtonSuccess>
            ) : (
              <ButtonGrey onClick={change.bind(null, "quota")}>
                {quota}
              </ButtonGrey>
            )}
          </Box>
        </TableCell>
        <TableCell align="center">
          {cycle ? (
            <ButtonWarning onClick={change.bind(null, "cycle")}>
              Inicia
            </ButtonWarning>
          ) : endCycle ? (
            <ButtonWarning onClick={change.bind(null, "cycle")}>
              Termina
            </ButtonWarning>
          ) : (
            <ButtonGrey onClick={change.bind(null, "cycle")}>
              Ciclo Normal
            </ButtonGrey>
          )}
        </TableCell>

        <TableCell align="center">
          {recover ? (
            <ButtonSecondary onClick={change.bind(null, "day")}>
              Recupera
            </ButtonSecondary>
          ) : onlyDay ? (
            <ButtonSecondary onClick={change.bind(null, "day")}>
              Solo día
            </ButtonSecondary>
          ) : (
            <ButtonGrey onClick={change.bind(null, "day")}>
              Día Normal
            </ButtonGrey>
          )}
        </TableCell>

        <TableCell align="center">
          <Tooltip title={note || ""} placement="right">
            <IconButton onClick={() => setOpen(true)}>
              <DescriptionIcon color={note ? "info" : ""} />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRowNoBorder>
    </>
  );
};

export default Attendance;
