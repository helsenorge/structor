import styles from "./IndentRenderer.module.scss";

interface IndentRendererProps {
  nodeId: string;
  ancestorContinuations: boolean[];
  isLast: boolean;
}

export const IndentRenderer = ({
  nodeId,
  ancestorContinuations,
  isLast,
}: IndentRendererProps): JSX.Element => {
  // The last entry in ancestorContinuations is always !isLast, which
  // is redundant with the self column's data-last attribute.  Slice it off
  // so we don't render an extra phantom column.
  const visibleAncestors = ancestorContinuations.slice(0, -1);

  return (
    <span className={styles.indent} aria-hidden="true">
      {visibleAncestors.map((cont, idx) => (
        <span
          key={`${nodeId}-indent-${idx}`}
          className={styles.indentCol}
          data-continuation={cont ? "1" : "0"}
        />
      ))}
      <span
        className={`${styles.indentCol} ${styles.indentColSelf}`}
        data-last={isLast ? "1" : "0"}
      />
    </span>
  );
};
