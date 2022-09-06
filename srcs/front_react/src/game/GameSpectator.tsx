




export default function GameSpectator(props: any) {
  return (
    <div className="look">
      <h4> REGARDER une partie : </h4>
      <p> wich game do you want to look at ?</p>
      {props.listGame.map((element: any, index: any) => {
        props.setLookingRoom(element);
        return (
          <div key={index}>
            <p>
              partie : "{element}"{" "}
              <button onClick={props.lookthegame}>regarder la partie</button>
            </p>
          </div>
        );
      })}
      <button onClick={props.leavelookingroom}>leave</button>
    </div>
  );
}
