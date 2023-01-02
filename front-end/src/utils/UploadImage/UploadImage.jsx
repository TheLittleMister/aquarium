import React, { useCallback, useState, useContext } from "react";

import ModalUI from "../../UI/Modals/ModalUI";
import ModalTitle from "../../UI/Modals/ModalTitle";

import Cropper from "react-easy-crop";
import { Box, Slider } from "@mui/material";
import ButtonPrimaryLoading from "../../UI/Buttons/ButtonPrimaryLoading";
import getCroppedImg from "./cropImage";
import { getTokens, refreshTokens, urlAPI } from "../utils";

import * as styles from "./UploadImageStyles";
import { AuthContext } from "../../context/AuthContext";

const UploadImage = (props) => {
  const authCtx = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback(
    (croppedArea, croppedAreaPixels) => setCroppedAreaPixels(croppedAreaPixels),
    []
  );

  const croppedImage = async () => {
    setLoading(true);
    try {
      const croppedImage = await getCroppedImg(props.photo, croppedAreaPixels);
      const formData = new FormData();
      formData.append("username", props.username);
      formData.append("image", croppedImage.file);

      const tokens = getTokens();
      const result = await fetch(urlAPI + props.uploadPath, {
        method: "POST",
        headers: {
          // "Content-Type": "application/json",
          Authorization: "Bearer " + tokens.access,
        },
        body: formData,
      });

      const data = await result.json();

      if (!result.ok) {
        const refreshed = await refreshTokens(
          result.statusText,
          tokens.refresh,
          authCtx.setUser
        );

        if (refreshed) croppedImage();
        return;
      }

      props.setUser((previousState) => {
        return {
          ...previousState,
          [data.field]: data.url,
        };
      });

      setLoading(false);
      props.setOpen(false);
    } catch (e) {
      console.log("🎂🌀🍰", e);
    }
  };

  return (
    <ModalUI open={props.open} setOpen={props.setOpen} closePath="">
      <ModalTitle>{props.title}</ModalTitle>
      <Box position="relative" sx={styles.cropper}>
        <Cropper
          image={props.photo}
          crop={crop}
          zoom={zoom}
          aspect={props.aspect}
          onCropComplete={onCropComplete}
          onCropChange={setCrop}
          onZoomChange={setZoom}
        />
      </Box>
      <br />
      <Slider
        value={zoom}
        min={1}
        max={3}
        step={0.1}
        aria-labelledby="Zoom"
        onChange={(e, zoom) => setZoom(zoom)}
      />
      <Box textAlign="center">
        <ButtonPrimaryLoading loading={loading} onClick={croppedImage}>
          Subir
        </ButtonPrimaryLoading>
      </Box>
    </ModalUI>
  );
};

export default UploadImage;
