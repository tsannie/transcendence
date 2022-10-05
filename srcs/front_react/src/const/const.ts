// Auth

import axios from "axios";

export const REDIRECT_LINK_AUTH = "http://localhost:4000/auth";
export const COOKIE_NAME = "AuthToken";

export const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4000/",
});
