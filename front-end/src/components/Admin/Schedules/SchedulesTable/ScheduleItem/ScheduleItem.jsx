import React, { useState } from "react";
import { IconButton, TableCell, Tooltip } from "@mui/material";
import TableRowNoBorder from "../../../../../UI/Tables/TableRows/TableRowNoBorder";

import { Typography as Text } from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import { getHour, weekday } from "../../../../../utils/utils";
import ScheduleDelete from "./ScheduleDelete/ScheduleDelete";

const ScheduleItem = ({ item, setReload }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <ScheduleDelete
        open={open}
        setOpen={setOpen}
        item={item}
        setReload={setReload}
      />
      <TableRowNoBorder hover={true}>
        <TableCell align="center" component="th" scope="row">
          <Text>{weekday[item.weekday]}</Text>
        </TableCell>
        <TableCell align="center">
          <Text>{getHour(item.start_time)}</Text>
        </TableCell>
        <TableCell align="center">
          <Text>{getHour(item.end_time)}</Text>
        </TableCell>
        <TableCell align="center">
          <Text>
            <Tooltip title="Eliminar">
              <IconButton onClick={() => setOpen(true)}>
                <DeleteIcon color="primary" />
              </IconButton>
            </Tooltip>
          </Text>
        </TableCell>
      </TableRowNoBorder>
    </>
  );
};

export default ScheduleItem;
