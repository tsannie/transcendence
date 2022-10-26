import {
  FT_REDIRECT_LINK_AUTH,
  GOOGLE_REDIRECT_LINK_AUTH,
} from "../../../const/const";
import "./login.style.scss";
import { ReactComponent as FTLogo } from "../../../assets/img/42_Logo.svg";
import { ReactComponent as GoogleLogo } from "../../../assets/img/Google_Logo.svg";

export default function ButtonLogin() {
  function handleFTLogin(event: any) {
    event.preventDefault();
    window.location.href = FT_REDIRECT_LINK_AUTH;
  }

  function handleGoogleLogin(event: any) {
    event.preventDefault();
    window.location.href = GOOGLE_REDIRECT_LINK_AUTH;
  }

  return (
    <div className="login-list">
      <div className="login-list__title">
        <h2>Account Sign in</h2>
      </div>
      <div className="login-list__content">
        <button onClick={handleFTLogin}>
          <div className="login-list__content__item">
            <FTLogo />
            <span>Continue with 42</span>
          </div>
        </button>
        <button onClick={handleGoogleLogin}>
          <div className="login-list__content__item">
            <GoogleLogo />
            <span>Continue with Google</span>
          </div>
        </button>
      </div>
    </div>
  );
}
