import React, {
  ChangeEvent,
  FormEvent,
  Fragment,
  useContext,
  useEffect,
  useState,
} from "react";
import { Buffer } from "buffer";
import { api } from "../../const/const";
import { AuthContext, AuthContextType } from "../../contexts/AuthContext";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";

export default function ActivationProcess() {
  const { setReloadUser } = useContext(AuthContext) as AuthContextType;
  const [token, setToken] = useState("");
  const [qrCode, setQrCode] = useState("");

  async function getQrCode() {
    await api
      .get("2fa/generate", {
        responseType: "arraybuffer",
      })
      .then((res: AxiosResponse) => {
        const base64 = Buffer.from(res.data, "utf8").toString("base64");
        setQrCode(base64);
      })
      .catch(() => {
        toast.error("Impossible to get QR code");
      });
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    api
      .post("2fa/check-token", {
        token: token,
      })
      .then(() => {
        toast.success("2FA activated !");
        setReloadUser(true);
      })
      .catch(() => {
        toast.error("invalid token !");
        setToken("");
      });
  };

  useEffect(() => {
    getQrCode();
  }, []);

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const size_max = 6;

    setToken(e.target.value.slice(0, size_max));
  };

  return (
    <Fragment>
      <h2>Scan the QR token with your auth app</h2>
      <img src={`data:;base64,${qrCode}`}></img>
      <h2>Enter the token from your app</h2>

      <form className="settings__2fa__validation" onSubmit={handleSubmit}>
        <input
          id="token"
          maxLength={6}
          type="number"
          value={token}
          onChange={handleTokenChange}
        />
        <button type="submit">Validate</button>
      </form>
    </Fragment>
  );
}
