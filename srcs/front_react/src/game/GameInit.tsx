import { socket } from "./Game";



export default function GameInit(props: any) {


  function lookAtAllGameRoom() {
    //UserContext.Provider;
  
    props.setisLookingRoom(true);
  
    console.log("LOOKNIGRROM LOG");
    //console.log(listGame)
  
    socket.emit("lookAllGameRoom", "lookroom");
  }

  function createGameRoom() {
    if (props.room == "")
    props.setPP_empty("INVALID ROOM NAME");
    else if (props.isinroom == false) {
      socket.emit("createGameRoom", props.room);
    }
  }

  function createFastGameRoom() {
    props.setRoom("");
    if (props.isinroom == false) {
      socket.emit("createGameRoom", props.room);
    }
  }


  return (
    <div className="Game">
      <h2> you are : {props.my_id} </h2>

      <h4> Invite un ami a jouer</h4>
      <input
        type="text"
        placeholder="username"
        id="room"
        onChange={(event) => {
          props.setRoom(event.target.value);
        }}
      ></input>
      <button onClick={createGameRoom}>PARTIE PERSONALISE</button>
      <p>{props.PP_empty}</p>
      <br />
      <h4> partie classee</h4>

      <button onClick={createFastGameRoom}>PARTIE RAPIDE</button>

      <p style={{ color: "red" }}> {props.isfull} </p>

      <h4>
        {" "}
        REGARDER une partie :
        <button onClick={lookAtAllGameRoom}>regarder la partie</button>{" "}
      </h4>

      {
        // WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!! ----------
        /*       <p> La partie dans la room :  "{listGame}"" + "{listGame[0]}" + "{listGame[1]}" + "{listGame[2]}"
      <button onClick={createFastGameRoom}>regarder la partie</button>
      </p>
      
      {listGame.map((element, index) => {
      return (
        <div key={index}>
          <p>partie : "{element}" <button onClick={createFastGameRoom}>regarder la partie</button>
          </p>
        </div>
      );
      })} */
        // WORK IN PROGRESS !!! WORK IN PROGRESS !!! WORK IN PROGRESS !!! ----------
      }
    </div>
  );
}
