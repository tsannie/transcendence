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
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private user_id: string;
  private fontFamily: string;

  constructor(
    canvasRef: React.RefObject<HTMLCanvasElement>,
    ctx: CanvasRenderingContext2D,
    game_mode: GameMode,
    user_id: string
  ) {
    this.fontFamily =
      game_mode === GameMode.TRANS ? "px system-ui" : "px Arcade";
    this.canvas = canvasRef.current as HTMLCanvasElement;
    this.ctx = ctx;
    this.user_id = user_id;
  }

  render(room: Room) {
    if (this.canvas && this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (room.game_mode === GameMode.TRANS) {
        this.draw_game_transcendence(room);
      } else if (room.game_mode === GameMode.CLASSIC) {
        this.draw_game_classic(room);
      }
    }
  }

  private draw_game_classic(room: Room) {
    this.draw_countdown(room);
    if (!room.countdown && room.status == RoomStatus.PLAYING) {
      this.draw_score(room);
      this.draw_line();
      this.draw_borders();
      this.draw_ball(room);
      this.draw_paddle(room, paddle_margin, room.p1_y_paddle);
      this.draw_paddle(
        room,
        canvas_back_width - paddle_margin - paddle_width,
        room.p2_y_paddle
      );
    }
    this.draw_game_over(room);
  }

  private draw_game_transcendence(room: Room) {
    if (!this.ctx) return;

    this.draw_countdown(room);
    if (!room.countdown && room.status == RoomStatus.PLAYING) {
      this.draw_score(room);
      this.draw_smasher(room);
      this.draw_wall(room);
      this.draw_borders_trans();
      this.draw_ball(room);
      this.draw_paddle(room, paddle_margin, room.p1_y_paddle);
      this.draw_paddle(
        room,
        canvas_back_width - paddle_margin - paddle_width,
        room.p2_y_paddle
      );
    }
    this.draw_game_over(room);
  }

  private draw_smasher(room: Room) {
    if (!this.ctx) return;

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

  private draw_line() {
    this.ctx.beginPath();
    for (
      let x = this.canvas.height / 50;
      x <= this.canvas.height + this.canvas.height / 2;
      x += this.canvas.height / 12
    )
      this.ctx.rect(
        this.canvas.width / 2 - this.canvas.width / 100 / 2,
        x,
        this.canvas.width / 100,
        this.canvas.height / 20
      );
    this.ctx.fillStyle = white;
    this.ctx.fill();
  }
  private draw_borders() {
    this.ctx.beginPath();
    this.ctx.rect(0, 0, this.canvas.width, border_size_default);
    this.ctx.rect(
      0,
      this.canvas.height - border_size_default,
      this.canvas.width,
      border_size_default
    );
    this.ctx.fillStyle = white;
    this.ctx.fill();
  }

  private draw_borders_trans() {
    this.ctx.beginPath();
    this.ctx.rect(2, 2, this.canvas.width - 4, this.canvas.height - 4);
    this.ctx.closePath();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0)";

    let grd = this.ctx.createLinearGradient(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
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

  private draw_score(room: Room) {
    this.ctx.beginPath();
    this.ctx.font = this.canvas.width / 10 + this.fontFamily;
    this.ctx.fillStyle = white;
    this.ctx.textAlign = "center";
    this.ctx.fillText(
      room.p1_score.toString(),
      this.canvas.width / 4,
      this.canvas.height / 4
    );
    this.ctx.fillText(
      room.p2_score.toString(),
      this.canvas.width - this.canvas.width / 4,
      this.canvas.height / 4
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

  private draw_countdown(room: Room) {
    if (room.countdown) {
      this.ctx.beginPath();
      this.ctx.font = this.canvas.width / 4 + this.fontFamily;
      this.ctx.fillStyle = white;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        room.countdown.toString(),
        this.canvas.width / 2,
        this.canvas.height / 2
      );
    }
  }

  private draw_game_over(room: Room) {
    if (room.status === RoomStatus.CLOSED) {
      this.ctx.beginPath();
      this.ctx.rect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = black;
      this.ctx.fill();
      this.ctx.font = this.canvas.width / 10 + this.fontFamily;
      this.ctx.fillStyle = white;
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        "Game Ended",
        this.canvas.width / 2,
        this.canvas.height / 3
      );
      if (
        (room.won === Winner.P1 && room.p1_id === this.user_id) ||
        (room.won === Winner.P2 && room.p2_id === this.user_id)
      )
        this.ctx.fillText(
          "you won!",
          this.canvas.width / 2,
          this.canvas.height / 1.5
        );
      else if (
        (room.won === Winner.P2 && room.p1_id === this.user_id) ||
        (room.won === Winner.P1 && room.p2_id === this.user_id)
      )
        this.ctx.fillText(
          "you lost !",
          this.canvas.width / 2,
          this.canvas.height / 1.5
        );
    }
  }
}
