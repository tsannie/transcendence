import { useEffect, useState } from "react";
/* import { api } from "../../../const/const";
import { socket } from "../Game";
import { GameSpectator } from "./GameSpectator";
let game_ended = false;

export function GameMenuSpectator(props: any) {
  const [listGame, setlistGame] = useState<string[]>([]);
  const [listGamenotz, setlistGamenotz] = useState(false);
  const [game_empty, setgame_empty] = useState(true);
  const [game_already_ended, setgame_already_ended] = useState("");

  const [Specthegame, setSpecthegame] = useState(false);
  const [Room_name_spec, setRoom_name_spec] = useState("");

  useEffect(() => {
    socket.on("GameSpecEmpty", () => {
      setgame_empty(true);
      setgame_already_ended("game already ended");
      props.setisLookingRoom(true);
      props.setSpecthegame(false);
    });
  }, [socket]);

  // check if the game is already ended or not for the spectator to know if he can join or not

  async function makeGetRequest(param: any) {
    await api
      .get("/game/game_to_spec")
      .then((res) => {
        for (const [key, value] of Object.entries(res.data)) {
          let obj: any = value;
          if (obj)
          if (obj && obj.room_name === param) {
            game_ended = false;
          }
        }
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }

  async function set_spectator_to_room(param: any) {
    await makeGetRequest(param);

    if (game_ended === false) {
      setlistGamenotz(false);
      props.setisLookingRoom(false);
      props.setSpecthegame(true);
      props.setRoom_name_spec(param);
    } else {
      setgame_already_ended("game already ended");
    }
  }

  const Specthegamedisplay = (event: any, param: any) => {
    set_spectator_to_room(param);
  };

  function leavelookingroom() {
    game_ended = true;
    listGame.splice(0, listGame.length);
    props.setisLookingRoom(false);
  }

  // Get all game available to spectate and display them by room name

  async function get_all_game_room_api() {
    await api
      .get("/game/game_to_spec")
      .then((res) => {
        let donot = false;
        let key2;
        for (const [key, value] of Object.entries(res.data)) {
          let obj: any = value;
          for (let i = 0; i < listGame.length && donot === false; i++) {
            key2 = listGame[i];
            if (key === key2 || obj.status !== 2) {
              donot = true;
            }
          }
          if (donot === false && obj.status !== 2) {
            listGame.push(obj.room_name);
          } else {
            donot = false;
          }
        }
        if (listGame.length !== 0) {
          setlistGamenotz(true);
        }
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }

  function refresh_games_spec_solo() {
    game_ended = true;
    setlistGamenotz(false);
    listGame.splice(0, listGame.length);
    get_all_game_room_api();
  }

  function refresh_games_spec() {
    setgame_already_ended("");
    refresh_games_spec_solo();
  }

  if (game_empty === true) {
    refresh_games_spec_solo();
    setgame_empty(false);
  }

  if (Specthegame === true)
  return (
    <GameSpectator
      setSpecthegame={setSpecthegame}
      setisLookingRoom={props.setisLookingRoom}
      Specthegame={Specthegame}
      Room_name_spec={Room_name_spec}
      canvasRef={props.canvasRef}
    />
  )
  else if (listGamenotz === true) {
    return (
      <div className="look">
        <h4> watch a game : </h4>
        <h4 style={{ color: "red" }}>{game_already_ended}</h4>

        <button onClick={refresh_games_spec}>refresh</button>
        <p> wich game do you want to look at ?</p>
        {listGame.map((element: any, index: any) => {
          return (
            <div key={index}>
              <p>
                partie : "{element}"{" "}
                <button onClick={(event) => Specthegamedisplay(event, element)}>
                  watch a game :
                </button>
              </p>
            </div>
          );
        })}
        <button onClick={leavelookingroom}>LEAVE</button>
      </div>
    );
  } else {
    return (
      <div className="look">
        <h4> No game wet : </h4>
        <h4 style={{ color: "red" }}>{game_already_ended}</h4>

        <button onClick={refresh_games_spec}>REFRESH</button>
        <br />
        <br />
        <button onClick={leavelookingroom}>LEAVE</button>
      </div>
    );
  }
} */