import type { SvgPathProps } from "@helsenorge/designsystem-react/components/Icon";

/**
 * Custom SvgIcon showing a beaker/flask with measurement lines for quantity fields.
 * A laboratory flask shape with horizontal measurement tick marks,
 * representing measured quantities with units.
 * Designed for a 48×48 viewBox.
 */
const QuantityIcon: React.FC<SvgPathProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isHovered: _isHovered,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColor: _onColor,
  ...props
}) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    {/* Flask/beaker outline */}
    <path
      d="M 18 8 L 18 16 L 12 32 C 11 35 12 38 15 39 L 33 39 C 36 38 37 35 36 32 L 30 16 L 30 8 Z"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
    {/* Top opening */}
    <line
      x1="16"
      y1="8"
      x2="32"
      y2="8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    {/* Measurement lines (3 horizontal tick marks) */}
    <line
      x1="14"
      y1="28"
      x2="20"
      y2="28"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line
      x1="16"
      y1="23"
      x2="22"
      y2="23"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
    <line
      x1="20"
      y1="18"
      x2="26"
      y2="18"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

/**
 * Custom SvgIcon showing a ruler with measurement marks for quantity fields.
 * A horizontal ruler with multiple tick marks of varying lengths,
 * representing precise measurement and quantities.
 * Designed for a 48×48 viewBox.
 */
export const QuantityIcon2: React.FC<SvgPathProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isHovered: _isHovered,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColor: _onColor,
  ...props
}) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    {/* Ruler base */}
    <rect
      x="8"
      y="18"
      width="32"
      height="12"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.6"
      fill="none"
    />
    {/* Long tick marks (every 4 units) */}
    <line
      x1="12"
      y1="18"
      x2="12"
      y2="26"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="20"
      y1="18"
      x2="20"
      y2="26"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="28"
      y1="18"
      x2="28"
      y2="26"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="36"
      y1="18"
      x2="36"
      y2="26"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    {/* Short tick marks (in between) */}
    <line
      x1="16"
      y1="18"
      x2="16"
      y2="22"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="24"
      y1="18"
      x2="24"
      y2="22"
      stroke="currentColor"
      strokeWidth="1"
    />
    <line
      x1="32"
      y1="18"
      x2="32"
      y2="22"
      stroke="currentColor"
      strokeWidth="1"
    />
  </svg>
);

/**
 * Custom SvgIcon showing a gauge/meter dial for quantity fields.
 * A semicircular gauge with tick marks and a needle indicator,
 * representing measured values and quantities with precision.
 * Designed for a 48×48 viewBox.
 */
export const QuantityIcon3: React.FC<SvgPathProps> = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isHovered: _isHovered,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onColor: _onColor,
  ...props
}) => (
  <svg viewBox="0 0 48 48" fill="none" {...props}>
    {/* Gauge arc */}
    <path
      d="M 10 32 A 14 14 0 0 1 38 32"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      fill="none"
    />
    {/* Tick marks around the gauge */}
    <line
      x1="12"
      y1="32"
      x2="14"
      y2="30"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="16"
      y1="22"
      x2="18"
      y2="23"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="24"
      y1="16"
      x2="24"
      y2="19"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="32"
      y1="22"
      x2="30"
      y2="23"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <line
      x1="36"
      y1="32"
      x2="34"
      y2="30"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    {/* Center pivot point */}
    <circle cx="24" cy="32" r="1.5" fill="currentColor" />
    {/* Needle pointing to mid-range */}
    <line
      x1="24"
      y1="32"
      x2="30"
      y2="24"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

export default QuantityIcon;
