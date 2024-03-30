import React, { useState } from "react";
import { Box, Typography as Text } from "@mui/material";
import * as styles from "./AboutUsStyles";
import classes from "./AboutUs.module.css";
import logo from "./images/logo.png";

import ButtonPrimary from "../../../../UI/Buttons/ButtonPrimary";
import ModalPreinscription from "./ModalPreinscription/ModalPreinscription";

const AboutUs = () => {
  const [open, setOpen] = useState(false);
  return (
    <Box flex={1} sx={styles.aboutUs}>
      <ModalPreinscription open={open} setOpen={setOpen} />
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
          En <strong>Aquarium School</strong> nos especializamos en ofrecer
          cursos regulares y personalizados de <strong>natación</strong>,{" "}
          <strong>matronatación</strong> y <strong>acuafiestas</strong> para
          niños y niñas, así como <strong>hidroterapia</strong> para todas las
          edades. Con nuestra amplia experiencia, garantizamos un óptimo
          desarrollo en cada uno de nuestros programas. <br /> <br />
          Nuestra escuela de natación, ubicada en <strong>Bogotá</strong>,
          cuenta con <strong>profesores licenciados</strong> que poseen años de
          experiencia en la docencia deportiva y en la enseñanza de la natación.
          <br /> <br />
          Disponemos de una <strong>piscina cubierta climatizada</strong>{" "}
          dividida por carriles, equipada con un{" "}
          <strong>sistema de purificación</strong> que cumple con los estándares
          de limpieza de agua exigidos por la{" "}
          <strong>Secretaría de Salud</strong>.
          <br /> <br />
          Al final de cada curso se hará una <strong>evaluación</strong>, y si
          el alumno aprueba el <strong>nivel</strong> será acreedor de un{" "}
          <strong>certificado</strong>.
        </Text>
        <br />
        <br />
        <Text textAlign="center">
          <img src={logo} alt="Aquarium Logo" className={classes.img} />
        </Text>
        <br />
        <Text textAlign="center">
          <ButtonPrimary onClick={() => setOpen(true)}>
            Pre-Inscripción
          </ButtonPrimary>
        </Text>
      </Box>
    </Box>
  );
};

export default AboutUs;
