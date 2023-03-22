import React, { useState, useContext } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Container,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Tabs,
  Typography as Text,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import UploadImage from "../../utils/UploadImage/UploadImage";
import { useIsWidthDown, useIsWidthUp } from "../../utils/utils";
import TableRowNoBorder from "../Tables/TableRows/TableRowNoBorder";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

import * as styles from "./PanelStyles";
import classes from "./Panel.module.css";
import ChipPrimary from "../Chips/ChipPrimary";
import { AuthContext } from "../../context/AuthContext";

const Panel = (props) => {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(props.tab);
  const [open, setOpen] = useState(false);
  const [photo, setPhoto] = useState("");
  const isMdUp = useIsWidthUp("md");
  const is500Down = useIsWidthDown(500);

  const handleChangeTab = (e, newValue) => {
    navigate(props.tabs[newValue].link);
    setTabValue(newValue);
  };

  const imageSelected = (e) => {
    const file = e.target.files[0];

    if (file) {
      setPhoto(URL.createObjectURL(file));
      setOpen(true);
    }
  };

  return (
    <Box className={classes.admin}>
      <UploadImage
        photo={photo}
        open={open}
        setOpen={setOpen}
        setUser={props.setUser}
        uploadPath={"users/changePhoto/"}
        aspect={1 / 1}
        title="Foto Perfil"
        username={props.user.username}
      />
      <Container>
        <Stack direction={useIsWidthUp(900) ? "row" : "column"} paddingTop={2}>
          <Box
            flex={1}
            sx={{ borderRight: "0.1rem solid", borderColor: "blue.light" }}
          >
            <TableContainer
              sx={{
                "& td": { textAlign: "center" },
                boxShadow: 0,
                backgroundColor: "transparent",
                // borderBottom: "0.1rem solid",
              }}
            >
              <Table aria-label="simple table" size="small">
                <TableBody>
                  <TableRowNoBorder>
                    <TableCell>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{
                          vertical: "bottom",
                          horizontal: "right",
                        }}
                        badgeContent={
                          authCtx.user.type === "Administrador" ||
                            props.user.id === authCtx.user.id ? (
                            <Button
                              variant="contained"
                              sx={styles.changePhoto}
                              onClick={() =>
                                document
                                  .querySelector(
                                    `#id_file_${props.user.username}`
                                  )
                                  .click()
                              }
                            >
                              <input
                                type="file"
                                name="image"
                                id={`id_file_${props.user.username}`}
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={imageSelected}
                              />
                              <AddAPhotoIcon
                                fontSize="medium"
                                color="primary"
                              />
                            </Button>
                          ) : (
                            ""
                          )
                        }
                      >
                        <Avatar
                          alt={props.user.username}
                          src={props.user.image}
                          sx={{
                            width: "20rem",
                            height: "20rem",
                            margin: "0 auto",
                          }}
                        />
                      </Badge>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder>
                    <TableCell>
                      <Text fontWeight={500}>{props.user.lastName.slice(0, 15)}</Text>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder>
                    <TableCell>
                      <Text fontWeight={500}>{props.user.firstName.slice(0, 15)}</Text>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder>
                    <TableCell>
                      <ChipPrimary label={props.user.type} />
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder>
                    <TableCell>
                      <Text fontWeight={500}>@{props.user.username.slice(0, 15)}</Text>
                    </TableCell>
                  </TableRowNoBorder>

                </TableBody>
              </Table>
            </TableContainer>
            <br />
            <Tabs
              orientation={isMdUp ? "vertical" : "horizontal"}
              value={tabValue}
              onChange={handleChangeTab}
              variant={isMdUp || is500Down ? "scrollable" : "fullWidth"}
              scrollButtons="auto"
              aria-label="scrollable auto tabs example"
              textColor="primary"
              indicatorColor="primary"
            >
              {props.tabs.map((item, index, arr) => (
                <Tab key={index} {...item.options} />
              ))}
            </Tabs>
          </Box>
          <Box flex={3}>{props.children}</Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default Panel;
