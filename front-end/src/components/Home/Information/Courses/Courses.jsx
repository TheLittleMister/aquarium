import React, { useEffect, useState } from "react";
import { Box, Typography as Text } from "@mui/material";

import * as styles from "./CoursesStyles";
import CoursesTable from "./CoursesTable/CoursesTable";
import CoursesAccordion from "./CoursesAccordion/CoursesAccordion";
import { urlAPI } from "../../../../utils/utils";

const Courses = () => {
  const [price, setPrice] = useState(0);
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    const getSchedules = async () => {
      const result = await fetch(urlAPI + `courses/schedulesInfo/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();

      setPrice(data.price);
      setSchedules(data.schedules);
    };

    getSchedules();
  }, []);

  return (
    <Box flex={1} sx={styles.coursesBox}>
      <Text
        variant="h5"
        fontWeight={600}
        color="blue.light"
        textAlign={"center"}
        sx={styles.coursesTitle}
      >
        Clases
      </Text>
      <Box p={3} sx={styles.cost}>
        <Text variant="h6">Mensualidad: ${price}</Text>
        <Text>Una clase por semana para un total de 4 clases al mes.</Text>
        <br />
        <CoursesTable schedules={schedules} />
        <br />
        <CoursesAccordion />
      </Box>
    </Box>
  );
};

export default Courses;
