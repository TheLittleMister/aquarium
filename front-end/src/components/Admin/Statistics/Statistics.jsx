import React, { useContext, useEffect, useState } from "react";
import { Box, Stack, TextField } from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import {
  getHour,
  getTokens,
  refreshTokens,
  shortDate,
  urlAPI,
} from "../../../utils/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import StatisticsChart from "./StatisticsChart/StatisticsChart";

const Statistics = () => {
  const authCtx = useContext(AuthContext);

  const tomorrow = new Date();
  // tomorrow.setDate(tomorrow.getDate() + 1);
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  const [data, setData] = useState({ dates: [], students_count: [] });
  const [fromDate, setFromDate] = useState(oneMonthAgo);
  const [toDate, setToDate] = useState(tomorrow);
  // const [lastN, setLastN] = useState(480);

  useEffect(() => {
    const getStatistics = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + "courses/statistics/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify({
          fromDate,
          toDate,
          // lastN,
        }),
      });

      const data = await result.json();

      if (result.status === 401) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getStatistics();
        return;
      }

      data.dates.forEach(
        (item, index) =>
          (data.dates[index] =
            shortDate(item) + " " + getHour(data.start_times[index]))
      );

      setData(data);
    };

    getStatistics();
  }, [fromDate, toDate, authCtx.setUser]);

  return (
    <Box>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        flexWrap="wrap"
        p={2}
        gap={1}
      >
        {/* <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="lastN-select-small">Número de cursos</InputLabel>
          <Select
            labelId="lastN-select-small"
            id="lastN-select-small"
            value={lastN}
            label="Orden"
            autoWidth
            onChange={(e) => setLastN(e.target.value)}
            sx={{ backgroundColor: "transparent" }}
          >
            <MenuItem value={0}>
              <Text>TODO</Text>
            </MenuItem>
            <MenuItem value={30}>
              <Text>30</Text>
            </MenuItem>
            <MenuItem value={60}>
              <Text>60</Text>
            </MenuItem>
            <MenuItem value={120}>
              <Text>120</Text>
            </MenuItem>
            <MenuItem value={240}>
              <Text>240</Text>
            </MenuItem>
            <MenuItem value={480}>
              <Text>480</Text>
            </MenuItem>
          </Select>
        </FormControl> */}
        <Box sx={{ width: "25rem" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              name="statistics_date"
              inputFormat="dd/MM/yyyy"
              label="Desde la fecha"
              value={fromDate}
              maxDate={tomorrow}
              onChange={(newValue) => {
                setFromDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
        <Box sx={{ width: "25rem" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              name="statistics_date"
              inputFormat="dd/MM/yyyy"
              label="Hasta la fecha"
              value={toDate}
              maxDate={tomorrow}
              onChange={(newValue) => {
                setToDate(newValue);
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
        </Box>
      </Stack>
      <StatisticsChart data={data} />
    </Box>
  );
};

export default Statistics;
