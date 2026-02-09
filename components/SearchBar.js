import React from 'react';

/**
 * SearchBar
 *
 * A simple input for filtering the products list. It can be bound to a
 * controlled value and onChange handler. On mobile the bar sticks at
 * the top of the viewport; on desktop it remains inline. The caller
 * should pass in searchText and setSearchText.
 */
const SearchBar = ({ value, onChange }) => {
  return (
    <div className="searchBar">
      <input
        className="input"
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;