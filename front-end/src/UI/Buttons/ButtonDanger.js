import { Button, styled } from "@mui/material";

const ButtonDanger = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.red.main,
  color: "white",

  border: `0.1rem solid ${theme.palette.red.main}`,
  borderRadius: "15rem",
  // gap: "0.5rem",
  padding: "0.5rem 1rem",
  "&:hover": {
    backgroundColor: theme.palette.red.font,
    color: "white",
    border: `0.1rem solid ${theme.palette.red.font}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.disabled.main,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.main}`,
  },
}));

export default ButtonDanger;
