import { Chip, styled } from "@mui/material";

const ChipPrimary = styled(Chip)(({ theme }) => ({
  color: theme.palette.blue.font,
  letterSpacing: "0.075rem",
  textAlign: "center",
  fontWeight: 600,
}));

export default ChipPrimary;
