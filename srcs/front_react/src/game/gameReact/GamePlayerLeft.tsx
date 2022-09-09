import { paddleProps_left, player_left, player_right, socket } from "../Game";

export function GamePlayer_left(props: any) {
  function mouv_paddle_left(e: any) {
    if (
      props.gamestart === true &&
      props.im_right === false &&
      player_left.won === false &&
      player_right.won === false
    ) {
      paddleProps_left.y = e.clientY - paddleProps_left.width / 2 - 15;
      var data = {
        room: props.room,
        pd: paddleProps_left,
      };
      socket.emit("paddleMouvLeft", data);
    }
  }

  return (
    <div className="readyGame">
      <canvas
        id="canvas"
        ref={props.canvasRef}
        height="500px"
        width={1000}
        onMouseMove={(e) => mouv_paddle_left(e)}
        style={{ backgroundColor: "black" }}
      ></canvas>

      <h1 style={{ color: "blue" }}> you are : {props.my_id} </h1>
      <h2 style={{ color: "red" }}> opponent is : {props.op_id} </h2>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
    </div>
  );
}
