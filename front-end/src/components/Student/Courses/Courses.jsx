import React, { useState, useEffect, useContext } from "react";

import { Box, Pagination } from "@mui/material";

import { AuthContext } from "../../../context/AuthContext";
import { getTokens, refreshTokens, urlAPI } from "../../../utils/utils";
import CoursesTable from "./CoursesTable/CoursesTable";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";

const Courses = () => {
  const authCtx = useContext(AuthContext);
  const [resultCount, setResultCount] = useState(0);
  const [paginationCount, setPaginationCount] = useState(0);
  const [attendances, setAttendances] = useState([]);
  const [page, setPage] = useState(1);

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
          username: authCtx.user.username,
        }),
      });

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getAttendances();
        return;
      }

      setResultCount(data.count);
      setPaginationCount(data.paginationCount);
      setAttendances(data.page);
    };

    getAttendances();
  }, [authCtx.setUser, page, authCtx.user.username]);

  return (
    <Box>
      <ChipPrimary label={`${resultCount} resultados`} sx={{ m: 1 }} />
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
    </Box>
  );
};

export default Courses;
