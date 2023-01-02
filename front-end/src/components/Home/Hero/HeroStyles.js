export const hero = {
  backgroundColor: "blue.light",
  padding: "2rem 0 8rem 0",
  // height: "80vh",
};

export const stack = {
  // height: "80vh",
  alignItems: "center",
  justifyContent: "center",
  gap: "3rem",

  "@media (min-width: 62em)": {
    flexDirection: "row",
  },

  "@media (max-width: 62em)": {
    flexDirection: "columm",
    gap: "1rem",
    padding: "1rem",
    textAlign: "center",
  },
};
