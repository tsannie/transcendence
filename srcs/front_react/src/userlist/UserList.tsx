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
  id: number;
  username: string;
}

interface UserListProps {
  users: IUser[];
  getAllUsers: () => Promise<void>;
  handleClick: (event: React.MouseEvent<HTMLElement>) => void;
}

export default function UserList(props: UserListProps) {
  // Declare a new state variable

  //TODO: create socket to get new users and update the list

  // Similar to componentDidMount and componentDidUpdate
  useEffect(() => {
    props.getAllUsers();
  }, []);

  // display all users connected in the database
  return (
    <>
      <List>
        {props.users.map((user: IUser) => (
          <ListItem
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
