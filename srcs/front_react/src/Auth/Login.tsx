import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const client_id = '16312ad4625ac63660e140ef9cafdc36ed82512a2310f60e2cbeceaa906bf655';
  const redirect_uri = 'http%3A%2F%2Flocalhost%3A3000%2Fauth%2F';
  const scope = 'public';
  const state = 'pUDpC2FVt5ChzUZxmRe4Sb45r33YfyYejttx5J4pDggP38bdA2';
  const response_type = 'code';

  const link = 'https://api.intra.42.fr/oauth/authorize?'
            + 'client_id=' + client_id
            + '&redirect_uri=' + redirect_uri
            + '&response_type=' + response_type
            + '&scope=' + scope
            + '&state=' + state;

  return (
    <a href={link}>Log in</a>
  );
}
