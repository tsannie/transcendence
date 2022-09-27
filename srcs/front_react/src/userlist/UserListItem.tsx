import React, { useEffect, useState } from "react";
import axios from "axios";
import { COOKIE_NAME } from "../const";
import { Box, List, ListItem } from "@mui/material";

export const api = axios.create({
  // TODO moove to a constant file
  withCredentials: true,
  baseURL: "http://localhost:4000/",
});

export interface IUser {
  id?: number;
  username?: string;
}

export default function UserList(props: any) {
  // Declare a new state variable
  const [users, setUsers] = React.useState<Array<IUser>>([]);

  async function getAllUsers() {
    await api
      .get("user")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((res) => {
        console.log("invalid jwt");
        console.log(res);
      });
  }


  //TODO: create socket to get new users and update the list

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    getAllUsers();
  }, []);

  // display all users connected in the database
  return (
    <>
      <List sx={{}}>
        {users.map((user) => (
          <ListItem
            sx={{
             /*  border: "1px solid black",
              mt: 2,
              alignItems: "center",
              width: "fit-content",
              height: "fit-content",
              borderRadius: "3px", */
            }}
            key={user.id}
            onClick={props.handleClick}
          >
            {user.username}
          </ListItem>
        ))}
      </List>
    </>
  );
}
