export default function Display_game(props: any) {
  if (props.listgamenotz === true) {
    return (
      <div className="look">
        <h4> REGARDER une partie : </h4>
        <button onClick={props.refresh_games_spec}>refresh</button>
        <p> wich game do you want to look at ?</p>
        {props.listGame.map((element: any, index: any) => {
          return (
            <div key={index}>
              <p>
                partie : "{element}"{" "}
                <button
                  onClick={(event) => props.Specthegamedisplay(event, element)}
                >
                  regarder la partie
                </button>
              </p>
            </div>
          );
        })}
        <button onClick={props.leavelookingroom}>leave</button>
      </div>
    );
  } else {
    return (
      <div className="look">
        <h4> REGARDER no game wet : </h4>
        <button onClick={props.refresh_games_spec}>refresh</button>
      </div>
    );
  }
}
