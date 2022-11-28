import { AxiosResponse } from "axios";
import React, {
  createRef,
  FormEvent,
  Fragment,
  KeyboardEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import { api } from "../../const/const";
import { IChannel } from "./types";

interface IUserSearch {
  id: string;
  username: string;
  picture: string;
}

function SearchBarPlayerInvitation(props: {channel: IChannel}) {
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [lengthDictionary, setLengthDictionary] = useState<number>(0);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [suggestions, setSuggestions] = useState<IUserSearch[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  const searchInput = createRef<HTMLInputElement>();
  const {channel} = props;

  const inviteChannel = async (targetId: string) => {
    await api
      .post("/channel/invite", {
        id: channel.id,
        targetId: targetId,
      })
      .catch((error: any) => toast.error("HTTP error:" + error));
  };

  let suggestionsListComponent = [];

  const handleClick = async (e: MouseEvent, user: IUserSearch) => {
    e.preventDefault();
    await inviteChannel(user.id);
    // Reset props
    setActiveSuggestion(-1);
    searchInput.current?.blur();
    setUserInput("");
  };

  if (showSuggestion && userInput) {
    if (suggestions.length) {
      const rec = document.getElementsByClassName("actions__channel")[0].getBoundingClientRect();
      console.log(rec);
      suggestionsListComponent.push(
        <ul /* style={{top: rec.bottom, left: rec.left}} */ className="suggestions" key="on">
          {suggestions.map((suggestion, index) => {
            let className;

            if (index === activeSuggestion) {
              className = "suggestion-active";
            }
            return (
              <li
                key={index}
                className={className}
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
        <div className="no-suggestions" key="off">
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
    //const userId: string = e.currentTarget.value;

    const dictionary = await getDictionary(userInput);

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
      <div className="profile__header__search__item">
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
