import React, { useContext, useEffect, useState } from "react";
import { Box, Pagination } from "@mui/material";

import ButtonSecondary from "../../../../../UI/Buttons/ButtonSecondary";

import EditIcon from "@mui/icons-material/Edit";
import CoursesTable from "./CoursesTable/CoursesTable";
import { useParams } from "react-router-dom";
import CoursesForm from "./CoursesForm/CoursesForm";
import { getTokens, refreshTokens, urlAPI } from "../../../../../utils/utils";
import { AuthContext } from "../../../../../context/AuthContext";

const Courses = (props) => {
  const [reload, setReload] = useState(false);
  const [open, setOpen] = useState(false);
  const authCtx = useContext(AuthContext);
  const params = useParams();
  const [page, setPage] = useState(1);
  const [attendances, setAttendances] = useState([]);
  const [paginationCount, setPaginationCount] = useState(0);

  useEffect(() => {
    const getAttendances = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + "courses/attendances/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify({
          page,
          username: params.username,
        }),
      });

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

      setPaginationCount(data.paginationCount);
      setAttendances(data.page);
    };

    getAttendances();
    if (reload) setReload(false);
  }, [authCtx.setUser, page, params.username, reload]);

  return (
    <>
      <CoursesForm setReload={setReload} open={open} setOpen={setOpen} />
      <Box textAlign="center" p={3}>
        <ButtonSecondary startIcon={<EditIcon />} onClick={() => setOpen(true)}>
          Clases
        </ButtonSecondary>
      </Box>
      <br />
      <CoursesTable attendances={attendances} />
      <Pagination
        size="large"
        count={paginationCount}
        variant="outlined"
        color="primary"
        sx={{ "& ul": { justifyContent: "center" }, p: 3 }}
        page={page}
        onChange={(e, value) => setPage(value)}
      />
    </>
  );
};

export default Courses;
