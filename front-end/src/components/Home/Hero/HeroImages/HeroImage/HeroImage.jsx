import React, { useState } from "react";

import { ImageListItem } from "@mui/material";
import HeroImageModal from "./HeroImageModal/HeroImageModal";

import * as styles from "./HeroImageStyles";
import classes from "./HeroImage.module.css";

const srcset = (image, size, rows = 1, cols = 1) => {
  return {
    src: `${image}?w=${size * cols}&h=${size * rows}&fit=crop&auto=format`,
    srcSet: `${image}?w=${size * cols}&h=${
      size * rows
    }&fit=crop&auto=format&dpr=2 2x`,
  };
};

const HeroImage = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <ImageListItem
      key={props.item.img}
      cols={props.item.cols || 1}
      rows={props.item.rows || 1}
      sx={styles.image}
    >
      <img
        className={classes.image}
        {...srcset(props.item.img, 121, props.item.rows, props.item.cols)}
        alt={props.item.title}
        // loading="lazy"
        onClick={() => setOpen(true)}
      />
      <HeroImageModal open={open} setOpen={setOpen} item={props.item} />
    </ImageListItem>
  );
};

export default HeroImage;
