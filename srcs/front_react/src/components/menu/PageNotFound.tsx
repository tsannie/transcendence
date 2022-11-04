import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../contexts/SnackbarContext";

function PageNotFound() {
  const { setSeverity, setMessage, setOpenSnackbar } = useContext(
    SnackbarContext
  ) as SnackbarContextType;

  const nav = useNavigate();

  useEffect(() => {
    setSeverity("warning");
    setMessage("page not found ");
    setOpenSnackbar(true);
    nav("/");
  }, []);
  return <>redirection</>;
}

export default PageNotFound;
