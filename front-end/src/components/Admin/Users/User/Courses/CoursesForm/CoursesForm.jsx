import React, { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import ModalTitle from "../../../../../../UI/Modals/ModalTitle";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import AddCourseForm from "./AddCourseForm/AddCourseForm";
import SelectCoursesForm from "./SelectCoursesForm/SelectCoursesForm";

import {
  completeDate,
  getHour,
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";
import { AuthContext } from "../../../../../../context/AuthContext";

const CoursesForm = (props) => {
  const params = useParams();
  const authCtx = useContext(AuthContext);
  const [dates, setDates] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const getCourses = async () => {
      const tokens = getTokens();
      const result = await fetch(
        urlAPI + `courses/addCourses/?username=${params.username}`,
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
        if (refreshed) getCourses();
        return;
      }

      setDates(
        data.courses.map((item, index, arr) => {
          return {
            date: (
              `${item.count} - ` +
              completeDate(item.date) +
              " de " +
              getHour(item.start_time) +
              " a " +
              getHour(item.end_time)
            ).toUpperCase(),
            default: item.default,
            id: item.id,
          };
        })
      );

      setReady(true);
    };

    getCourses();
  }, [authCtx.setUser, params.username]);

  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <ModalTitle>Editar Clases</ModalTitle>
      <AddCourseForm setDates={setDates} username={params.username} />
      <br />
      {ready && (
        <SelectCoursesForm
          dates={dates}
          setReload={props.setReload}
          username={params.username}
          setOpen={props.setOpen}
        />
      )}
    </ModalUI>
  );
};

export default CoursesForm;
