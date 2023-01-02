import { Paper, styled } from "@mui/material";

const PaperPrimary = styled(Paper)(({ theme }) => ({
  padding: "4.5rem",
  maxWidth: "37rem",

  border: `0.2rem solid`,
  borderColor: theme.palette.blue.main,

  backgroundColor: theme.palette.blue.light,

  borderRadius: "1.6rem",

  textAlign: "center",
}));

export default PaperPrimary;
