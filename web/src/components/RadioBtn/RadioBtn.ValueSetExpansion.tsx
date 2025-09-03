import React from "react";

import { ValueSetExpansionParameter } from "fhir/r4";
import { useTranslation } from "react-i18next";

import styles from "./radio-btn.module.scss";

type Props = {
  onChange: (value: string) => void;
  checked?: string;
  options: ValueSetExpansionParameter[];
};

const ValueSetExpansionRadioBtn = ({
  checked,
  onChange,
  options,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={styles.radioBtn}>
      {options.map((x) => {
        return (
          <div key={x.name}>
            <label>
              <input
                data-testid={`radioBtn-${x.name}`}
                className={styles.radioBtnInput}
                type="radio"
                checked={x.valueUri === checked}
                value={x.valueUri}
                name={x.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  onChange(e.target.value);
                }}
              />
              <span>{` ${t(x.name || "")}`}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default ValueSetExpansionRadioBtn;
