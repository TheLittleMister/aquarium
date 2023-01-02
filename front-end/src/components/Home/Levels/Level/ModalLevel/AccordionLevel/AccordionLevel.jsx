import React, { useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography as Text,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";

import * as styles from "./AccordionLevelStyles";

const AccordionLevel = (props) => {
  const [expanded, setExpanded] = useState(false);

  const handleChange = (panel) => (event, isExpanded) =>
    setExpanded(isExpanded ? panel : false);

  return (
    <>
      {props.levels.map((item, index, arr) => (
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
            <Text>{item.name}</Text>
          </AccordionSummary>
          <AccordionDetails>
            <List sx={styles.list}>
              {item.content.map((content, indexContent, arrContent) => (
                <React.Fragment key={indexContent}>
                  <ListItem>
                    <ListItemIcon sx={styles.listItemIcon}>
                      <HdrStrongIcon color="blue" />
                    </ListItemIcon>
                    <ListItemText primary={content.task} />
                  </ListItem>
                  {indexContent !== arrContent.length - 1 && <Divider light />}
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

export default AccordionLevel;
