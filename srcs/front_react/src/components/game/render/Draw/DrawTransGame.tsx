import {
  border_size_default,
  canvas_back_width,
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  white,
} from "../../const/const";
import { IBall, IQuadrilateral, Room } from "../../types";

export function draw_trans_game(
  ctx: CanvasRenderingContext2D,
  canvas: any,
  room: Room
) {
  if (room.countdown >= 1000)
    draw_countdown(ctx, canvas.width, canvas.height, room.countdown);
  else {
    draw_smasher(ctx, room.smasher);
    draw_wall(ctx, room.wall);
    draw_ball(ctx, room.ball);
    draw_score(ctx, room.p1_score, room.p2_score, canvas.height, canvas.width);
  }
  draw_borders(ctx, canvas.height, canvas.width);
  draw_paddle(ctx, room.p1_y_paddle, paddle_margin);
  draw_paddle(
    ctx,
    room.p2_y_paddle,
    canvas_back_width - paddle_margin - paddle_width
  );
}

function draw_smasher(ctx: CanvasRenderingContext2D, smasher: IQuadrilateral) {
  ctx.beginPath();
  ctx.fillStyle = white;

  ctx.rect(smasher.x, smasher.y, smasher.width, smasher.height);
  ctx.fill();
  ctx.stroke();
}

function draw_wall(ctx: CanvasRenderingContext2D, wall: IQuadrilateral) {
  ctx.beginPath();
  ctx.fillStyle = white;

  ctx.rect(wall.x, wall.y, wall.width, wall.height);
  ctx.fill();
  ctx.stroke();
}

function draw_borders(
  ctx: CanvasRenderingContext2D,
  canvas_height: number,
  canvas_width: number
) {
  ctx.beginPath();

  ctx.rect(2, 2, canvas_width - 4, canvas_height - 4);
  ctx.closePath();

  ctx.fillStyle = "rgba(0, 0, 0, 0)";

  let grd = ctx.createLinearGradient(0, 0, canvas_width, canvas_height);
  grd.addColorStop(0, "rgba(13,213,252)");
  grd.addColorStop(0.5, "rgba(243,243,21)");
  grd.addColorStop(1, "rgba(255,153,51)");
  ctx.strokeStyle = grd;

  ctx.stroke();
  ctx.fill();
  ctx.closePath();
}

function draw_countdown(
  ctx: CanvasRenderingContext2D,
  canvas_height: number,
  canvas_width: number,
  countdown: number
) {
  countdown = Math.floor(countdown / 1000);
  ctx.beginPath();
  ctx.font = canvas_width / 4 + "px system-ui";
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
  ctx.font = canvas_width / 10 + "px system-ui";

  let grd = ctx.createLinearGradient(0, 0, canvas_width, canvas_height);
  grd.addColorStop(0, "rgba(13,213,252)");
  grd.addColorStop(0.5, "rgba(243,243,21)");
  grd.addColorStop(1, "rgba(255,153,51)");

  ctx.fillStyle = grd;
  ctx.textAlign = "center";
  ctx.fillText(p1_score.toString(), canvas_width / 4, canvas_height / 4);
  ctx.fillText(
    p2_score.toString(),
    canvas_width - canvas_width / 4,
    canvas_height / 4
  );
  ctx.fill();
}

// PADDLLE

function draw_paddle_rounded(
  ctx: CanvasRenderingContext2D,
  paddle: IQuadrilateral
) {
  let radius = 16;
  if (paddle.width < 2 * radius) radius = paddle.width / 2;
  if (paddle.height < 2 * radius) radius = paddle.height / 2;
  ctx.beginPath();
  ctx.moveTo(paddle.x + radius, paddle.y);

  ctx.arcTo(
    paddle.x + paddle.width,
    paddle.y,
    paddle.x + paddle.width,
    paddle.y + paddle.height,
    radius
  );
  ctx.arcTo(
    paddle.x + paddle.width,
    paddle.y + paddle.height,
    paddle.x,
    paddle.y + paddle.height,
    radius
  );

  ctx.arcTo(paddle.x, paddle.y + paddle.height, paddle.x, paddle.y, radius);
  ctx.arcTo(paddle.x, paddle.y, paddle.x + paddle.width, paddle.y, radius);

  ctx.strokeStyle = "white";
  ctx.lineWidth = paddle.height / 10;
  ctx.stroke();
  ctx.closePath();
}

function draw_neon_paddle(
  ctx: CanvasRenderingContext2D,
  paddle: IQuadrilateral
) {
  let shadow_color = "rgba(13,213,252, 0.5)";
  let strokestyle_color = "rgba(255, 255, 255, 01)";
  ctx.shadowColor = shadow_color;
  ctx.shadowBlur = 8;
  ctx.strokeStyle = strokestyle_color;
  ctx.lineWidth = border_size_default;

  draw_paddle_rounded(ctx, paddle);
  ctx.strokeStyle = strokestyle_color;
}

function draw_ball(ctx: CanvasRenderingContext2D, IBall: IBall) {
  ctx.beginPath();
  ctx.fillStyle = white;
  ctx.arc(IBall.x, IBall.y, rad, 0, Math.PI * 2);
  ctx.fill();
}

function draw_paddle(
  ctx: CanvasRenderingContext2D,
  y_paddle: number,
  x_paddle: number
) {
  const paddle: IQuadrilateral = {
    x: x_paddle,
    y: y_paddle,
    width: paddle_width,
    height: paddle_height,
  };

  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "black";
  draw_neon_paddle(ctx, paddle);
  ctx.fill();
}
