import React, { useEffect, useContext, useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography as Text,
} from "@mui/material";
import {
  completeDate,
  shortDate,
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../utils/utils";

import logo from "./images/logo.png";
import TableRowNoBorder from "../../../../../UI/Tables/TableRows/TableRowNoBorder";

import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import { AuthContext } from "../../../../../context/AuthContext";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

import * as styles from "./CoursePrintStyles";

const CoursePrint = ({ course }) => {
  const authCtx = useContext(AuthContext);

  const [attendances, setAttendances] = useState();
  const [attendancesTotal, setAttendancesTotal] = useState(0);
  const [ready, setReady] = useState(false);


  useEffect(() => {
    const getAttendances = async () => {
      const tokens = getTokens();

      const result = await fetch(
        urlAPI + `courses/printCourse/?id=${course.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokens.access,
          },
        }
      );

      const data = await result.json();

      if (!result.ok) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getAttendances();
        return;
      }
      setAttendances(data.attendances);
      setAttendancesTotal(data.attendances.length);
      setReady(true);
      await new Promise((r) => setTimeout(r, 2000));
      window.print();
    };

    getAttendances();
  }, [authCtx.setUser, course.id]);

  return (
    <Container maxWidth="lg">
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        marginTop={7}
      >
        <Box width="50%">
          <Text>{completeDate(course.date)}</Text>
          <Text>
            DE {getHour(course.start_time)} A {getHour(course.end_time)}
          </Text>
          <br />
          <Text>
            {attendancesTotal} ESTUDIANTES
          </Text>
        </Box>
        <Box width="50%">
          <img
            src={logo}
            style={{ maxWidth: "100%" }}
            alt="Aquarium School Logo"
          />
        </Box>
      </Stack>
      <br />
      <hr />
      <br />
      <TableContainer>
        {!ready
          ? "Loading..."
          : attendances.map((item, index, arr) => {
            return (
              <React.Fragment key={index}>
                <Table aria-label="simple table" size="small">
                  <TableBody>
                    <TableRowNoBorder>
                      <TableCell>
                        <Stack direction="row" gap={1}>
                          <Text variant="body2">{index + 1}.</Text>
                          <CircleOutlinedIcon
                            color="primary"
                            fontSize="small"
                          />
                          <Text variant="body2">
                            {item.name}
                            <Button
                              sx={styles.spaceButton}
                              size="small"
                              onClick={(e) =>
                                e.target.parentElement.parentElement.parentElement.parentElement.before(
                                  document.createElement("br")
                                )
                              }
                            >
                              +
                            </Button>
                            <Button
                              sx={styles.spaceButton}
                              size="small"
                              onClick={(e) =>
                                e.target.parentElement.parentElement
                                  .parentElement.parentElement.parentElement
                                  .firstChild.nodeName === "BR" &&
                                e.target.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.remove()
                              }
                            >
                              -
                            </Button>
                          </Text>
                        </Stack>
                      </TableCell>

                      <TableCell align="right">
                        <Text variant="caption">
                          {item.recover && " • RECUPERA CLASE"}
                          {item.cycleStatus && " • INICIA CICLO"}
                          {item.endCycleStatus && " • TERMINA CICLO"}
                          {item.onlyday && " • SOLO DÍA"}
                          {item.lastCourse && " • ÚLTIMA CLASE"}
                        </Text>
                      </TableCell>
                    </TableRowNoBorder>
                  </TableBody>
                </Table>

                <Grid container wrap="wrap">
                  {item.cycle &&
                    item.cycle.map((item, index, arr) => {
                      return (
                        <Grid item xs key={index} sx={styles.gridItem}>
                          <Table aria-label="simple table" size="small">
                            <TableHead>
                              <TableRowNoBorder>
                                <TableCell>
                                  <Text
                                    fontSize={10}
                                    fontWeight="bold"
                                    textAlign="center"
                                  >
                                    {shortDate(item.course__date)}
                                  </Text>
                                </TableCell>
                              </TableRowNoBorder>
                            </TableHead>
                            <TableBody>
                              <TableRowNoBorder>
                                <TableCell>
                                  <Grid container wrap="wrap">
                                    <Grid item xs>
                                      <Text fontSize={8} fontWeight="bold">
                                        {item.attendance ? (
                                          <CheckIcon fontSize="small" />
                                        ) : new Date(
                                          new Date()
                                            .toISOString()
                                            .split("T")[0] + " "
                                        ) >
                                          new Date(
                                            item.course__date + " "
                                          ) ? (
                                          <CloseIcon fontSize="small" />
                                        ) : (
                                          course.date === item.course__date &&
                                          "ESTE DÍA"
                                        )}
                                      </Text>
                                    </Grid>
                                    <Grid item xs>
                                      {item.recover && (
                                        <Text fontSize={8} fontWeight="bold">
                                          RECUPERA
                                        </Text>
                                      )}
                                      {item.note && (
                                        <Text fontSize={8} fontWeight="bold">
                                          {item.note.toUpperCase()}
                                        </Text>
                                      )}
                                    </Grid>
                                  </Grid>
                                </TableCell>
                              </TableRowNoBorder>
                            </TableBody>
                          </Table>
                        </Grid>
                      );
                    })}
                </Grid>
                <br />
              </React.Fragment>
            );
          })}
      </TableContainer>
    </Container>
  );
};

export default CoursePrint;
