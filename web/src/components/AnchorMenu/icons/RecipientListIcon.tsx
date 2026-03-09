import type React from "react";

export const RecipientListIcon = (): React.JSX.Element => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    width="48"
    height="48"
    aria-hidden="true"
  >
    {/* Three recipient circles */}
    <circle
      cx="12"
      cy="16"
      r="4"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    <circle
      cx="36"
      cy="16"
      r="4"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    <circle
      cx="24"
      cy="32"
      r="4"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    {/* Connecting lines */}
    <line
      x1="16"
      y1="20"
      x2="24"
      y2="28"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="32"
      y1="20"
      x2="24"
      y2="28"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);
