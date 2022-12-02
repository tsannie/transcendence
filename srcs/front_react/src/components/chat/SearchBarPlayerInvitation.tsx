import { AxiosResponse } from "axios";
import React, {
  createRef,
  FormEvent,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  useContext,
  useState,
} from "react";
import { toast } from "react-toastify";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import { api } from "../../const/const";
import { AuthContext } from "../../contexts/AuthContext";
import { IChannel } from "./types";

interface IUserSearch {
  id: string;
  username: string;
  picture: string;
}

function SearchBarPlayerInvitation(props: {channel: IChannel}) {
  const { user } = useContext(AuthContext);

  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [lengthDictionary, setLengthDictionary] = useState<number>(0);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [suggestions, setSuggestions] = useState<IUserSearch[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const searchInput = createRef<HTMLInputElement>();
  const {channel} = props;

  const inviteChannel = (targetId: string) => {
    api
      .post("/channel/invite", {
        id: channel.id,
        targetId: targetId,
      })
      .catch((error: any) => toast.error("HTTP error:" + error.response.data.message));
  };

  let suggestionsListComponent = [];

  const handleClick = (e: MouseEvent, user: IUserSearch) => {
    e.preventDefault();
    inviteChannel(user.id);
    // Reset props
    setActiveSuggestion(-1);
    searchInput.current?.blur();
    setUserInput("");
  };

  if (showSuggestion && userInput) {
    if (suggestions.length) {
      const rec = document.getElementsByClassName("actions__channel")[0].getBoundingClientRect();
      suggestionsListComponent.push(
        <ul style={{top: rec.height, left: 0}} className="suggestions invite-suggestion" key="on">
          {suggestions.map((suggestion, index) => {
            let className;

            if (index === activeSuggestion) {
              className = "suggestion-active";
            }
            return (
              <li
                key={index}
                className={className}
                title={suggestion.username}
                onClick={(e: MouseEvent) => {
                  handleClick(e, suggestion);
                }}
              >
                <img src={suggestion.picture + "&size=small"}></img>
                <span>
                  {suggestion.username.substring(0, 10)}
                  {suggestion.username.length > 10 ? "..." : ""}
                </span>
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent.push(
        <div className="no-suggestions invite-no-suggestions" key="off">
          <em>unknown username !</em>
        </div>
      );
    }
  }

  async function getDictionary(search: string): Promise<IUserSearch[]> {
    if (search.length)
      return await api
        .get("/user/search", { params: { username: search } })
        .then((res: AxiosResponse) => {
          return res.data;
        })
        .catch(() => {
          return [];
        });
    return [];
  }

  const handleOnChange = async (e: FormEvent<HTMLInputElement>) => {
    const userInput: string = e.currentTarget.value;
    let dictionary = await getDictionary(userInput);
    
    if (channel && channel.admins && channel.users && channel.banned) {
      let adminsId : string[], memberId : string[], bannedId: string[];
      
      adminsId = channel.admins.map( elem => elem.id);
      memberId = channel.users.map(elem => elem.id);
      bannedId = channel.banned.map(elem => elem.user.id);
      dictionary = dictionary.filter( (foundUser) => 
      foundUser.id !== user?.id 
      && !adminsId.includes(foundUser.id)
      && !memberId.includes(foundUser.id)
      && !bannedId.includes(foundUser.id) );
    }

    setLengthDictionary(dictionary.length);

    // update the user input
    setUserInput(userInput);
    setSuggestions(dictionary);
    setShowSuggestion(userInput.length > 0 ? true : false);
    setActiveSuggestion(userInput.length > 0 ? 0 : -1);
  };

  const handleOnKeyDown = async (e: KeyboardEvent) => {
    // Up key
    if (e.key === "ArrowUp") {
      if (!showSuggestion) return;
      e.preventDefault();
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // Down key
    else if (e.key === "ArrowDown") {
      if (!showSuggestion) return;
      e.preventDefault();
      if (activeSuggestion + 1 === lengthDictionary) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
    // Enter key
    else if (e.key === "Enter") {
      e.preventDefault();
      if (!showSuggestion && userInput) {
        if (suggestions[activeSuggestion]?.id)
          await inviteChannel(suggestions[activeSuggestion].id);
        // Reset props
        setActiveSuggestion(-1);
        searchInput.current?.blur();
        setUserInput("");
      } else if (activeSuggestion !== -1) {
        setActiveSuggestion(0);
        setShowSuggestion(false);
        if (suggestions[activeSuggestion])
          setUserInput(suggestions[activeSuggestion].username);
      }
    }
  };

  return (
    <Fragment>
      <div className="profile__header__search__item invite">
        <SearchIcon />
        <input
          type="text"
          spellCheck="false"
          onChange={handleOnChange}
          onKeyDown={handleOnKeyDown}
          placeholder="pseudo"
          value={userInput}
          ref={searchInput}
        />
      </div>
      {suggestionsListComponent}
    </Fragment>
  );
}

export default SearchBarPlayerInvitation;
