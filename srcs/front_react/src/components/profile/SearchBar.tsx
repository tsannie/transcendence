import React, { FormEvent, Fragment, KeyboardEvent, useState } from "react";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import { api } from "../../const/const";

interface IUserSearch {
  username: string;
  picture: string;
}

function SearchBar() {
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [lengthDictionary, setLengthDictionary] = useState<number>(0);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<IUserSearch[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  let suggestionsListComponent = [];

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
              <li key={index} className={className}>
                <img src={suggestion.picture + "&size=small"}></img>
                <span>{suggestion.username}</span>
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
    setActiveSuggestion(0);
  };

  const handleOnKeyDown = (e: KeyboardEvent) => {
    if (!showSuggestion) return;
    // Up key
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // Down key
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (activeSuggestion + 1 === lengthDictionary) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
    // Enter key
    else if (e.key === "Enter") {
      setActiveSuggestion(0);
      setShowSuggestion(false);
      setUserInput(suggestions[activeSuggestion].username);
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
        />
      </div>
      {suggestionsListComponent}
    </Fragment>
  );
}

export default SearchBar;
