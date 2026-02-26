import type { SvgPathProps } from "@helsenorge/designsystem-react/components/Icon";

/**
 * Custom SvgIcon showing three checkbox-style options for choice question types.
 * Three squares with one checked to indicate selection, designed for a 48×48 viewBox.
 */
const ChoiceIcon: React.FC<SvgPathProps> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    {/* Option 1 – selected (filled square inside) */}
    <rect
      x="8"
      y="6"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <rect x="10" y="8" width="4" height="4" fill="currentColor" />
    <line
      x1="20"
      y1="10"
      x2="40"
      y2="10"
      stroke="currentColor"
      strokeWidth="1.2"
    />

    {/* Option 2 – unselected */}
    <rect
      x="8"
      y="20"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <line
      x1="20"
      y1="24"
      x2="40"
      y2="24"
      stroke="currentColor"
      strokeWidth="1.2"
    />

    {/* Option 3 – unselected */}
    <rect
      x="8"
      y="34"
      width="8"
      height="8"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <line
      x1="20"
      y1="38"
      x2="40"
      y2="38"
      stroke="currentColor"
      strokeWidth="1.2"
    />
  </svg>
);

export default ChoiceIcon;
