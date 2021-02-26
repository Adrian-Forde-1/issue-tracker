import React from "react";

const Spinner = () => {
  return (
    <div className="spinner__wrapper">
      <svg className="spinner">
        <circle cx="15" cy="15" r="15"></circle>
      </svg>
    </div>
  );
};

export default Spinner;
