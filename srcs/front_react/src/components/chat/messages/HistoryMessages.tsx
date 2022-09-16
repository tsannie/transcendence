import { Grid, List, ListItem, Typography } from "@mui/material";
import React, { useEffect } from "react";
import { api } from "../../../userlist/UserListItem";
import { IDm, IMessage } from "../types";

// to do: quand tu click sur la conv, ca set props.openConv a true
// et l'id de la conv peut etre ?
// en gros pour que ca affiche la conv de mec que ta cliquer et toi


export default function DmList(props: any) {
  const [dms, setDms] = React.useState<Array<IDm>>([]);

  async function getAllDms() {
    await api
      .get("dm/getAllDms")
      .then((res) => {
        setDms(res.data);
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }

  useEffect(() => {
    getAllDms();
  }, [dms]);

  return (
    <Grid
      alignItems="left"
      container
      direction="column"
      sx={{
        maxWidth: "fit-content",
        maxHeight: "fit-content",
        border: "1px solid red",
      }}
    >
      <Typography
        sx={{
          fontWeight: "bold",
        }}
        variant="h6"
      >
        Conv history
        {/* <List sx={{}}>
        {dms.map((dm) => (
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
            onClick={props.handleClick}
          >
            {dm.user1id}
          </ListItem>
        ))}
      </List> */}
      </Typography>
      <Grid
        item
        sx={{
          display: { xs: props.isNewMessage ? "block" : "none" },
        }}
      >
        <Typography
          sx={{
            fontWeight: "semi-bold",
          }}
          variant="subtitle1"
        >
          Conv 1
        </Typography>
      </Grid>
    </Grid>
  );
}
