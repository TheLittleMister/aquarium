export const modalBox = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "0.2rem solid",
  borderColor: "blue.main",
  boxShadow: 24,
  padding: "2rem 1rem",

  borderRadius: "1.6rem",

  width: "max-content",
  maxWidth: "70vw",
  maxHeight: "90vh",
  overflow: "auto",

  "@media (max-width: 75em)": {
    maxWidth: "100vw",
  },

  outline: "none",
};
