import React, { useContext, useState } from "react";
import { Avatar, Menu, MenuItem } from "@mui/material";
import ButtonSecondary from "../../../../UI/Buttons/ButtonSecondary";
import { logOut } from "../../../../utils/utils";
import { AuthContext } from "../../../../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogOut = () => {
    setAnchorEl(null);
    logOut(authCtx.setUser);
    navigate("/", { replace: true });
  };

  return (
    <>
      <ButtonSecondary
        tabIndex={-1}
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        startIcon={
          <Avatar
            tabIndex={-1}
            alt={authCtx.user.username}
            src={authCtx.user.profileImage}
            sx={{ width: 24, height: 24 }}
          />
        }
      >
        {authCtx.user.username.slice(0, 15)}
      </ButtonSecondary>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Link
          to={
            authCtx.user.type === "Administrador"
              ? "/admin/"
              : authCtx.user.type === "Profesor"
              ? "/teacher/"
              : "/student/"
          }
        >
          <MenuItem onClick={handleClose}>Mi cuenta</MenuItem>
        </Link>
        <MenuItem onClick={handleLogOut}>Cerrar</MenuItem>
      </Menu>
    </>
  );
};

export default ProfileMenu;
