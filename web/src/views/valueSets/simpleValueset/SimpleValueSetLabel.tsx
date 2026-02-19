import styles from "./simpleValueset.module.scss";

export const SimpleValueSetLabel: React.FC<{
  code?: string;
  display?: string;
}> = ({ code, display }) => {
  return (
    <li className={styles.valueSetValuesItem}>
      <span className={styles.label}>{"Display: "}</span>
      {display}
      {" ("}
      <span className={styles.label}>{"Code: "}</span> {code}
      {")"}
    </li>
  );
};
