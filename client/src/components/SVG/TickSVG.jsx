import React from "react";

const TickSVG = ({ classes }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={`${classes}`}
      aria-hidden="true"
      focusable="false"
      width="0.9em"
      height="0.9em"
      preserveAspectRatio="xMidYMid meet"
      viewBox="0 0 512 512"
    >
      <path
        d="M437.3 30L202.7 339.3L64 200.7l-64 64L213.3 478L512 94z"
        fill="currentColor"
      />
    </svg>
  );
};

export default TickSVG;
