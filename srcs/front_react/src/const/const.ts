// Auth

import axios from "axios";

export const FT_REDIRECT_LINK_AUTH = "http://localhost:4000/auth/oauth42";
export const GOOGLE_REDIRECT_LINK_AUTH = "http://localhost:4000/auth/oauthGoogle";
export const COOKIE_NAME = "AuthToken";

export const api = axios.create({
  withCredentials: true,
  baseURL: "http://localhost:4000/",
});
