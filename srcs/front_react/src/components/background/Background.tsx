import React, { Fragment, useEffect, useState } from "react";
import {ReactComponent as BallIcon} from "../../assets/img/icon/ball/ball.svg";
import {ReactComponent as BallHideIcon} from "../../assets/img/icon/ball/ball-hide.svg";
import "./bg.style.scss";

function Background() {
  const [hideBall, setHideBall] = useState(false);

  const handleBall = () => {
    if (hideBall) setHideBall(false);
    else setHideBall(true);
  };
  useEffect(() => {
    setHideBall(localStorage.getItem("hideBallKey") === "true" ? true : false);
  }, []);

  useEffect(() => {
    localStorage.setItem('hideBallKey', JSON.stringify(hideBall));
  }, [hideBall]);

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
          <BallIcon onClick={handleBall} />
        </div>
      </Fragment>
    );
  } else {
    return (
        <div className="bg__hideball">
          <BallHideIcon onClick={handleBall} />
        </div>
    );
  }
}

export default Background;
