import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { threadId } from "worker_threads";
import { api } from "../../userlist/UserListItem";
import { socket } from "../Game";
let game_ended = false;

export function GameMenuSpectator(props: any) {
  const [listGame, setlistGame] = useState<string[]>([]);
  const [listGamenotz, setlistGamenotz] = useState(false);
  const [g, setg] = useState(true);
  const [game_already_ended, setgame_already_ended] = useState("");

  useEffect(() => {
    socket.on("GameSpecEmpty", () => {
      setg(true);
      setgame_already_ended("game already ended");
      props.setisLookingRoom(true);
      props.setSpecthegame(false);
      console.log("ended");
    });
  }, [socket]);


  async function makeGetRequest(param: any) {
    await api
      .get("/game/game_to_spec")
      .then((res) => {
        console.log(res.data);
        for (const [key, value] of Object.entries(res.data)) {
          let obj: any = value;
          if (obj)
            console.log("room_name = ", obj.room_name);
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

    /*     console.log("====================================");
    console.log("22222game_ended = ", game_ended);
    console.log("===================================="); */

    if (game_ended === false) {
      console.log("\n\n||||||||Specthegamedisplayfunc room [", param, "]");
      setlistGamenotz(false);
      props.setisLookingRoom(false);
      props.setSpecthegame(true);
      props.setRoom_name_spec(param);
    } else {
      console.log("game already ended");
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

  async function get_all_game_room_api() {
    await api
      .get("/game/game_to_spec")
      .then((res) => {
        console.log(res.data);
        let donot = false;
        let key2;
        for (const [key, value] of Object.entries(res.data)) {
          let obj: any = value;
          if (obj) console.log("room_name = ", obj.room_name);
          for (let i = 0; i < listGame.length && donot === false; i++) {
            key2 = listGame[i];
            if (key === key2 || obj.game_started === false) {
              donot = true;
            }
          }
          console.log("obj.game_started = ", obj.game_started);
          if (donot === false && obj.game_started === true) {
            console.log("obj = ", obj);
            listGame.push(obj.room_name);
          } else {
            donot = false;
          }
        }
        for (let i = 0; i < listGame.length; i++) {
          console.log(i + " === " + listGame[i]);
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

  if (g === true) {
    refresh_games_spec_solo();
    setg(false);
  }
  if (listGamenotz === true) {
    return (
      <div className="look">
        <h4> REGARDER une partie : </h4>
        <h4 style={{ color: "red" }}>{game_already_ended}</h4>

        <button onClick={refresh_games_spec}>refresh</button>
        <p> wich game do you want to look at ?</p>
        {listGame.map((element: any, index: any) => {
          return (
            <div key={index}>
              <p>
                partie : "{element}"{" "}
                <button onClick={(event) => Specthegamedisplay(event, element)}>
                  regarder la partie
                </button>
              </p>
            </div>
          );
        })}
        <button onClick={leavelookingroom}>leave</button>
      </div>
    );
  } else {
    return (
      <div className="look">
        <h4> REGARDER no game wet : </h4>
        <h4 style={{ color: "red" }}>{game_already_ended}</h4>

        <button onClick={refresh_games_spec}>refresh</button>
        <br />
        <br />
        <button onClick={leavelookingroom}>leave</button>
      </div>
    );
  }
}
