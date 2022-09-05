import { Button, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { REDIRECT_LINK_AUTH } from "../const";
import { api } from "../userlist/UserListItem";

export default function ButtonLogin(props: any) {
  function linkLog(event: any) {
    //event.preventDefault();
    props.setIsLogin(true);
    console.log("dans login");
    window.location.href = REDIRECT_LINK_AUTH;
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        pt: "20vh",
      }}
    >
      <Button
        sx={{
          bgcolor: "white",
          "&:hover": {
            bgcolor: "white",
          },
        }}
        onClick={linkLog}
        variant="contained"
      >
        <Typography
          sx={{
            fontWeight: "semibold",
            fontFamily: "Montserrat",
            fontSize: "1.5rem",
            color: "black",
          }}
          variant="h4"
        >
          SE CONNECTER AVEC 42
        </Typography>
      </Button>
    </Box>
  );
}
