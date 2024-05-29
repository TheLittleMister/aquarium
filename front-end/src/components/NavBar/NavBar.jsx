import { AppBar, Container, Toolbar, Stack } from "@mui/material";

import logo from "../../UI/Logo/logo.png";

import * as styles from "./NavBarStyles";
import { Link } from "react-router-dom";
import Auth from "./Auth/Auth";

const NavBar = () => {
  return (
    <AppBar sx={styles.navBar} position="static">
      <Toolbar>
        <Container>
          <Stack sx={styles.stack}>
            <Link to="/">
              <img
                src={logo}
                style={{ maxWidth: "30rem" }}
                alt="Aquarium School Logo"
              />
            </Link>
            <Auth />
          </Stack>
        </Container>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
