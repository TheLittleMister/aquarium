import React, { useContext, useEffect, useState } from "react";

import {
  Container,
  Dialog,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";

import {
  Link,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { AuthContext } from "../../../../context/AuthContext";
import {
  completeDate,
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../utils/utils";
import Attendance from "./Attendance/Attendance";
import ModalTitle from "../../../../UI/Modals/ModalTitle";
import ButtonDanger from "../../../../UI/Buttons/ButtonDanger";
import ButtonWarning from "../../../../UI/Buttons/ButtonWarning";
import ButtonSecondary from "../../../../UI/Buttons/ButtonSecondary";
import CourseForm from "./CourseForm/CourseForm";
import CourseDelete from "./CourseDelete/CourseDelete";

import CloseIcon from "@mui/icons-material/Close";

import * as styles from "./CourseStyles";
import CoursePrint from "./CoursePrint/CoursePrint";
import ChipPrimary from "../../../../UI/Chips/ChipPrimary";
import ButtonLoading from "../../../../UI/Buttons/ButtonLoading";

const Content = ({ course }) => {
  const [attendancesCount, setAttendancesCount] = useState(
    course.attendances.filter((item, index, arr) => item.attendance === true)
      .length
  );

  return (
    <Container>
      <br />
      <Stack>
        <ModalTitle>
          {completeDate(course.course.date)} DE{" "}
          {getHour(course.course.start_time)} A{" "}
          {getHour(course.course.end_time)}
          <br />
          <ChipPrimary
            label={`ASISTENCIAS: ${attendancesCount} / ${course.attendances.length}`}
          />
        </ModalTitle>
        <Stack direction="row" justifyContent="space-around" p={2}>
          <Link to="print/">
            <ButtonWarning>Imprimir</ButtonWarning>
          </Link>
          <Link to="edit/">
            <ButtonSecondary>Editar</ButtonSecondary>
          </Link>
          <Link to="delete/">
            <ButtonDanger>Eliminar</ButtonDanger>
          </Link>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {course.attendances.map((attendance, index, arr) => (
                <React.Fragment key={attendance.id}>
                  <Attendance
                    count={index + 1}
                    attendance={attendance}
                    courseDate={course.course.date}
                    setAttendancesCount={setAttendancesCount}
                  />
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

const Course = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const { state } = useLocation();
  const authCtx = useContext(AuthContext);
  const [ready, setReady] = useState(false);
  const [course, setCourse] = useState({});

  useEffect(() => {
    const getCourse = async () => {
      const tokens = getTokens();

      const result = await fetch(
        urlAPI + `courses/course/?id=${params.course ? params.course : ""}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + tokens.access,
          },
        }
      );

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getCourse();
        return;
      }

      // console.log(data, "🤍 + 🍏 = 💚");

      setCourse(data);

      if (state) props.setClosePath(state.previousPath);
      setReady(true);
    };

    getCourse();
    if (props.reload) {
      props.setReload(false);
      setReady(false);
    }
  }, [params.course, authCtx.setUser, props, state]);

  return !ready ? (
    <ButtonLoading loading>Cargando Curso</ButtonLoading>
  ) : (
    <>
      <Content course={course} />
      <Routes>
        <Route
          path="print/"
          element={
            <Dialog fullScreen open={true}>
              <IconButton
                edge="end"
                color="primary"
                onClick={() => navigate(-1)}
                aria-label="close"
                sx={styles.iconButton}
              >
                <CloseIcon />
              </IconButton>
              <CoursePrint course={course.course} />
            </Dialog>
          }
        />
        <Route
          path="edit/"
          element={
            <CourseForm
              courseID={params.course}
              course={course.course}
              setReload={props.setReload}
            />
          }
        />
        <Route
          path="delete/"
          element={
            <CourseDelete course={course.course} setReload={props.setReload} />
          }
        />
      </Routes>
    </>
  );
};

export default Course;
