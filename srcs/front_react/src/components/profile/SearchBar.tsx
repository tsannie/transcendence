import React, {
  createRef,
  FormEvent,
  Fragment,
  KeyboardEvent,
  useState,
} from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import { api } from "../../const/const";

interface IUserSearch {
  username: string;
  picture: string;
}

function SearchBar() {
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [lengthDictionary, setLengthDictionary] = useState<number>(0);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(-1);
  const [suggestions, setSuggestions] = useState<IUserSearch[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const searchInput = createRef<HTMLInputElement>();

  const nav = useNavigate();

  let suggestionsListComponent = [];

  const handleClick = (e: any) => {
    setActiveSuggestion(0);
    setShowSuggestion(false);
    setUserInput(e.currentTarget.innerText);
  };

  if (showSuggestion && userInput) {
    if (suggestions.length) {
      suggestionsListComponent.push(
        <ul className="suggestions" key="on">
          {suggestions.map((suggestion, index) => {
            let className;

            if (index === activeSuggestion) {
              className = "suggestion-active";
            }
            return (
              <li key={index} className={className} onClick={handleClick}>
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
    return await api
      .get("/user/search", { params: { search: search } })
      .then((res) => {
        return res.data;
      });
  }

  const handleOnChange = async (e: FormEvent<HTMLInputElement>) => {
    const userInput: string = e.currentTarget.value;
    const dictionary = await getDictionary(userInput);

    setLengthDictionary(dictionary.length);

    // update the user input
    setUserInput(userInput);
    setSuggestions(dictionary);
    setShowSuggestion(userInput.length > 0 ? true : false);
    setActiveSuggestion(userInput.length > 0 ? 0 : -1);
  };

  const handleOnKeyDown = (e: KeyboardEvent) => {
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
        nav("/profile/" + userInput);
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

export default SearchBar;
