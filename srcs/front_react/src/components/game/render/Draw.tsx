import {
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  white,
  Winner,
} from "../const/const";
import { IBall, IDrawResponsive, IPaddle, IPlayer, Room } from "../types";

export function draw_game(
  ctx: CanvasRenderingContext2D,
  canvas: any,
  room: Room,
  drawResponsive: IDrawResponsive,
  countdown: number
) {
  if (countdown != 0)
    draw_countdown(ctx, canvas.width, canvas.height, countdown);
  else {
    draw_line(ctx, canvas.height, canvas.width);
    draw_ball(ctx, room.ball, drawResponsive);
    draw_score(ctx, room.p1_score, room.p2_score, canvas.height, canvas.width);
  }
  draw_borders(ctx, canvas.height, canvas.width);
  draw_paddle(ctx, room.p1_y_paddle, drawResponsive);
  draw_paddle(ctx, room.p2_y_paddle, drawResponsive);
}

export function draw_game_ended(
  ctx: CanvasRenderingContext2D,
  room: Room,
  user_id: string,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = "black";
  ctx.fill();
  ctx.font = canvas_width / 10 + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText("Game Ended\n\n\n\n\n\n", canvas_width / 2, canvas_height / 2);
  if (
    (room.won === Winner.P1 && room.p1_id === user_id) ||
    (room.won === Winner.P2 && room.p2_id === user_id)
  )
    ctx.fillText(
      "you won !",
      canvas_width / 2,
      canvas_height / 2 + canvas_height / 4
    );
  else if (
    (room.won === Winner.P2 && room.p1_id === user_id) ||
    (room.won === Winner.P1 && room.p2_id === user_id)
  )
    ctx.fillText(
      "you lost !",
      canvas_width / 2,
      canvas_height / 2 + canvas_height / 4
    );
}

////////////////////////////////////////
////// DRAW LINES
////////////////////////////////////////

function draw_line(
  ctx: CanvasRenderingContext2D,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  for (
    let x = canvas_height / 50;
    x <= canvas_height + canvas_height / 2;
    x += canvas_height / 12
  )
    ctx.rect(
      canvas_width / 2 - canvas_width / 100 / 2,
      x,
      canvas_width / 100,
      canvas_height / 20
    );
  ctx.fillStyle = white;
  ctx.fill();
}

function draw_borders(
  ctx: CanvasRenderingContext2D,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height / 50);
  ctx.rect(
    0,
    canvas_height - canvas_height / 50,
    canvas_width,
    canvas_height / 50
  );
  ctx.fillStyle = white;
  ctx.fill();
}

function draw_countdown(
  ctx: CanvasRenderingContext2D,
  canvas_height: number,
  canvas_width: number,
  countdown: number
) {
  ctx.beginPath();
  ctx.font = canvas_width / 4 + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText(countdown.toString(), canvas_height / 2, canvas_width / 2);
}

////////////////////////
//// DRAW STATUS
////////////////////////

function draw_score(
  ctx: CanvasRenderingContext2D,
  p1_score: number,
  p2_score: number,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();
  ctx.font = canvas_width / 10 + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText(p1_score.toString(), canvas_width / 4, canvas_height / 4);
  ctx.fillText(
    p2_score.toString(),
    canvas_width - canvas_width / 4,
    canvas_height / 4
  );
  ctx.fill();
}

////////////////////////
//////// DRAW ELEMENTS
////////////////////////

function draw_paddle(
  ctx: CanvasRenderingContext2D,
  y_paddle: number,
  drawResponsive: IDrawResponsive
) {
  const IPaddle: IPaddle = {
    x: paddle_margin * drawResponsive.ratio_width,
    y: y_paddle * drawResponsive.ratio_height,
    width: paddle_width * drawResponsive.ratio_width,
    height: paddle_height * drawResponsive.ratio_height,
  };

  ctx.beginPath();
  ctx.rect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fillStyle = white;
  ctx.strokeRect(IPaddle.x, IPaddle.y, IPaddle.width, IPaddle.height);
  ctx.fill();
}

function draw_ball(
  ctx: CanvasRenderingContext2D,
  IBall: IBall,
  drawResponsive: IDrawResponsive
) {
  IBall.x = IBall.x * drawResponsive.ratio_width;
  IBall.y = IBall.y * drawResponsive.ratio_height;

  ctx.beginPath();
  ctx.fillStyle = white;
  ctx.rect(
    IBall.x - 2 * ((rad * drawResponsive.ratio_width) / 2),
    IBall.y - 2 * ((rad * drawResponsive.ratio_width) / 2),
    rad * drawResponsive.ratio_width * 2,
    rad * drawResponsive.ratio_width * 2
  );
  ctx.fill();
  ctx.stroke();
}
