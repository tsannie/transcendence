import { Button, Grid } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { socket } from "../Game";

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////

let x = 0;

export function GameSpectator(props: any) {
  const [Specthegame, setSpecthegame] = useState(false);
  const [LookingRoom, setLookingRoom] = useState("null");
  let b = "null";
  
  useEffect(() => {
    /* socket.on("getAllGameRoom", (theroom: Map<any, any>) => {
      props.store.setisLookingRoom(true);
      //props.store.listGame = [];
      console.log("------------------");
      x++;
      console.log("x = " + x);
      console.log("1 socker");
      let donot = false;
      let key2;
      for (const [key, value] of Object.entries(theroom)) {
        //console.log("first[" + key + "]");
        //props.store.setListGame(key);
        //setNames(prevNames => [...prevNames, 'Bob'])}
        //props.store.setListGame((prevNames: any) => [...prevNames, key]);
        //props.store.listGame.

          console.log(props.store.listGame.length);
          for (let i = 0; i < props.store.listGame.length; i++) {
            key2 = props.store.listGame[i];
            //console.log("-[" + key2 + "][" + key + "]");
            //console.log(props.store.listGame[i]);
            if (key === key2) {
              donot = true;
            }
          }

          if (donot === false) {
            //props.store.setListGame((prevNames: any) => [...prevNames, key]);
            props.store.listGame.push(key);
          } else {
            donot = false;
          }
        
        }
        
        for (let i = 0; i < props.store.listGame.length; i++) {
          key2 = props.store.listGame[i];
          //console.log("-[" + key2 + "][" + key + "]");
          console.log("all list = " + props.store.listGame[i]);
  
        }
    }); */



  }, [socket]);

  function Specthegamedisplay() {
    setSpecthegame(true);
    setLookingRoom(b);
    console.log("Specthegame = " + Specthegame);
    socket.emit("Specthegame", LookingRoom);
  }

  function leavelookingroom() {
    //props.store.setisLookingRoom(false);
    //props.store.setLookingRoom("");
    socket.emit("LeaveAllGameRoom", "lookroom");

  }

  function deleteGameRoomSpec() {
    setSpecthegame(false);
    //props.store.setisLookingRoom(false);
    //props.store.setLookingRoom("");
   // socket.emit("LeaveAllGameRoom", "lookroom");

  }

  if (Specthegame === true) {
    return (
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "50vmin" }}
      >
        <h1>THE PONG</h1>

        <Box
        sx={{
          display: 'flex',
          p: 1,
          m: 1,
          bgcolor: 'background.paper',
          borderRadius: 1,
        }}
      >
        <h2 style={{ color: "blue", textAlign: "left" }}>{props.my_id}</h2>
        <h1 style={{ color: "black", textAlign: "center" }}> VS </h1>
        <h2 style={{ color: "red", textAlign: "right" }}>{props.op_id}</h2>
      </Box>

        <canvas
          id="canvas"
          ref={props.canvasRef}
          height="500px"
          width={1000}
          style={{ backgroundColor: "black" }}
        ></canvas>

        <br />
        <br />
        <Button variant="contained"
          onClick={deleteGameRoomSpec} 
        >
          Leave The Game
        </Button>
      </Grid>
  );
  }
  else {
    return (
      <div className="look">
        <h4> REGARDER une partie : </h4>
        <p> wich game do you want to look at ?</p>
        
        {props.listGame.map((element: any, index: any) => {
          b = element;
          return (
            <div key={index}>
              <p>
                partie : "{element}"{" "}
                <button onClick={Specthegamedisplay}>regarder la partie</button>
              </p>
            </div>
          );
        })}
        <button onClick={leavelookingroom}>leave</button>
      </div>
    );
  }
}

////////////////////////////////////////////////////
// WORK IN PROGESS !!!  WORK IN PROGESS !!!  WORK IN PROGESS !!!
////////////////////////////////////////////////////
