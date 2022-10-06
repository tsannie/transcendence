import { Button, List, ListItem } from "@mui/material";
import React, { useEffect, useState } from "react";
import { IChannel } from "../types";
import { LockIcon } from "./LockIcon";

interface AvailableChannelsProps {}

export default function AvailableChannels(props: AvailableChannelsProps) {
  const [availableChannels, setAvailableChannels] = useState<IChannel[]>([]);

  /* async function getAvailableChannels() {

  } */

  useEffect(() => {
    // getAvailableChannels()
  }, []);

  return (
    <div>
      Available Channels
      <List>
        {availableChannels.map((channel) => (
          <ListItem>
            {channel.name}
            <>{channel.status === "Protected" ? <LockIcon /> : <></>}</>
            <Button>Join</Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
