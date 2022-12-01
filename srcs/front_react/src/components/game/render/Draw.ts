import { User } from "../../../contexts/AuthContext";
import {
  black,
  border_size_default,
  canvas_back_width,
  GameMode,
  paddle_height,
  paddle_margin,
  paddle_width,
  rad,
  RoomStatus,
  white,
  Winner,
} from "../const/const";
import { IBall, IQuadrilateral, Room } from "../types";

export function draw_game(
  ctx: CanvasRenderingContext2D,
  room: Room,
  user: User,
  canvas: any
) {
  let fontFamily;
  if (room.game_mode === GameMode.TRANS) fontFamily = "px system-ui";
  else fontFamily = "px Arcade";

  if (room.status === RoomStatus.CLOSED)
    draw_game_ended(ctx, room, user?.id as string, canvas.height, canvas.width);
  else {
    if (room.countdown) {
      draw_countdown(
        ctx,
        canvas.width,
        canvas.height,
        room.countdown,
        fontFamily
      );
    } else {
      if (room.game_mode === GameMode.TRANS) {
        draw_smasher(ctx, room.smasher);
        draw_wall(ctx, room.wall);
      } else draw_line(ctx, canvas.height, canvas.width);
      draw_ball(room, ctx, room.ball);
      draw_score(
        ctx,
        room.p1_score,
        room.p2_score,
        canvas.height,
        canvas.width,
        fontFamily
      );
    }
    if (room.game_mode === GameMode.TRANS)
      draw_borders_trans(ctx, canvas.height, canvas.width);
    else draw_borders(ctx, canvas.height, canvas.width);
    draw_paddle(room, ctx, room.p1_y_paddle, paddle_margin);
    draw_paddle(
      room,
      ctx,
      room.p2_y_paddle,
      canvas_back_width - paddle_margin - paddle_width
    );
  }
}

export function draw_game_ended(
  ctx: CanvasRenderingContext2D,
  room: Room,
  user_id: string,
  canvas_height: number,
  canvas_width: number
) {
  let fontFamily;
  if (room.game_mode === GameMode.TRANS) fontFamily = "px system-ui";
  else fontFamily = "px Arcade";

  ctx.beginPath();
  ctx.rect(0, 0, canvas_width, canvas_height);
  ctx.fillStyle = black;
  ctx.fill();
  ctx.font = canvas_width / 10 + fontFamily;
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

function draw_borders_trans(
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
  countdown: number,
  fontFamily: string
) {
  ctx.beginPath();
  ctx.font = canvas_width / 4 + fontFamily;
  ctx.fillStyle = white;
  ctx.textAlign = "center";
  ctx.fillText(countdown.toString(), canvas_height / 2, canvas_width / 2);
}

function draw_score(
  ctx: CanvasRenderingContext2D,
  p1_score: number,
  p2_score: number,
  canvas_height: number,
  canvas_width: number,
  fontFamily: string
) {
  ctx.beginPath();
  ctx.font = canvas_width / 10 + fontFamily;
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

function draw_neon_paddle(
  ctx: CanvasRenderingContext2D,
  paddle: IQuadrilateral
) {
  ctx.lineWidth = border_size_default;
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

  ctx.lineWidth = paddle.height / 10;
  ctx.stroke();
  ctx.closePath();
}

function draw_paddle(
  room: Room,
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
  if (room.game_mode === GameMode.TRANS) {
    ctx.fillStyle = "black";
    draw_neon_paddle(ctx, paddle);
  } else ctx.fillStyle = white;
  ctx.fill();
}

function draw_ball(room: Room, ctx: CanvasRenderingContext2D, IBall: IBall) {
  ctx.beginPath();
  ctx.fillStyle = white;
  if (room.game_mode === GameMode.TRANS)
    ctx.arc(IBall.x, IBall.y, rad, 0, Math.PI * 2);
  else
    ctx.rect(
      IBall.x - 2 * (rad / 2),
      IBall.y - 2 * (rad / 2),
      rad * 2,
      rad * 2
    );
  ctx.fill();
  ctx.stroke();
}
