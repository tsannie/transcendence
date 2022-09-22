import { Box } from "@mui/system";
import { REDIRECT_LINK_AUTH } from "../../const/const";

export default function ButtonLogin(props: any) {

  function linkLog(event: any) {
    //event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }

  return (
      <button onClick={linkLog}>
        Login
      </button>
  );
}
