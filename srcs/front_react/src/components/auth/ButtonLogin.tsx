import { REDIRECT_LINK_AUTH } from "../../const/const";
import './login.style.scss'
import FTLogo from "../../assets/42_Logo_white.png";

export default function ButtonLogin(props: any) {

  function linkLog(event: any) {
    event.preventDefault();
    window.location.href = REDIRECT_LINK_AUTH;
  }


  //

  return (
    <div className='listConnection'>
      <button onClick={linkLog}>
        <img src={FTLogo}/>
        <p>Continue with 42</p>
      </button>
    </div>
  );
}
