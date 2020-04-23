import React from 'react';

function SearchBar(props) {
  return (
    <input
      type="text"
      name="search"
      value={props.search}
      className="search"
      placeholder="Search by name"
      onChange={props.onChange}
    />
  );
}

export default SearchBar;
