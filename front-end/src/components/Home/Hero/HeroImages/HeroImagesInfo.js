import { Typography as Text } from "@mui/material";

import one from "./images/one.webp";
import two from "./images/two.webp";
import three from "./images/three.webp";
import four from "./images/four.webp";
import five from "./images/five.webp";
import six from "./images/six.webp";
import seven from "./images/seven.webp";
import eight from "./images/eight.webp";

import * as styles from "./HeroImagesStyles";

const poolHTML = (
  <Text component="span">
    Piscina cubierta, climatizada con sistema de purificación.
    <br />
    <br />
    <strong>Medidas:</strong> <em>12m</em> (largo) <strong>&times;</strong>{" "}
    <em>6m</em> (ancho).
    <br />
    <strong>Profundidad Mínima:</strong>
    <em> 80cm</em>.<br />
    <strong>Profundidad Máxima:</strong>
    <em> 1m 40cm</em>.
    <br />
    <br />
    Con un mantenimiento diario del agua de la piscina, nuestro piscinero aspira
    diariamente la piscina, la mantiene climatizada con <em>31 &#8451;</em> de
    temperatura, y controla el nivel de cloro <em>(Cl)</em> y <em>PH</em> del
    agua.
    <br />
    <br />
    <Text sx={styles.adviceStyles}>
      Se requiere precaución en el area de la piscina, no correr con los pies
      mojados en las instalaciones.
    </Text>
  </Text>
);

export const itemData = [
  {
    img: one,
    title: "Piscina",
    html: poolHTML,
    rows: 2,
    cols: 2,
  },
  {
    img: two,
    title: "Sala de espera",
    html: (
      <Text>
        En la sala de espera los padres o familiares del almuno podrán
        visualizar tanto la clase como a los estudiantes.
      </Text>
    ),
  },
  {
    img: three,
    title: "Lockers",
    html: (
      <Text component="span">
        Lockers para que los almunos puedan guardar sus prendas antes de entrar
        a la piscina.
        <br /> <br />
        <Text sx={styles.adviceStyles}>
          Se recomienda traer su propio candado.
        </Text>
      </Text>
    ),
  },
  {
    img: four,
    title: "Piscina",
    cols: 2,
    html: poolHTML,
  },
  {
    img: eight,
    title: "Sala Recepción",
    cols: 2,
    html: (
      <Text>
        Nuestra recepción cuenta con una sala de espera para atender a los
        clientes.
      </Text>
    ),
  },
  {
    img: six,
    title: "Piscina",
    author: "@yulianicus",
    rows: 2,
    cols: 2,
    html: poolHTML,
  },
  {
    img: seven,
    title: "Duchas",
    html: (
      <Text component="span">
        Para prevenir los daños para tu salud y la salud del agua de las
        piscinas, debemos ducharnos antes de entrar a la piscina para retirar de
        la piel los gérmenes y los restos de los productos de higiene y
        ducharnos despues de entrar a la piscina para retirar el cloro de
        nuestro cuerpo y cabello.
        <br />
        <br />
        <Text sx={styles.adviceStyles}>
          Se requiere precaución en el area de duchas,{" "}
          <strong>no correr</strong> con los pies mojados en las instalaciones.
        </Text>
      </Text>
    ),
  },
  {
    img: five,
    title: "Vestieres",
    html: (
      <Text>
        Contamos con vestieres para que los estudiantes puedan cambiarse las
        prendas de ropa antes y después de las clases de piscina.
      </Text>
    ),
  },
];
