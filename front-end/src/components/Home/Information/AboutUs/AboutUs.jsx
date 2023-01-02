import React from "react";
import { Box, Typography as Text } from "@mui/material";
import * as styles from "./AboutUsStyles";
import classes from "./AboutUs.module.css";
import logo from "./images/logo.png";

const AboutUs = () => {
  return (
    <Box flex={1} sx={styles.aboutUs}>
      <Text
        variant="h5"
        fontWeight={600}
        color="blue.font"
        textAlign="center"
        sx={styles.title}
      >
        ¿Quiénes somos?
      </Text>
      <Box p={3}>
        <Text color="blue.font">
          En{" "}
          <strong>
            <em>Aquarium School</em>
          </strong>{" "}
          nos especializamos en cursos de natación para{" "}
          <strong>niños entre 4 a 12 años</strong> que con nuestra experiencia
          garantiza un óptimo desarrollo de nuestra labor.
          <br />
          <br />
          Nuestra escuela de natación ubicada en <strong>Bogotá</strong> cuenta
          con <strong>profesores licenciados</strong> y una{" "}
          <em>piscina cubierta climatizada con sistema de purificación</em> que
          cumple los estándares de limpieza de agua que exige la secretaria de
          salud.
          <br />
          <br />
          La <strong>natación</strong> contribuye al desarrollo del niño
          permitiendo fortalecer sus capacidades de movimiento, sociales y
          afectivas.
          <br />
          <br />
          Al final de cada curso se hará una <em>evaluación</em> al menor, y si
          el alumno aprueba el <strong>nivel</strong> será acreedor de un{" "}
          <strong>certificado</strong>.
        </Text>
        <br />
        <br />
        <br />
        <Text textAlign="center">
          <img src={logo} alt="Aquarium Logo" className={classes.img} />
        </Text>
      </Box>
    </Box>
  );
};

export default AboutUs;
