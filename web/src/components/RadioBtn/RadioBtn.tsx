import React from "react";

import { ValueSetComposeIncludeConcept } from "fhir/r4";
import { useTranslation } from "react-i18next";

import styles from "./radio-btn.module.scss";

type Props = {
  onChange: (value: string) => void;
  checked?: string;
  options: ValueSetComposeIncludeConcept[];
  name: string;
};

const RadioBtn = ({
  checked,
  onChange,
  options,
  name,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={styles.radioBtn}>
      {options.map((x) => {
        return (
          <div key={x.code}>
            <label>
              <input
                className={styles.radioBtnInput}
                type="radio"
                checked={x.code === checked}
                value={x.code}
                name={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(e.target.value);
                }}
              />
              <span>{` ${t(x.display || "")}`}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioBtn;
