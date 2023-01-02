import LoadingButton from "@mui/lab/LoadingButton";
import { styled } from "@mui/material";

const ButtonSecondaryLoading = styled(LoadingButton)(({ theme }) => ({
  backgroundColor: theme.palette.blue.font,
  color: theme.palette.blue.light,
  borderRadius: "15rem",
  border: `0.1rem solid ${theme.palette.blue.font}`,
  // gap: "0.5rem",
  padding: "0.5rem 1rem",
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "transparent",
    boxShadow: "none",
    color: theme.palette.blue.font,
    border: `0.1rem solid ${theme.palette.blue.font}`,
  },
  "&:disabled": {
    backgroundColor: theme.palette.disabled.main,
    color: theme.palette.disabled.font,
    border: `0.1rem solid ${theme.palette.disabled.main}`,
  },
}));

export default ButtonSecondaryLoading;
