import { Grid, List, ListItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { api } from "../../../userlist/UserList";
import { IDm, IMessage } from "../types";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi


export default function DmList(props: any) {
  const [dms, setDms] = React.useState<Array<IDm>>([]);

  /* useEffect(() => {
    props.socket.on("getDM", (data: any) => {
      console.log("getDM");
      console.log(data);
      setDms(data);
    });
    //getAllDms();
  }, [dms]);
 */
  return (
    <>
      <List sx={{ /* border: "1px solid grey" */ }}>
        {dms.map((dm: any) => (
          <ListItem
            sx={{
              border: "1px solid black",
              mt: 2,
              alignItems: "center",
              width: "fit-content",
              height: "fit-content",
              borderRadius: "3px",
            }}
            key={dm.id}
            onClick={() => {
              props.setOpenConv(true);
              //props.setConvId(dm.id);
            }}
          >
            {dm.name}
          </ListItem>
        ))}
      </List>
    </>
  );
}
