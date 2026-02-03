import { Button } from "react-aria-components";

import styles from "./DragHandle.module.scss";

interface DragHandleProps {
  ariaLabel: string;
  variant?: "tree" | "toolbox";
}

export const DragHandle = ({
  ariaLabel,
  variant = "tree",
}: DragHandleProps): JSX.Element => {
  return (
    <Button
      slot="drag"
      className={`${styles.dragHandle} ${variant === "toolbox" ? styles.toolbox : styles.tree}`}
      aria-label={ariaLabel}
    >
      <span className={styles.dots} aria-hidden="true" />
    </Button>
  );
};
