import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function PageNotFound() {
  const nav = useNavigate();

  useEffect(() => {
    toast.warning("page not found !");
    nav("/");
  }, []);
  return <>redirection</>;
}

export default PageNotFound;
