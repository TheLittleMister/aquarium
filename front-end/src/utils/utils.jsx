import jwt_decode from "jwt-decode";

import { useTheme, useMediaQuery } from "@mui/material";

export const url = "https://aquariumschool.co";
export const urlAPI = url + "/api/";

export const userBase = {
  id: 0,
  username: "",
  image: "",
  type: "",
  firstName: "",
  lastName: "",
  idType: "",
  idTypeID: 2,
  identityDocument: "",
  sex: "",
  sexID: 3,
  dateBirth: null,
  age: 0,
  teacher: "",
  parent: "",
  email: "",
  phone1: "",
  phone2: "",
  signature: "",
};

export const prettyDate = (time) => {
  const date = new Date(time + " 00:00"),
    diff = (new Date().getTime() - date.getTime()) / 1000,
    day_diff = Math.floor(diff / 86400);

  if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  const r =
    (day_diff === 0 &&
      ((diff < 60 && "Justo ahora") ||
        (diff < 120 && "Hace 1 minuto") ||
        (diff < 3600 && "Hace " + Math.floor(diff / 60) + " minutos") ||
        (diff < 7200 && "Hace 1 hora") ||
        (diff < 86400 && "Hace " + Math.floor(diff / 3600) + " horas"))) ||
    (day_diff === 1 && "Ayer") ||
    (day_diff < 7 && "Hace " + day_diff + " días") ||
    (day_diff < 31 && "Hace " + Math.ceil(day_diff / 7) + " semanas");

  return r;
};

export const completeDate = (time) =>
  new Date(time + " 00:00")
    .toLocaleDateString("es-ES", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "America/Bogota",
    })
    .toUpperCase();

export const shortDate = (time) =>
  new Date(time + " 00:00")
    .toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "America/Bogota",
    })
    .toUpperCase();

export const refreshTokens = async (statusText, refresh, setUser = null) => {
  // if (statusText !== "Unauthorized") return false;

  const response = await fetch(urlAPI + "users/token/refresh/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh }),
  });

  const responseData = await response.json();
  // console.log(response, responseData);

  if (!response.ok) {
    localStorage.removeItem("tokens");
    if (setUser) setUser(userBase);
    return false;
  } else {
    localStorage.setItem(
      "tokens",
      JSON.stringify({ access: responseData.access, refresh })
    );
    return true;
  }
};

export const getTokens = () => {
  const tokensStorage = JSON.parse(localStorage.getItem("tokens"));
  let tokens = {
    access: "",
    refresh: "",
    expired: true,
  };

  if (tokensStorage) {
    try {
      const refreshDecoded = jwt_decode(tokensStorage.refresh);
      tokens = {
        access: tokensStorage.access,
        refresh: tokensStorage.refresh,
        expired: Date.now() >= refreshDecoded.exp * 1000,
      };
    } catch (error) {
      console.log(error, "🍰");
    }
  }

  if (tokens.expired) localStorage.removeItem("tokens");

  return tokens;
};

export const logOut = (setUser) => {
  localStorage.removeItem("tokens");
  setUser(userBase);
};

export const useIsWidthUp = (breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
};

export const useIsWidthDown = (breakpoint) => {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down(breakpoint));
};

export const getHour = (time) => {
  const splitTime = time.split(":");
  const regularTime = {
    12: "12",
    13: "01",
    14: "02",
    15: "03",
    16: "04",
    17: "05",
    18: "06",
    19: "07",
    20: "08",
    21: "09",
    22: "10",
    23: "11",
  };

  let myTime = time.slice(0, 5) + " AM";
  const hour = Number(splitTime[0]);

  if (hour > 11) {
    myTime = regularTime[splitTime[0]] + ":" + splitTime[1] + " PM";
  } else if (hour === 0) {
    myTime = "12:" + splitTime[1] + " AM";
  }

  return myTime;
};
