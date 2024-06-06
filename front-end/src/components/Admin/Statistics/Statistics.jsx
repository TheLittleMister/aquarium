import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Stack,
  TextField,
  Typography as Text,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AuthContext } from "../../../context/AuthContext";
import {
  completeDate,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../utils/utils";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import StatisticsChart from "./StatisticsChart/StatisticsChart";

const Statistics = () => {
  const authCtx = useContext(AuthContext);

  // const tomorrow = new Date();
  // tomorrow.setDate(tomorrow.getDate() + 1);

  const [data, setData] = useState({ dates: [], students_count: [] });
  const [date, setDate] = useState(new Date());
  const [lastN, setLastN] = useState(30);

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
          date,
          lastN,
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
        (item, index) => (data.dates[index] = completeDate(item))
      );

      setData(data);
    };

    getStatistics();
  }, [date, lastN, authCtx.setUser]);

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
        <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
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
          </Select>
        </FormControl>
        <Box sx={{ width: "25rem" }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              name="statistics_date"
              inputFormat="dd/MM/yyyy"
              label="Hasta la fecha"
              value={date}
              maxDate={date}
              onChange={(newValue) => {
                setDate(newValue);
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
