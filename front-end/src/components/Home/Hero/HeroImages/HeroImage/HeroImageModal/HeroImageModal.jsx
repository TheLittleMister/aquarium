import React from "react";
import { Box, Stack, Typography as Text } from "@mui/material";
import ModalUI from "../../../../../../UI/Modals/ModalUI";
import * as styles from "./HeroImageModalStyles";

const HeroImageModal = (props) => {
  return (
    <ModalUI open={props.open} setOpen={props.setOpen}>
      <Stack sx={styles.stack}>
        <Box flex={1} sx={styles.infoBox}>
          <Text variant="h5" fontWeight={600}>
            {props.item.title}
          </Text>
          <br />
          {props.item.html}
        </Box>
        <Box flex={1} sx={styles.imageBox}>
          <img src={props.item.img} alt={props.item.title} style={styles.img} />
        </Box>
      </Stack>
    </ModalUI>
  );
};

export default HeroImageModal;
