import React from "react";

//SVG
import SearchSVG from "./SVG/SearchSVG";

function SearchBar(props) {
  return (
    <div className={`search-bar__wrapper ${props.extraClass}`}>
      <span>
        <SearchSVG />
      </span>
      <input
        type="text"
        name="search"
        autoComplete="off"
        value={props.search}
        placeholder={props.placeholder || "Search by name"}
        onChange={props.onChange}
      />
    </div>
  );
}

export default SearchBar;
