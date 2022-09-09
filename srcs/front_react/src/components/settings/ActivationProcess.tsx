import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../../userlist/UserListItem";

export default function ActivationProcess(props: any) {
  const [token, setToken] = useState("");

  console.log('hello')
  //generateQrtoken();

  async function checkToken() {
    await api.post('2fa/check-token', {
      token: token,
    }).then(res => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <h3>Scan the QR token with your authenticator app</h3>
      <img src={`data:;base64,${props.qrCode}`}></img>
      <h3>Enter the token from your app</h3>
      <input type="text" value={token} onChange={(e) => setToken(e.target.value)}></input>
      <Button variant="contained" onClick={checkToken}>
        Validate
      </Button>
    </div>
  );
}


