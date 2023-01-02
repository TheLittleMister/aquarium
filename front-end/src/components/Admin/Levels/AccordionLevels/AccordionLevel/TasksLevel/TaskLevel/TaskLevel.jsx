import React, { useState } from "react";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import TasksForm from "../TasksForm/TasksForm";
import TaskDelete from "./TaskDelete/TaskDelete";

const TaskLevel = ({ task, levelID, setReload }) => {
  const [openTasksForm, setOpenTasksForm] = useState(false);
  const [openTaskDelete, setOpenTaskDelete] = useState(false);

  return (
    <>
      <TasksForm
        open={openTasksForm}
        setOpen={setOpenTasksForm}
        levelID={levelID}
        setReload={setReload}
        task={task}
      />
      <TaskDelete
        open={openTaskDelete}
        setOpen={setOpenTaskDelete}
        setReload={setReload}
        task={task}
      />
      <ListItem>
        <ListItemIcon>
          <Tooltip title="Editar">
            <IconButton onClick={() => setOpenTasksForm(true)}>
              <EditIcon color="primary" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Eliminar">
            <IconButton onClick={() => setOpenTaskDelete(true)}>
              <DeleteIcon color="primary" />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
        <ListItemText primary={task.task} />
      </ListItem>
      <Divider light />
    </>
  );
};

export default TaskLevel;
