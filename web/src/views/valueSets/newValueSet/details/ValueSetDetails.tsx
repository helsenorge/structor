import React from "react";

import { isDate } from "date-fns";
import { ValueSet } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { isRealDate, toIsoOrUndefined } from "src/utils/dateUtils";

import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import DatePicker from "@helsenorge/datepicker/components/DatePicker";

import { useValueSetContext } from "../../context/useValueSetContext";

import styles from "./value-set-details.module.scss";

export const ValueSetDetails = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { newValueSet, setNewValueSet } = useValueSetContext();

  return (
    <div className={styles.valueSetDetails}>
      <Input
        value={newValueSet.title}
        onChange={(event) =>
          setNewValueSet({ ...newValueSet, title: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Title" }]} />}
      />
      <Input
        value={newValueSet.name}
        onChange={(event) =>
          setNewValueSet({ ...newValueSet, name: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Teknisk-navn" }]} />}
      />
      <Input
        value={newValueSet.publisher}
        onChange={(event) =>
          setNewValueSet({ ...newValueSet, publisher: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Publisher" }]} />}
      />
      <Input
        value={newValueSet.version}
        onChange={(event) =>
          setNewValueSet({ ...newValueSet, version: event.target.value })
        }
        label={<Label labelTexts={[{ text: "Version" }]} />}
      />
      <Input
        value={newValueSet.url}
        onChange={(event) =>
          setNewValueSet({ ...newValueSet, url: event.target.value })
        }
        label="Url"
      />
      <DatePicker
        label={<Label labelTexts={[{ text: t("Date") }]} />}
        dateValue={newValueSet.date ? new Date(newValueSet.date) : undefined}
        onChange={(_e, next) =>
          setNewValueSet((prev) => ({
            ...prev,
            date: toIsoOrUndefined(next),
          }))
        }
      />
      <Select
        label={<Label labelTexts={[{ text: "status" }]} />}
        value={newValueSet.status || "draft"}
        onChange={(event) =>
          setNewValueSet({
            ...newValueSet,
            status: event.target.value as ValueSet["status"],
          })
        }
      >
        <option value="draft">{"Draft"}</option>
        <option value="active">{"Active"}</option>
        <option value="retired">{"Retired"}</option>
        <option value="unknown">{"Unknown"}</option>
      </Select>
    </div>
  );
};
