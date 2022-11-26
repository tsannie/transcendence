import {
  black,
  border_size_default,
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  white,
  Winner,
} from "../const/const";
import {
  IBall,
  IDrawResponsive,
  IQuadrilateral,
  IPlayer,
  Room,
} from "../types";

export function draw_game_trans(
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
  draw_borders(ctx, canvas.height, canvas.width, drawResponsive);
  draw_paddle(
    ctx,
    room.p1_y_paddle,
    paddle_margin * drawResponsive.ratio_width,
    drawResponsive
  );
  draw_paddle(
    ctx,
    room.p2_y_paddle,
    drawResponsive.canvas_width -
      paddle_margin * drawResponsive.ratio_width -
      paddle_width * drawResponsive.ratio_width,
    drawResponsive
  );
  draw_smasher(ctx, room.smasher, drawResponsive);
  draw_wall(ctx, room.wall, drawResponsive);
}

function draw_smasher(
  ctx: CanvasRenderingContext2D,
  smasher: IQuadrilateral,
  drawResponsive: IDrawResponsive
) {
  ctx.beginPath();
  ctx.fillStyle = white;

  if (smasher.x != smasher.x * drawResponsive.ratio_width) {
    smasher.x *= drawResponsive.ratio_width;
    smasher.y *= drawResponsive.ratio_height;
    smasher.width *= drawResponsive.ratio_width;
    smasher.height *= drawResponsive.ratio_width;
  }
  ctx.rect(smasher.x, smasher.y, smasher.width, smasher.height);
  ctx.fill();
  ctx.stroke();
}

function draw_wall(
  ctx: CanvasRenderingContext2D,
  wall: IQuadrilateral,
  drawResponsive: IDrawResponsive
) {
  ctx.beginPath();
  ctx.fillStyle = white;

  if (wall.x != wall.x * drawResponsive.ratio_width) {
    wall.x *= drawResponsive.ratio_width;
    wall.y *= drawResponsive.ratio_height;
    wall.width *= drawResponsive.ratio_width;
    wall.height *= drawResponsive.ratio_width;
  }

  ctx.rect(wall.x, wall.y, wall.width, wall.height);
  ctx.fill();
  ctx.stroke();
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
      canvas_width / 2 - canvas_width / 200 / 2,
      x,
      canvas_width / 200,
      canvas_height / 20
    );
  ctx.fillStyle = white;
  ctx.fill();
}

function draw_borders(
  ctx: CanvasRenderingContext2D,
  canvas_height: number,
  canvas_width: number,
  drawResponsive: IDrawResponsive
) {
  ctx.beginPath();

  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.closePath();

  ctx.fillStyle = "rgba(0, 0, 0, 0)";

  let grd = ctx.createLinearGradient(0, 0, canvas_width, canvas_height);
  grd.addColorStop(0, "rgba(13,213,252)");
  grd.addColorStop(0.5, "rgba(243,243,21)");
  grd.addColorStop(1, "rgba(255,153,51)");
  ctx.strokeStyle = grd;

  ctx.lineWidth = border_size_default * drawResponsive.ratio_width;

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
  ctx.font = canvas_width / 10 + "px helvetica";

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

////////////////////////
//////// DRAW ELEMENTS
////////////////////////

function draw_paddle_rounded(
  ctx: CanvasRenderingContext2D,
  paddle: IQuadrilateral
) {
  let radius = 10;
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
  ctx.shadowBlur = 10;
  ctx.strokeStyle = strokestyle_color;
  ctx.lineWidth = 7.5;
  draw_paddle_rounded(ctx, paddle);
  ctx.strokeStyle = strokestyle_color;
  ctx.lineWidth = 6;
  draw_paddle_rounded(ctx, paddle);
  ctx.strokeStyle = strokestyle_color;
  ctx.lineWidth = 4.5;
  draw_paddle_rounded(ctx, paddle);
  ctx.strokeStyle = strokestyle_color;
  ctx.lineWidth = 3;
  draw_paddle_rounded(ctx, paddle);
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  draw_paddle_rounded(ctx, paddle);
}

function draw_paddle(
  ctx: CanvasRenderingContext2D,
  y_paddle: number,
  x_paddle: number,
  drawResponsive: IDrawResponsive
) {
  const paddle: IQuadrilateral = {
    x: x_paddle,
    y: y_paddle * drawResponsive.ratio_height,
    width: paddle_width * drawResponsive.ratio_width,
    height: paddle_height * drawResponsive.ratio_height,
  };

  ctx.beginPath();
  ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.fillStyle = "black";
  draw_neon_paddle(ctx, paddle);
  ctx.fill();
}

function draw_ball(
  ctx: CanvasRenderingContext2D,
  IBall: IBall,
  drawResponsive: IDrawResponsive
) {
  if (IBall.x != IBall.x * drawResponsive.ratio_width) {
    IBall.x = IBall.x * drawResponsive.ratio_width;
    IBall.y = IBall.y * drawResponsive.ratio_height;
  }

  ctx.beginPath();
  ctx.fillStyle = white;
  ctx.arc(
    IBall.x - 2 * ((rad * drawResponsive.ratio_width) / 2),
    IBall.y - 2 * ((rad * drawResponsive.ratio_width) / 2),
    rad * drawResponsive.ratio_width * 2,
    0,
    Math.PI * 2
  );
  ctx.fill();
}
