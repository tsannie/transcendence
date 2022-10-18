import { REDIRECT_LINK_AUTH } from "../../../const/const";
import './login.style.scss'
import {ReactComponent as FTLogo} from "../../../assets/img/42_Logo.svg";

export default function ButtonLogin(props: any) {

  function linkLog(event: any) {
    event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }


  return (
    <div className='login-list'>
      <div className="login-list__title">
        <h2>Account Sign in</h2>
      </div>
      <div className="login-list__content">
        <button onClick={linkLog}>
          <FTLogo className="login-list__content__logo"/>
          <span>Continue with 42</span>
        </button>
      </div>
    </div>
  );
}
