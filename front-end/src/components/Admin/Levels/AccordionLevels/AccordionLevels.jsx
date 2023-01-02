import React from "react";
import AccordionLevel from "./AccordionLevel/AccordionLevel";

const AccordionLevels = (props) => {
  return (
    <>
      {props.levels.map((item, index, arr) => (
        <React.Fragment key={index}>
          <AccordionLevel
            item={item}
            index={index}
            setReload={props.setReload}
          />
        </React.Fragment>
      ))}
    </>
  );
};

export default AccordionLevels;
