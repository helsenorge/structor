import type React from "react";

export const RecipientComponentIcon = (): React.JSX.Element => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    width="48"
    height="48"
    aria-hidden="true"
  >
    {/* Outer rounded square */}
    <rect
      x="8"
      y="8"
      width="32"
      height="32"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    {/* Inner square */}
    <rect
      x="16"
      y="16"
      width="16"
      height="16"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    {/* Center circle */}
    <circle
      cx="24"
      cy="24"
      r="4"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
  </svg>
);
