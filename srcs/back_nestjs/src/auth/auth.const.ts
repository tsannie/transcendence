import axios from 'axios';

export interface IToken {
  access_token: string;
}

export const URL_API42 = 'https://api.intra.42.fr/oauth/token';

export let data_req = {
  grant_type: 'authorization_code',
  client_id: process.env.CLIENT_ID,
  client_secret: process.env.CLIENT_SECRET,
  redirect_uri: 'http://localhost:3000/auth/',
};

export const apiOAuth42 = axios.create({
  baseURL: 'http://localhost:4000/',
});
