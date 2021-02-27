import React from "react";

const Spinner = () => {
  return (
    <div className="spinner__wrapper">
      <svg className="spinner">
        <circle cx="16" cy="16" r="16"></circle>
      </svg>
    </div>
  );
};

export default Spinner;
