import { Button, styled } from "@mui/material";

const ButtonGrey = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.disabled.main,
  color: theme.palette.disabled.font,

  border: `0.1rem solid ${theme.palette.disabled.main}`,
  borderRadius: "15rem",
  // gap: "0.5rem",
  padding: "0.5rem 1rem",
  "&:hover": {
    backgroundColor: theme.palette.disabled.font,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.font}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.disabled.main,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.main}`,
  },
}));

export default ButtonGrey;
