import type { SvgPathProps } from "@helsenorge/designsystem-react/components/Icon";

/**
 * Custom SvgIcon showing a single checkbox with a checkmark inside.
 * Designed for a 48×48 viewBox; a centered square with a stroke checkmark.
 */
const BooleanIcon: React.FC<SvgPathProps> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    {/* Checkbox square */}
    <rect
      x="11"
      y="11"
      width="26"
      height="26"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    {/* Checkmark */}
    <polyline
      points="17,24.5 21.5,29 31,20"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

export default BooleanIcon;
