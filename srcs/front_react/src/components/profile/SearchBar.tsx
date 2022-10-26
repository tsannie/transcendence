import React, { Fragment, useState } from "react";
import { ReactComponent as SearchIcon } from "../../assets/img/icon/search.svg";

function SearchBar() {
  const suggestionList: string[] = [
    "Alligator",
    "Bask",
    "Crocodilian",
    "Death Roll",
    "Eggs",
    "Jaws",
    "Reptile",
    "Solitary",
    "Tail",
    "Wetlands",
  ];

  const [showSuggestion, setShowSuggestion] = useState(true);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");

  let suggestionsListComponent = [];

  if (showSuggestion && userInput) {
    if (suggestions.length) {
      suggestionsListComponent.push(
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => {
            let className;

            // Flag the active suggestion with a class
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
          <em>No suggestions, you're on your own!</em>
        </div>
      );
    }
  }

  const handleOnChange = (e: any) => {
    console.log("handleOnChange", e.currentTarget.value);
    const userInput = e.currentTarget.value;

    // filter our suggestions
    const filteredSuggestions = suggestionList.filter((suggestion) => {
      return suggestion.toLowerCase().indexOf(userInput.toLowerCase()) > -1;
    });

    // update the user input
    setUserInput(e.currentTarget.value);
    setSuggestions(filteredSuggestions);
    setShowSuggestion(true);
    setActiveSuggestion(0);
  };

  return (
    <Fragment>
      <div className="profile__header__search__item">
        <SearchIcon />
        <input
          type="text"
          onChange={handleOnChange}
          placeholder="pseudo"
          value={userInput}
        />
      </div>
      {suggestionsListComponent}
    </Fragment>
  );
}

export default SearchBar;
