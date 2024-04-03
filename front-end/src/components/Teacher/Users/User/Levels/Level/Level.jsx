import React, { useState, useContext } from "react";
import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography as Text,
} from "@mui/material";
import PaperPrimary from "../../../../../../UI/Papers/PaperPrimary";
import ButtonSuccess from "../../../../../../UI/Buttons/ButtonSuccess";
import {
  completeDate,
  getTokens,
  refreshTokens,
  url,
  urlAPI,
} from "../../../../../../utils/utils";
import ChipPrimary from "../../../../../../UI/Chips/ChipPrimary";
import ButtonSecondary from "../../../../../../UI/Buttons/ButtonSecondary";
import ButtonWarningLoading from "../../../../../../UI/Buttons/ButtonWarningLoading";
import DeleteIcon from "@mui/icons-material/Delete";

import * as styles from "./LevelStyles";
import LevelsForm from "../LevelsForm/LevelsForm";
import { AuthContext } from "../../../../../../context/AuthContext";
import ButtonDanger from "../../../../../../UI/Buttons/ButtonDanger";
import CertificateDelete from "./CertificateDelete/CertificateDelete";
import LevelDelete from "./LevelDelete/LevelDelete";

const Level = ({ level, userID, setReload }) => {
  const authCtx = useContext(AuthContext);
  const [openEditLevel, setOpenEditLevel] = useState(false);
  const [openDeleteCertificate, setOpenDeleteCertificate] = useState(false);
  const [openDeleteLevel, setOpenDeleteLevel] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const certificate = async () => {
    setLoading(true);
    const tokens = getTokens();

    const result = await fetch(urlAPI + `levels/certificate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + tokens.access,
      },
      body: JSON.stringify({
        userID,
        studentLevelID: level.id,
      }),
    });

    const data = await result.json();

    if (!result.ok) {
      const refreshed = await refreshTokens(
        result.statusText,
        tokens.refresh,
        authCtx.setUser
      );

      if (refreshed) certificate();
      return;
    }

    if (data.errors && data.errors.length > 0) {
      setErrorMessage(data.errors[0]);
    } else {
      setReload(true);
      setErrorMessage("");
    }
    setLoading(false);
  };

  return (
    <PaperPrimary>
      <LevelDelete
        level={level}
        userID={userID}
        open={openDeleteLevel}
        setOpen={setOpenDeleteLevel}
        setReload={setReload}
      />
      <CertificateDelete
        level={level}
        userID={userID}
        open={openDeleteCertificate}
        setOpen={setOpenDeleteCertificate}
        setReload={setReload}
      />
      <LevelsForm
        open={openEditLevel}
        setOpen={setOpenEditLevel}
        level={level}
        userID={userID}
        setReload={setReload}
      />
      <Text variant="h5" fontWeight={600}>
        {level.level__name}
        <Tooltip title="Desactivar">
          <IconButton onClick={() => setOpenDeleteLevel(true)}>
            <DeleteIcon color="primary" />
          </IconButton>
        </Tooltip>
      </Text>
      <Text>Desde el {completeDate(level.date)}</Text>
      <br />
      <ChipPrimary
        label={`Asistencias: ${level.attendances_count}/${level.attendances}`}
      />
      <br />
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
          {/* <Stack direction="row" justifyContent={"space-between"}> */}
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
          {/* </Stack> */}
        </Box>
      </Stack>
      <Stack direction="row" justifyContent="space-around" mt={1}>
        <ButtonSecondary onClick={() => setOpenEditLevel(true)}>
          Editar
        </ButtonSecondary>
        {!level.certificate_img ? (
          <Tooltip title={errorMessage}>
            <ButtonWarningLoading
              disabled={level.percentage === 100 ? false : true}
              loading={loading}
              onClick={certificate}
            >
              Certificar
            </ButtonWarningLoading>
          </Tooltip>
        ) : (
          <ButtonDanger
            endIcon={<DeleteIcon color="white" />}
            onClick={() => setOpenDeleteCertificate(true)}
          >
            Certificado
          </ButtonDanger>
        )}
      </Stack>
    </PaperPrimary>
  );
};

export default Level;
