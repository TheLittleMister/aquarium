import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  Typography as Text,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Tooltip,
  Input,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  ListSubheader,
} from "@mui/material";

import { Route, Routes } from "react-router-dom";

import CreateUser from "./CreateUser/CreateUser";
import { getTokens, refreshTokens, urlAPI } from "../../../utils/utils";
import { AuthContext } from "../../../context/AuthContext";
import ClearIcon from "@mui/icons-material/Clear";

import Form from "../../../UI/Forms/Form";
import UsersTable from "./UsersTable/UsersTable";
import User from "./User/User";
import CloseIcon from "@mui/icons-material/Close";

import { useNavigate } from "react-router-dom";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";
import ButtonSecondary from "../../../UI/Buttons/ButtonSecondary";

const Content = (props) => {
  const authCtx = useContext(AuthContext);

  const [resultCount, setResultCount] = useState(0);
  const [paginationCount, setPaginationCount] = useState(0);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [type, setType] = useState(1);
  const [order, setOrder] = useState("date_joined");
  const [open, setOpen] = useState(false);

  // Search User States
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const searchUserHandler = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  useEffect(() => {
    setLoading(true);

    const getUsers = async () => {
      const tokens = getTokens();

      const result = await fetch(urlAPI + "users/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: JSON.stringify({
          page,
          type,
          order,
          search,
        }),
      });

      const data = await result.json();

      if (!result.ok) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) getUsers();

        return;
      }
      setResultCount(data.count);
      setPaginationCount(data.paginationCount);
      setUsers(data.page);
      setLoading(false);
    };

    getUsers();

    if (props.reload) props.setReload(false);
  }, [authCtx.setUser, page, type, order, props, search]);

  return (
    <Box>
      <CreateUser open={open} setOpen={setOpen} setReload={props.setReload} />
      <Stack
        direction="row"
        alignItems="end"
        justifyContent="space-around"
        flexWrap="wrap"
        p={2}
        gap={0.4}
      >
        <ButtonSecondary onClick={() => setOpen(true)}>
          Crear Usuario
        </ButtonSecondary>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 160 }}>
          <InputLabel id="userType-select-small">Filtro de usuarios</InputLabel>
          <Select
            labelId="userType-select-small"
            id="userType-select-small"
            value={type}
            label="Tipo"
            autoWidth
            onChange={(e) => setType(e.target.value)}
            sx={{ backgroundColor: "transparent" }}
          >
            <ListSubheader>Tipo de Usuario</ListSubheader>
            <MenuItem value={1}>
              <Text>Estudiante</Text>
            </MenuItem>
            <MenuItem value={2}>
              <Text>Profesor</Text>
            </MenuItem>
            <MenuItem value={3}>
              <Text>Admin</Text>
            </MenuItem>
            <ListSubheader>Filtro de estudiantes</ListSubheader>
            <MenuItem value={4}>
              <Text>Est. activo</Text>
            </MenuItem>
            <MenuItem value={5}>
              <Text>Est. sin profesor</Text>
            </MenuItem>
            <MenuItem value={6}>
              <Text>Est. con más de una clase</Text>
            </MenuItem>
            <MenuItem value={7}>
              <Text>Est. con inconsistencia</Text>
            </MenuItem>
            <ListSubheader>Filtro de Niveles</ListSubheader>
            <MenuItem value={8}>
              <Text>Est. sin nivel activo</Text>
            </MenuItem>
            <MenuItem value={9}>
              <Text>100% sin certificado</Text>
            </MenuItem>
            <MenuItem value={10}>
              <Text>100% con certificado</Text>
            </MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="filled" sx={{ m: 1, minWidth: 150 }}>
          <InputLabel id="order-select-small">Ordenar por</InputLabel>
          <Select
            labelId="order-select-small"
            id="order-select-small"
            value={order}
            label="Orden"
            autoWidth
            onChange={(e) => setOrder(e.target.value)}
            sx={{ backgroundColor: "transparent" }}
          >
            <MenuItem value="date_joined">
              <Text>Recientes</Text>
            </MenuItem>
            <MenuItem value="real_last_login">
              <Text>Última Sesión</Text>
            </MenuItem>
            <MenuItem value="last_name">
              <Text>Apellidos</Text>
            </MenuItem>
            <MenuItem value="first_name">
              <Text>Nombres</Text>
            </MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Form
        onSubmit={searchUserHandler}
        messages={[]}
        loading={loading}
        collapseOpen={false}
        setCollapseOpen={() => { }}
        submitText="Buscar"
        direction="row"
      >
        <Input
          placeholder="Buscar Usuario"
          name="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          required
        />
        <Tooltip title="Borrar Búsqueda" placement="top">
          <IconButton
            onClick={() => {
              setSearch("");
              setSearchInput("");
            }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </Form>

      <ChipPrimary label={`${resultCount} resultados`} sx={{ m: 1 }} />

      <UsersTable users={users} />

      <Pagination
        size="large"
        count={paginationCount}
        variant="outlined"
        color="primary"
        sx={{ "& ul": { justifyContent: "center" }, p: 3 }}
        page={page}
        onChange={(e, value) => setPage(value)}
      />
    </Box>
  );
};

const Users = () => {
  // const authCtx = useContext(AuthContext);
  const [reload, setReload] = useState(false);
  const [closePath, setClosePath] = useState("/admin/users/");
  const navigate = useNavigate();

  return (
    <>
      <Content reload={reload} setReload={setReload} />
      <Routes>
        <Route
          path=":username/*"
          element={
            <Dialog fullScreen open={true}>
              <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                  <IconButton
                    edge="end"
                    color="inherit"
                    onClick={() => navigate(closePath)}
                    aria-label="close"
                  >
                    <CloseIcon />
                  </IconButton>
                </Toolbar>
              </AppBar>
              <User setClosePath={setClosePath} />
            </Dialog>
          }
        />
      </Routes>
    </>
  );
};

export default Users;
