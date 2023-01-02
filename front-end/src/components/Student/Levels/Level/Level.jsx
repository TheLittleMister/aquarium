import React from "react";
import {
  Box,
  CircularProgress,
  Stack,
  Typography as Text,
} from "@mui/material";
import PaperPrimary from "../../../../UI/Papers/PaperPrimary";
import ButtonSuccess from "../../../../UI/Buttons/ButtonSuccess";

import * as styles from "./LevelStyles";
import { url } from "../../../../utils/utils";

const Level = ({ level }) => {
  return (
    <PaperPrimary>
      <Text variant="h5" fontWeight={600}>
        {level.level__name}
      </Text>
      <br />
      <Stack
        direction="row"
        justifyContent="space-around"
        alignItems="center"
        flexWrap={"wrap"}
        gap={1}
      >
        <Box>
          <Box sx={styles.levelBox}>
            <CircularProgress
              variant="determinate"
              color={level.percentage === 100 ? "green" : "blue"}
              value={level.percentage}
              size="7rem"
              thickness={7}
            />
            <Box sx={styles.levelPercentage}>
              <Text
                variant="button"
                component="div"
              >{`${level.percentage}%`}</Text>
            </Box>
          </Box>
        </Box>
        <Box>
          <Text>Certificado</Text>
          <ButtonSuccess
            size="small"
            disabled={level.certificate_img ? false : true}
            href={level.certificate_img ? url + level.certificate_img : ""}
            underline="none"
            target="_blank"
            rel="noopener noreferrer"
          >
            PNG
          </ButtonSuccess>
          <ButtonSuccess
            size="small"
            disabled={level.certificate_pdf ? false : true}
            href={level.certificate_pdf ? url + level.certificate_pdf : ""}
            underline="none"
            target="_blank"
            rel="noopener noreferrer"
          >
            PDF
          </ButtonSuccess>
        </Box>
      </Stack>
    </PaperPrimary>
  );
};

export default Level;
