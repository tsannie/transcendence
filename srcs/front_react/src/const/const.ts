// Auth

import axios from "axios";

export const BACK_URL = "http://localhost:8081/api";
export const FT_REDIRECT_LINK_AUTH = BACK_URL + "/auth/oauth42";
export const GOOGLE_REDIRECT_LINK_AUTH = BACK_URL + "/auth/oauthGoogle";
export const COOKIE_NAME = "AuthToken";

export const api = axios.create({
  withCredentials: true,
  baseURL: BACK_URL,
});
