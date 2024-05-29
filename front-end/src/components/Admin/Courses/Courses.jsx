import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
} from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import { getTokens, refreshTokens, urlAPI } from "../../../utils/utils";
import CoursesTable from "./CoursesTable/CoursesTable";
// import Form from "../../../UI/Forms/Form";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";

import { Route, Routes, useNavigate } from "react-router-dom";
import Course from "./Course/Course";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";
// import ModalUI from "../../../UI/Modals/ModalUI";

const Content = (props) => {
  const authCtx = useContext(AuthContext);

  const [resultCount, setResultCount] = useState(0);
  // const [avgAttendances, setAvgAttendances] = useState(0);
  const [paginationCount, setPaginationCount] = useState(0);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);

  // Search Courses States
  const [search, setSearch] = useState(null);

  useEffect(() => {
    const getCourses = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + "courses/courses/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify({
          page,
          search,
        }),
      });

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getCourses();
        return;
      }

      setResultCount(data.count);
      setPaginationCount(data.paginationCount);
      setCourses(data.page);
    };

    getCourses();
    // getAvgAttendances();

    if (props.reload) props.setReload(false);
  }, [authCtx.setUser, page, search, props]);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        p={2}
        gap={0.4}
      >
        <Box sx={{ width: "25rem" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              name="date_birth"
              inputFormat="dd/MM/yyyy"
              label="Buscar Clases "
              value={search}
              onChange={(newValue) => {
                setSearch(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Tooltip title="Borrar Búsqueda" placement="top">
          <IconButton onClick={() => setSearch(null)}>
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Stack>

      <ChipPrimary label={`${resultCount} resultados`} sx={{ m: 1 }} />
      {/* <ChipPrimary
        label={`Cantidad promedio de asistencias: ${avgAttendances}`}
        sx={{ m: 1 }}
      /> */}

      <CoursesTable courses={courses} />

      <Pagination
        size="large"
        count={paginationCount}
        variant="outlined"
        color="primary"
        sx={{ "& ul": { justifyContent: "center" }, p: 3 }}
        page={page}
        onChange={(e, value) => setPage(value)}
      />
    </Box>
  );
};

const Courses = () => {
  const navigate = useNavigate();
  const [reload, setReload] = useState(false);
  const [closePath, setClosePath] = useState("/admin/courses/");

  return (
    <>
      <Content reload={reload} setReload={setReload} />
      <Routes>
        <Route
          path=":course/*"
          element={
            // <ModalUI open={true} closePath={"/admin/courses/"}>
            //   <Course
            //     reload={reload}
            //     setReload={setReload}
            //     setClosePath={setClosePath}
            //   />
            // </ModalUI>
            <Dialog fullScreen open={true}>
              <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => navigate(closePath)}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <Course
                reload={reload}
                setReload={setReload}
                setClosePath={setClosePath}
              />
            </Dialog>
          }
        />
      </Routes>
    </>
  );
};

export default Courses;
