import {
  black,
  border_size_default,
  canvas_back_width,
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  white,
  Winner,
} from "../../const/const";
import { IBall, Room } from "../../types";

export function draw_classic_game(
  ctx: CanvasRenderingContext2D,
  canvas: any,
  room: Room
) {
  if (room.countdown)
    draw_countdown(ctx, canvas.width, canvas.height, room.countdown);
  else {
    draw_line(ctx, canvas.height, canvas.width);
    draw_ball(ctx, room.ball);
    draw_score(ctx, room.p1_score, room.p2_score, canvas.height, canvas.width);
    draw_paddle(ctx, room.p1_y_paddle, paddle_margin);
    draw_paddle(
      ctx,
      room.p2_y_paddle,
      canvas_back_width - paddle_margin - paddle_width
    );
  }
  draw_borders(ctx, canvas.height, canvas.width);
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
  ctx.fillStyle = black;
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
  ctx.rect(0, 0, canvas_width, border_size_default);
  ctx.rect(
    0,
    canvas_height - border_size_default,
    canvas_width,
    border_size_default
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
  countdown = countdown;
  ctx.beginPath();
  ctx.font = canvas_width / 4 + "px Arcade";
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText(countdown.toString(), canvas_height / 2, canvas_width / 2);
}

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

function draw_paddle(
  ctx: CanvasRenderingContext2D,
  y_paddle: number,
  x_paddle: number
) {
  ctx.beginPath();
  ctx.rect(x_paddle, y_paddle, paddle_width, paddle_height);
  ctx.fillStyle = white;
  ctx.strokeRect(x_paddle, y_paddle, paddle_width, paddle_height);
  ctx.fill();
}

function draw_ball(ctx: CanvasRenderingContext2D, IBall: IBall) {
  ctx.beginPath();
  ctx.fillStyle = white;
  ctx.rect(IBall.x - 2 * (rad / 2), IBall.y - 2 * (rad / 2), rad * 2, rad * 2);
  ctx.fill();
  ctx.stroke();
}
