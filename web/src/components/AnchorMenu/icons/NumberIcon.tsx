import type { SvgPathProps } from "@helsenorge/designsystem-react/components/Icon";

/**
 * Custom SvgIcon showing a hash/number sign (#) for numeric question types.
 * Two slightly tilted vertical lines crossed by two horizontal lines,
 * drawn with clean strokes to match the design system icon style.
 * Designed for a 48×48 viewBox.
 */
const NumberIcon: React.FC<SvgPathProps> = (props) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    {/* Left vertical (slightly tilted) */}
    <line
      x1="18"
      y1="8"
      x2="16"
      y2="40"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Right vertical (slightly tilted) */}
    <line
      x1="32"
      y1="8"
      x2="30"
      y2="40"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Top horizontal */}
    <line
      x1="10"
      y1="18"
      x2="38"
      y2="18"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    {/* Bottom horizontal */}
    <line
      x1="10"
      y1="30"
      x2="38"
      y2="30"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

export default NumberIcon;
