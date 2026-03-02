import { Button } from "react-aria-components";

import styles from "./DragHandle.module.scss";

interface DragHandleProps {
  ariaLabel: string;
  variant?: "tree" | "toolbox";
  className?: string;
}

export const DragHandle = ({
  ariaLabel,
  variant = "tree",
  className,
}: DragHandleProps): JSX.Element => {
  const handleClassName = [
    styles.dragHandle,
    variant === "toolbox" ? styles.toolbox : styles.tree,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Button slot="drag" className={handleClassName} aria-label={ariaLabel}>
      <span className={styles.dots} aria-hidden="true" />
    </Button>
  );
};
