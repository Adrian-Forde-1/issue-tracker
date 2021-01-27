import React from "react";

const DangerSVG = ({ classes }) => {
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
        d="M128 24a104 104 0 1 0 104 104A104.118 104.118 0 0 0 128 24zm-8 56a8 8 0 0 1 16 0v56a8 8 0 0 1-16 0zm8 104a12 12 0 1 1 12-12a12 12 0 0 1-12 12z"
        fill="currentColor"
      />
    </svg>
  );
};

export default DangerSVG;
