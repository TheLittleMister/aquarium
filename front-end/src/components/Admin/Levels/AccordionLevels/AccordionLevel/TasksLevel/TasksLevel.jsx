import React, { useContext, useEffect, useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { AuthContext } from "../../../../../../context/AuthContext";
import {
  getTokens,
  refreshTokens,
  urlAPI,
} from "../../../../../../utils/utils";

import AddIcon from "@mui/icons-material/Add";

import * as styles from "./TasksLevelStyles";
import TaskLevel from "./TaskLevel/TaskLevel";
import ButtonSecondary from "../../../../../../UI/Buttons/ButtonSecondary";
import TasksForm from "./TasksForm/TasksForm";

const TasksLevel = (props) => {
  const authCtx = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [openTasksForm, setOpenTasksForm] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    const getTasks = async () => {
      const tokens = getTokens();

      const result = await fetch(
        urlAPI + `courses/tasks/?levelID=${props.id}`,
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

        if (refreshed) getTasks();
        return;
      }

      setTasks(data.tasks);
    };

    getTasks();

    if (reload) setReload(false);
  }, [authCtx.setUser, props.id, reload]);

  return (
    <>
      <TasksForm
        open={openTasksForm}
        setOpen={setOpenTasksForm}
        levelID={props.id}
        setReload={setReload}
      />
      <List sx={styles.list}>
        {tasks.map((content, indexContent, arrContent) => (
          <React.Fragment key={indexContent}>
            <TaskLevel
              task={content}
              levelID={props.id}
              setReload={setReload}
            />
          </React.Fragment>
        ))}
        <ListItem>
          <ListItemIcon sx={styles.listItemIcon}>
            <Tooltip title="Agregar">
              <IconButton onClick={() => setOpenTasksForm(true)}>
                <AddIcon color="primary" />
              </IconButton>
            </Tooltip>
          </ListItemIcon>
          <ListItemText
            primary={
              <ButtonSecondary onClick={() => setOpenTasksForm(true)}>
                Agregar Actividad
              </ButtonSecondary>
            }
          />
        </ListItem>
      </List>
    </>
  );
};

export default TasksLevel;
