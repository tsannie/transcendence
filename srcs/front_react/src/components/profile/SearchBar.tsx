import React, { FormEvent, Fragment, KeyboardEvent, useState } from "react";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";
import { api } from "../../const/const";

interface IUserSearch {
  username: string;
  picture: string;
}

function SearchBar() {
  const [dictionary, setDictionary] = useState<string[]>([]);
  const [showSuggestion, setShowSuggestion] = useState<boolean>(false);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string>("");

  let suggestionsListComponent = [];

  if (showSuggestion && userInput) {
    if (suggestions.length) {
      suggestionsListComponent.push(
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => {
            let className;

            if (index === activeSuggestion) {
              className = "suggestion-active";
            }
            return (
              <li className={className} key={index}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      suggestionsListComponent.push(
        <div className="no-suggestions">
          <em>unknown username !</em>
        </div>
      );
    }
  }

  async function updateDictionary(search: string) {
    await api.get("/user/search/" + search).then((res) => {
      console.log(res.data);
      setDictionary(res.data);
    });
  }

  const handleOnChange = async (e: FormEvent<HTMLInputElement>) => {
    //console.log("handleOnChange", e.currentTarget.value);
    const userInput: string = e.currentTarget.value;
    await updateDictionary(userInput);

    // filter our suggestions
    const filteredSuggestions = dictionary.filter((suggestion) => {
      return suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
    });

    // update the user input
    setUserInput(userInput);
    setSuggestions(filteredSuggestions);
    setShowSuggestion(userInput.length > 0 ? true : false);
    setActiveSuggestion(0);
  };

  const handleOnKeyDown = (e: KeyboardEvent) => {
    if (!showSuggestion) return;
    // Up key
    if (e.key === "ArrowUp") {
      if (activeSuggestion === 0) {
        return;
      }
      setActiveSuggestion(activeSuggestion - 1);
    }
    // Down key
    else if (e.key === "ArrowDown") {
      if (activeSuggestion - 1 === dictionary.length) {
        return;
      }
      setActiveSuggestion(activeSuggestion + 1);
    }
    // Enter key
    else if (e.key === "Enter") {
      setActiveSuggestion(0);
      setShowSuggestion(false);
      setUserInput(suggestions[activeSuggestion]);
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
