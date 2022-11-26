import { User } from "../../contexts/AuthContext";
import { ReactComponent as TrophyIcon } from "../../assets/img/icon/trophy.svg";
import { Fragment, useEffect, useState } from "react";
import { api } from "../../const/const";
import { IGameStat, Winner } from "../game/const/const";
import { AxiosResponse } from "axios";
import { Link } from "react-router-dom";

interface IProps {
  player: User | null;
}

function ProfileHistory(props: IProps) {
  let allHistory;

  const [history, setHistory] = useState<IGameStat[]>([]);

  useEffect(() => {
    if (props.player) {
      api
        .get("/game/history")
        .then((res: AxiosResponse) => {
          setHistory(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  if (history.length !== 0) {
    allHistory = history.map((game, index) => {
      // console.log("game", game);
      return (
        <Fragment key={index}>
          <div className="profile__body__history__item">
            <div className="trophy-indicator">
              {(game.winner === Winner.P1 && game.p1.id === props.player?.id) ||
              (game.winner === Winner.P2 && game.p2.id === props.player?.id) ? (
                <TrophyIcon />
              ) : null}
            </div>
            <div className="info">
              <span>
                {(game.winner === Winner.P1 &&
                  game.p1.id === props.player?.id) ||
                (game.winner === Winner.P2 && game.p2.id === props.player?.id)
                  ? "victory"
                  : "defeat"}
              </span>
              <div className="info__elo">
                {(game.winner === Winner.P1 &&
                  game.p1.id === props.player?.id) ||
                (game.winner === Winner.P2 && game.p2.id === props.player?.id)
                  ? game.eloDiff
                  : -game.eloDiff}
              </div>
            </div>
            <Link
              to={
                "/profile/" +
                (game.p1.id === props.player?.id
                  ? game.p2.username
                  : game.p1.username)
              }
            >
              <img
                alt="avatar"
                src={
                  props.player?.id === game.p1.id
                    ? game.p2.profile_picture
                    : game.p1.profile_picture
                }
              />
            </Link>

            <span>
              {props.player?.id === game.p1.id
                ? game.p1_score + " - " + game.p2_score
                : game.p2_score + " - " + game.p1_score}
            </span>
          </div>
          <hr />
        </Fragment>
      );
    });
  }
  return (
    <div className="profile__body__history">
      <div className="profile__body__history__title">
        <h3>recent games</h3>
      </div>
      <hr id="full" />
      <div className="profile__body__history__list">
        {allHistory?.reverse()}
      </div>
    </div>
  );
}

export default ProfileHistory;
