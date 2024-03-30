import React from "react";

import { Typography as Text, Box, Stack, Tooltip } from "@mui/material";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import ButtonPrimary from "../../../../UI/Buttons/ButtonPrimary";
import ButtonSecondary from "../../../../UI/Buttons/ButtonSecondary";

import * as styles from "./HeroTitleStyles";

const HeroTitle = () => {
  return (
    <Box flex={1} sx={styles.heroTitle}>
      <Text variant="h2" fontWeight={700}>
        Aprender a nadar nunca fue más fácil
      </Text>
      <br />
      <Text variant="h6" fontWeight={400}>
        En nuestra escuela de natación tus hijos aprenderán a nadar rápido, fácil y
        seguro.
      </Text>
      <br />
      <br />
      <Stack sx={styles.stackButtons}>
        <Tooltip title="+57 (311) 8381534">
          <ButtonPrimary
            startIcon={<WhatsAppIcon />}
            href="https://api.whatsapp.com/send?phone=573118381534"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contáctanos&nbsp;
          </ButtonPrimary>
        </Tooltip>
        <ButtonSecondary href="#info" startIcon={<ExpandMoreIcon />}>
          Saber más&nbsp;
        </ButtonSecondary>
      </Stack>
    </Box>
  );
};

export default HeroTitle;
