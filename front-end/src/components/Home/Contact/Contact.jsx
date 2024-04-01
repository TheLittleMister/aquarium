import React from "react";

import * as styles from "./ContactStyles";
import classes from "./Contact.module.css";
import {
  Box,
  Container,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Tooltip,
  Typography as Text,
  Link,
} from "@mui/material";
import TableRowNoBorder from "../../../UI/Tables/TableRows/TableRowNoBorder";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PhoneInTalkOutlinedIcon from "@mui/icons-material/PhoneInTalkOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhonelinkRingOutlinedIcon from "@mui/icons-material/PhonelinkRingOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import GitHubIcon from "@mui/icons-material/GitHub";
import ChipPrimary from "../../../UI/Chips/ChipPrimary";

const Contact = () => {
  return (
    <Box className={classes.contact}>
      <Container>
        <ChipPrimary label="CONTACTO" />
        <br />
        <br />
        <Stack sx={styles.stack} flexWrap="wrap" gap={2}>
          <Box flex={1}>
            <Text variant="h5" fontWeight={600} color="blue.font">
              Ponte en contacto con nosotros
            </Text>
            <br />
            <br />
            <TableContainer component={Paper} sx={styles.table}>
              <Table size="small" aria-label="simple table">
                <TableBody>
                  <TableRowNoBorder hover={true}>
                    <TableCell align="center" component="th" scope="row">
                      <AccessTimeIcon
                        fontSize="large"
                        sx={{ color: "blue.font" }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Text variant="h6">Lunes a Sábado de 8 am a 6 pm.</Text>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder hover={true}>
                    <TableCell align="center" component="th" scope="row">
                      <LocationOnOutlinedIcon
                        fontSize="large"
                        sx={{ color: "blue.font" }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <a
                        href="https://maps.google.com/maps?ll=4.706599,-74.092988&z=17&t=m&hl=en-US&gl=US&mapclient=embed&cid=11416970179102173072"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text variant="h6">
                          Diagonal 85 # 76 - 34, Bogotá, Colombia.
                        </Text>
                      </a>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder hover={true}>
                    <TableCell align="center" component="th" scope="row">
                      <PhoneInTalkOutlinedIcon
                        fontSize="large"
                        sx={{ color: "blue.font" }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Text variant="h6">(601) 712 6510</Text>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder hover={true}>
                    <TableCell align="center" component="th" scope="row">
                      <PhonelinkRingOutlinedIcon
                        fontSize="large"
                        sx={{ color: "blue.font" }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Link
                        href="https://api.whatsapp.com/send?phone=573118381534"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Text variant="h6">+57 (311) 8381534</Text>
                      </Link>
                    </TableCell>
                  </TableRowNoBorder>
                  <TableRowNoBorder hover={true}>
                    <TableCell align="center" component="th" scope="row">
                      <EmailOutlinedIcon
                        fontSize="large"
                        sx={{ color: "blue.font" }}
                      />
                    </TableCell>
                    <TableCell align="left">
                      <Link href="mailto:aquariumschool@gmail.com">
                        <Text variant="h6">aquariumschool@gmail.com</Text>
                      </Link>
                    </TableCell>
                  </TableRowNoBorder>
                </TableBody>
              </Table>
            </TableContainer>
            <Stack
              direction="row"
              justifyContent="center"
              alignItems="center"
              p={5}
              gap={2}
            >
              <Tooltip title="aquarium.git">
                <Link
                  href="https://github.com/thelittlemister/aquarium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton>
                    <Text>
                      <GitHubIcon sx={{ fontSize: "5rem" }} />
                    </Text>
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip title="@AquariumSchoolBogota">
                <Link
                  href="https://www.facebook.com/AquariumSchoolBogota/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton>
                    <Text>
                      <FacebookIcon sx={{ fontSize: "5rem" }} />
                    </Text>
                  </IconButton>
                </Link>
              </Tooltip>
              <Tooltip title="@Aquarium.School">
                <Link
                  href="https://www.instagram.com/aquarium.school/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconButton>
                    <Text>
                      <InstagramIcon sx={{ fontSize: "5rem" }} />
                    </Text>
                  </IconButton>
                </Link>
              </Tooltip>
            </Stack>
          </Box>
          <Box flex={1}>
            <iframe
              loading="lazy"
              title="Aquarium Location"
              className={classes.map}
              src="https://www.google.com/maps/embed/v1/place?q=place_id:ChIJozfn0TSbP44RkOecYOM5cZ4&key=AIzaSyA7NsL4QBRLkyrWjKc60nlPkV7XsMgZefc"
              allowFullScreen="allowfullscreen"
            />
          </Box>
        </Stack>
        <Text paddingTop={4}>
          Copyright &#169; {new Date().getFullYear()} Aquarium School, Inc.
          Powered by{" "}
          <Link
            href="https://m.youtube.com/FranklinYulian"
            target="_blank"
            rel="noopener noreferrer"
          >
            FY
          </Link>
          .
        </Text>
      </Container>
    </Box>
  );
};

export default Contact;
