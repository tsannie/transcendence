import React, { useContext, useEffect } from "react";
import {
  SnackbarContext,
  SnackbarContextType,
} from "../../contexts/SnackbarContext";

interface Iprops {
  redirection: string;
  objectNotFound: string;
}

function PageNotFound(props: Iprops) {
  const { setSeverity, setMessage, setAfterReload } = useContext(
    SnackbarContext
  ) as SnackbarContextType;

  useEffect(() => {
    setSeverity("warning");
    setMessage(props.objectNotFound + " not found ");
    setAfterReload(true);
    window.location.href = props.redirection;
  }, []);
  return <>redirection</>;
}

export default PageNotFound;
