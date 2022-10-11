import React, { Fragment, useState } from "react";
import BallIcon from "../../assets/img/icon/ball/ball.png";
import BallHideIcon from "../../assets/img/icon/ball/ball-hide.png";
import "./bg.style.scss";

function Background() {
  const [hideBall, setHideBall] = useState(false);

  const handleBall = () => {
    if (hideBall) setHideBall(false);
    else setHideBall(true);
  };

  if (!hideBall) {
    return (
      <Fragment>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="ball"></div>
        <div className="bg__hideball">
          <img src={BallIcon} onClick={handleBall}></img>
        </div>
      </Fragment>
    );
  } else {
    return (
        <div className="bg__hideball">
          <img src={BallHideIcon} onClick={handleBall}></img>
        </div>
    );
  }
}

export default Background;
