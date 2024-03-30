import React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography as Text,
} from "@mui/material";

// import PhishingIcon from "@mui/icons-material/Phishing";
import HdrStrongIcon from "@mui/icons-material/HdrStrong";

import * as styles from "./CoursesAccordionStyles";

const CoursesAccordion = () => {
  const requiredList = [
    "Gorro",
    "Gafas",
    "Crocs",
    "Vestido de baño",
    "Toalla",
  ];

  return (
    <Accordion sx={styles.accordion} expanded={true}>
      <AccordionSummary
        // expandIcon={<PhishingIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        sx={{ cursor: "default !important" }}
      >
        <Text color="blue.light">¿Qué se requiere?</Text>
      </AccordionSummary>
      <AccordionDetails>
        <List sx={styles.list} dense={true}>
          {requiredList.map((content, indexContent, arrContent) => (
            <React.Fragment key={indexContent}>
              <ListItem>
                <ListItemIcon sx={styles.listItemIcon}>
                  <HdrStrongIcon sx={{ color: "blue.light" }} />
                </ListItemIcon>
                <ListItemText
                  primary={<Text sx={{ color: "blue.light" }}>{content}</Text>}
                />
              </ListItem>
              <Divider light />
            </React.Fragment>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default CoursesAccordion;
