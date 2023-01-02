import { Button, styled } from "@mui/material";

const ButtonWarning = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.yellow.main,
  color: "white",

  border: `0.1rem solid ${theme.palette.yellow.main}`,
  borderRadius: "15rem",
  // gap: "0.5rem",
  padding: "0.5rem 1rem",
  "&:hover": {
    backgroundColor: theme.palette.yellow.font,
    color: "white",
    border: `0.1rem solid ${theme.palette.yellow.font}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.disabled.main,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.main}`,
  },
}));

export default ButtonWarning;
