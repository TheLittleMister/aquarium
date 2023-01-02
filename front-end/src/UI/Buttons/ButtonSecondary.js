import { Button, styled } from "@mui/material";

const ButtonSecondary = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.blue.font,
  color: theme.palette.blue.light,
  borderRadius: "15rem",
  border: `0.1rem solid ${theme.palette.blue.font}`,
  // gap: "0.5rem",
  padding: "0.5rem 1rem",
  "&:hover": {
    backgroundColor: "transparent",
    color: theme.palette.blue.font,
    border: `0.1rem solid ${theme.palette.blue.font}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.disabled.main,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.main}`,
  },
}));

export default ButtonSecondary;
