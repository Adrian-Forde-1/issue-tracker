import React from "react";

const Spinner = () => {
  return (
    <div className="spinner__wrapper">
      <svg className="spinner">
        <circle cx="25" cy="25" r="25"></circle>
      </svg>
    </div>
  );
};

export default Spinner;
