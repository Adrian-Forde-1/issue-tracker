import React from "react";

const CaretDownNoFillSVG = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${classes}`}
      aria-hidden="true"
      focusable="false"
      width="1em"
      height="1em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 256 256"
    >
      <path
        d="M128 180a3.989 3.989 0 0 1-2.829-1.171l-80-80a4 4 0 0 1 5.658-5.657L128 170.343l77.171-77.171a4 4 0 0 1 5.658 5.656l-80 80A3.989 3.989 0 0 1 128 180z"
        fill="currentColor"
      />
    </svg>
  );
};

export default CaretDownNoFillSVG;
