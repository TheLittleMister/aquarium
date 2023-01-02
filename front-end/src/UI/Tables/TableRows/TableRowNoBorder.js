import { TableRow, styled } from "@mui/material";

const TableRowNoBorder = styled(TableRow)(({ theme }) => ({
  "& td, & th": { border: 0 },
}));

export default TableRowNoBorder;
