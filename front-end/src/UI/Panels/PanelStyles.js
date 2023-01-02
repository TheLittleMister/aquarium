export const changePhoto = {
  backgroundColor: "blue.light",
  border: "0.2rem solid",
  borderColor: "blue.font",
  borderRadius: "15rem",
  p: 1,
  minWidth: "max-content",
  "&:hover": {
    backgroundColor: "blue.font",
    borderColor: "blue.light",

    "& > svg": {
      color: "blue.light",
    },
  },
};
