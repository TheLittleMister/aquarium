import React from "react";
import { Chart, registerables } from "chart.js";
import { Line } from "react-chartjs-2";
import { Box } from "@mui/material";

import classes from "./StatisticsChart.module.css";

Chart.register(...registerables);

const StatisticsChart = ({ data }) => {
  return (
    <Box className={classes["chart-container"]}>
      <Line
        data={{
          labels: data.dates,
          datasets: [
            {
              fill: true,
              label: "Número de estudiantes",
              data: data.students_count,
              backgroundColor: ["rgb(61, 107, 153, 0.5)"],
              borderColor: ["rgb(61, 107, 153, 1)"],
              borderWidth: 1,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              labels: {
                color: "#3d6b99",
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                color: "#3d6b99",
              },
            },
            x: {
              ticks: {
                color: "#3d6b99",
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </Box>
  );
};

export default StatisticsChart;
