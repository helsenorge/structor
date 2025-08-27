import { useTranslation } from "react-i18next";

import Input from "@helsenorge/designsystem-react/components/Input";

type Props = {
  value: string | undefined;
};
import styles from "./value-input.module.scss";
const IdInput = ({ value }: Props): React.JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={styles.idInput}>
      <Input testId="id-input" value={value || t("No ID")} disabled />
    </div>
  );
};
export default IdInput;
