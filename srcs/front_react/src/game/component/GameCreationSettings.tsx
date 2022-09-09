
export default function GameCreationSettings(props: any) {
  return (
    <div className="queues">
      <h2> you are : {props.my_id} </h2>

      <p> waiting for opponent in room {props.room} </p>
      <button onClick={props.deleteGameRoom}>leave room {props.room}</button>
    </div>
  );
}
