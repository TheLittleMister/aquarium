import React from "react";
import { Box, ImageList } from "@mui/material";
import HeroImage from "./HeroImage/HeroImage";
import { itemData } from "./HeroImagesInfo";
import * as styles from "./HeroImagesStyles";

const HeroImages = () => {
  return (
    <Box flex={1}>
      <ImageList
        sx={styles.imageList}
        variant="quilted"
        cols={4}
        rowHeight={150}
      >
        {itemData.map((item, index) => (
          <HeroImage key={index} item={item} />
        ))}
      </ImageList>
    </Box>
  );
};

export default HeroImages;
