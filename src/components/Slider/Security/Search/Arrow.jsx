import React from 'react';

const Arrow = ({rotation = 0}) => (
  <svg
    style={{transform: `rotate(${rotation}deg)`}}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    fill="none"
    stroke="#818181"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M6 9L12 15 18 9"></path>
  </svg>
);
export default Arrow;
