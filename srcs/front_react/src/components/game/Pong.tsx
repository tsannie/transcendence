import React, { useEffect, useState } from "react";
import Sketch from "react-p5";
import p5Types from "p5";

function Pong() {
  const [lowerSize, setLowerSize] = useState((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
  const [delta, setDelta] = useState(0);
  const ratio = 16/9; // ratio by arkunir

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(lowerSize, lowerSize / ratio).parent(canvasParentRef);
  };

  const draw = (p5: p5Types) => {
    p5.background(100);
    p5.ellipse(p5.width / 2, p5.height / 2 , 50 * delta, 50 * delta);
    //x++;
  };

  const resizeCanvas = (p5: p5Types) : void => {
    setLowerSize((window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth));
    p5.resizeCanvas(lowerSize, lowerSize / ratio);
  }

  useEffect(() => {
    setDelta(lowerSize / 100);
  }, [lowerSize]);

  return <Sketch setup={setup} draw={draw} windowResized={resizeCanvas} />;
}

export default Pong;
