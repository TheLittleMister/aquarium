import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Tooltip,
  Typography as Text,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import * as styles from "./AccordionLevelStyles";
import LevelsForm from "../../LevelsForm/LevelsForm";
import LevelDelete from "./LevelDelete/LevelDelete";
import TasksLevel from "./TasksLevel/TasksLevel";

const AccordionLevel = ({ item, index, setReload }) => {
  const [expanded, setExpanded] = useState(false);
  const [openLevelsForm, setOpenLevelsForm] = useState(false);
  const [openLevelDelete, setOpenLevelDelete] = useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <LevelsForm
        open={openLevelsForm}
        setOpen={setOpenLevelsForm}
        level={item}
        setReload={setReload}
      />
      <LevelDelete
        open={openLevelDelete}
        setOpen={setOpenLevelDelete}
        level={item}
        setReload={setReload}
      />
      <Accordion
        key={index}
        sx={styles.accordion}
        expanded={expanded === `panel${index}`}
        onChange={handleChange(`panel${index}`)}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`panel${index}bh-content`}
          id={`panel${index}bh-header`}
        >
          <Text>
            <Tooltip title="Editar">
              <IconButton onClick={() => setOpenLevelsForm(true)}>
                <EditIcon color="primary" />
              </IconButton>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => setOpenLevelDelete(true)}>
                <DeleteIcon color="primary" />
              </IconButton>
            </Tooltip>
            {item.name}
          </Text>
        </AccordionSummary>
        <AccordionDetails>
          <TasksLevel id={item.id} />
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default AccordionLevel;
