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
import { IQuadrilateral, Room } from "../types";

export default class Draw {
  private ctx: CanvasRenderingContext2D;
  private fontFamily: string;
  private user_id: string;

  constructor(
    game_mode: GameMode,
    user_id: string,
    ctx: CanvasRenderingContext2D
  ) {
    this.fontFamily =
      game_mode === GameMode.TRANS ? "px system-ui" : "px Arcade";
    this.ctx = ctx;
    this.user_id = user_id;
  }

  render(room: Room, canvasRef: any) {
    const canvas = canvasRef.current;
    if (canvas && this.ctx) {
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (room.game_mode === GameMode.TRANS)
        this.draw_game_transcendence(room, canvas);
      else if (room.game_mode === GameMode.CLASSIC)
        this.draw_game_classic(room, canvas);
    }
  }

  private draw_game_classic(room: Room, canvas: HTMLCanvasElement) {
    this.draw_countdown(room, canvas);
    if (!room.countdown && room.status == RoomStatus.PLAYING) {
      this.draw_score(room, canvas);
      this.draw_line(canvas);
      this.draw_borders(canvas);
      this.draw_ball(room);
      this.draw_paddle(room, paddle_margin, room.p1_y_paddle);
      this.draw_paddle(
        room,
        canvas_back_width - paddle_margin - paddle_width,
        room.p2_y_paddle
      );
    }
    this.draw_game_over(room, canvas);
  }

  private draw_game_transcendence(room: Room, canvas: HTMLCanvasElement) {
    this.draw_countdown(room, canvas);
    if (!room.countdown && room.status == RoomStatus.PLAYING) {
      this.draw_score(room, canvas);
      this.draw_smasher(room);
      this.draw_wall(room);
      this.draw_borders_trans(canvas);
      this.draw_ball(room);
      this.draw_paddle(room, paddle_margin, room.p1_y_paddle);
      this.draw_paddle(
        room,
        canvas_back_width - paddle_margin - paddle_width,
        room.p2_y_paddle
      );
    }
    this.draw_game_over(room, canvas);
  }

  private draw_smasher(room: Room) {
    this.ctx.beginPath();
    this.ctx.fillStyle = white;

    this.ctx.rect(
      room.smasher.x,
      room.smasher.y,
      room.smasher.width,
      room.smasher.height
    );
    this.ctx.fill();
    this.ctx.stroke();
  }

  private draw_wall(room: Room) {
    this.ctx.beginPath();
    this.ctx.fillStyle = white;

    this.ctx.rect(room.wall.x, room.wall.y, room.wall.width, room.wall.height);
    this.ctx.fill();
    this.ctx.stroke();
  }

  private draw_line(canvas: HTMLCanvasElement) {
    this.ctx.beginPath();
    for (
      let x = canvas.height / 50;
      x <= canvas.height + canvas.height / 2;
      x += canvas.height / 12
    )
      this.ctx.rect(
        canvas.width / 2 - canvas.width / 100 / 2,
        x,
        canvas.width / 100,
        canvas.height / 20
      );
    this.ctx.fillStyle = white;
    this.ctx.fill();
  }
  private draw_borders(canvas: HTMLCanvasElement) {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, canvas.width, border_size_default);
    this.ctx.rect(
      0,
      canvas.height - border_size_default,
      canvas.width,
      border_size_default
    );
    this.ctx.fillStyle = white;
    this.ctx.fill();
  }

  private draw_borders_trans(canvas: HTMLCanvasElement) {
    this.ctx.beginPath();

    this.ctx.rect(2, 2, canvas.width - 4, canvas.height - 4);
    this.ctx.closePath();

    this.ctx.fillStyle = "rgba(0, 0, 0, 0)";

    let grd = this.ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grd.addColorStop(0, "rgba(13,213,252)");
    grd.addColorStop(0.5, "rgba(243,243,21)");
    grd.addColorStop(1, "rgba(255,153,51)");
    this.ctx.strokeStyle = grd;

    this.ctx.stroke();
    this.ctx.fill();
    this.ctx.closePath();
  }

  private draw_ball(room: Room) {
    this.ctx.beginPath();
    this.ctx.fillStyle = white;
    if (room.game_mode === GameMode.TRANS)
      this.ctx.arc(room.ball.x, room.ball.y, rad, 0, Math.PI * 2);
    else
      this.ctx.rect(
        room.ball.x - 2 * (rad / 2),
        room.ball.y - 2 * (rad / 2),
        rad * 2,
        rad * 2
      );
    this.ctx.fill();
    this.ctx.stroke();
  }

  private draw_score(room: Room, canvas: HTMLCanvasElement) {
    this.ctx.beginPath();
    this.ctx.font = canvas.width / 10 + this.fontFamily;
    this.ctx.fillStyle = white;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      room.p1_score.toString(),
      canvas.width / 4,
      canvas.height / 4
    );
    this.ctx.fillText(
      room.p2_score.toString(),
      canvas.width - canvas.width / 4,
      canvas.height / 4
    );
    this.ctx.fill();
  }

  private draw_neon_paddle(paddle: IQuadrilateral) {
    this.ctx.lineWidth = border_size_default;
    let radius = 16;
    if (paddle.width < 2 * radius) radius = paddle.width / 2;
    if (paddle.height < 2 * radius) radius = paddle.height / 2;
    this.ctx.beginPath();
    this.ctx.moveTo(paddle.x + radius, paddle.y);

    this.ctx.arcTo(
      paddle.x + paddle.width,
      paddle.y,
      paddle.x + paddle.width,
      paddle.y + paddle.height,
      radius
    );
    this.ctx.arcTo(
      paddle.x + paddle.width,
      paddle.y + paddle.height,
      paddle.x,
      paddle.y + paddle.height,
      radius
    );

    this.ctx.arcTo(
      paddle.x,
      paddle.y + paddle.height,
      paddle.x,
      paddle.y,
      radius
    );
    this.ctx.arcTo(
      paddle.x,
      paddle.y,
      paddle.x + paddle.width,
      paddle.y,
      radius
    );

    this.ctx.lineWidth = paddle.height / 10;
    this.ctx.stroke();
    this.ctx.closePath();
  }

  private draw_paddle(room: Room, x_paddle: number, y_paddle: number) {
    const paddle: IQuadrilateral = {
      x: x_paddle,
      y: y_paddle,
      width: paddle_width,
      height: paddle_height,
    };

    this.ctx.beginPath();
    this.ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    if (room.game_mode === GameMode.TRANS) {
      this.ctx.fillStyle = "black";
      this.draw_neon_paddle(paddle);
    } else this.ctx.fillStyle = white;
    this.ctx.fill();
  }

  private draw_countdown(room: Room, canvas: HTMLCanvasElement) {
    if (room.countdown) {
      this.ctx.beginPath();
      this.ctx.font = canvas.width / 4 + this.fontFamily;
      this.ctx.fillStyle = white;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        room.countdown.toString(),
        canvas.width / 2,
        canvas.height / 2
      );
    }
  }

  private draw_game_over(room: Room, canvas: HTMLCanvasElement) {
    if (room.status === RoomStatus.CLOSED) {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, canvas.width, canvas.height);
      this.ctx.fillStyle = black;
      this.ctx.fill();
      this.ctx.font = canvas.width / 10 + this.fontFamily;
      this.ctx.fillStyle = white;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Game Ended\n\n\n\n\n\n",
        canvas.width / 2,
        canvas.height / 2
      );
      if (
        (room.won === Winner.P1 && room.p1_id === this.user_id) ||
        (room.won === Winner.P2 && room.p2_id === this.user_id)
      )
        this.ctx.fillText(
          "you won !",
          canvas.width / 2,
          canvas.height / 2 + canvas.height / 4
        );
      else if (
        (room.won === Winner.P2 && room.p1_id === this.user_id) ||
        (room.won === Winner.P1 && room.p2_id === this.user_id)
      )
        this.ctx.fillText(
          "you lost !",
          canvas.width / 2,
          canvas.height / 2 + canvas.height / 4
        );
    }
  }
}
