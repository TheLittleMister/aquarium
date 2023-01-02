import { Button, styled } from "@mui/material";

const ButtonSuccess = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.green.main,
  color: "white",

  border: `0.1rem solid ${theme.palette.green.main}`,
  borderRadius: "15rem",
  // gap: "0.5rem",
  padding: "0.5rem 1rem",
  "&:hover": {
    backgroundColor: theme.palette.green.font,
    color: "white",
    border: `0.1rem solid ${theme.palette.green.font}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.disabled.main,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.main}`,
  },
}));

export default ButtonSuccess;
