import React from 'react';

function SearchBar(props) {
  return (
    <div className={`search ${props.extraClass}`}>
      <span>
        <i className="fas fa-search"></i>
      </span>
      <input
        type="text"
        name="search"
        value={props.search}
        placeholder="Search by name"
        onChange={props.onChange}
      />
    </div>
  );
}

export default SearchBar;
