import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";

function PageNotFound() {
  const nav = useNavigate();

  useEffect(() => {
    toast.warning("page not found !");
    nav("/game");
  }, []);
  return <>redirection</>;
}

export default PageNotFound;
