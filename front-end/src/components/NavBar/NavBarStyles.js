export const navBar = {
  backgroundColor: "blue.light",
  boxShadow: "none",
};

export const stack = {
  padding: "1.5rem 0",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",

  "@media (min-width: 35em)": {
    flexDirection: "row",
  },

  "@media (max-width: 35em)": {
    flexDirection: "columm",
    gap: "1rem",
    padding: "1rem",
  },
};
