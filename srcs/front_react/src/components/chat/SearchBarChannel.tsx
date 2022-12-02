import { ChangeEvent, useState } from "react";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import { IChannel } from "./types";

interface IProps {
  channelDictionnary: IChannel[];
  setSelectionChannels: (channels: IChannel[]) => void;
}

function SearchBarChannel(props: IProps) {
  const [userInput, setUserInput] = useState<string>("");

  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setUserInput(input);
    const filterChannels = props.channelDictionnary.filter((channel) => {
      return channel.name.toLowerCase().includes(input.toLowerCase());
    });
    props.setSelectionChannels(filterChannels);
  };

  return (
    <div className="join-channel__action__search">
      <SearchIcon />
      <input
        type="text"
        spellCheck="false"
        onChange={handleOnChange}
        placeholder="search"
        value={userInput}
      />
    </div>
  );
}

export default SearchBarChannel;
