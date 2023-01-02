import { TableRow, styled } from "@mui/material";

const TableRowBorder = styled(TableRow)(({ theme }) => ({
  "& td, & th": {
    border: "0.2rem solid",
    borderColor: theme.palette.blue.font,
  },
}));

export default TableRowBorder;
