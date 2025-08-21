import React from "react";

import { Identifier, ValueSet } from "fhir/r4";
import Identifiers from "src/components/extensions/valueInputs/Identifiers";
import { toIsoOrUndefined } from "src/utils/dateUtils";
import { initialIdentifier } from "src/views/codeSystems/utils";
import ContactDetails from "src/views/components/contactDetail/ContactDetails";

import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import DatePicker from "@helsenorge/datepicker/components/DatePicker";

import { useValueSetContext } from "../../context/useValueSetContext";
import { initialContact } from "../../utils/intialValuesets";

import styles from "./value-set-details.module.scss";

export const ValueSetDetails = (): React.JSX.Element => {
  const { newValueSet, setNewValueSet } = useValueSetContext();
  const addNewIdentifier = (): void => {
    setNewValueSet((prev) => ({
      ...prev,
      identifier: [...(prev?.identifier || []), initialIdentifier()],
    }));
  };
  const handleIdentifierChange = (
    index: number,
    value: Identifier | undefined,
  ): void => {
    setNewValueSet({
      ...newValueSet,
      identifier: newValueSet.identifier
        ?.map((j, i) => (i === index ? value : j))
        .filter((item): item is Identifier => item !== undefined),
    });
  };
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
        label={<Label labelTexts={[{ text: "Name" }]} />}
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
        label={<Label labelTexts={[{ text: "Date" }]} />}
        dateValue={newValueSet.date ? new Date(newValueSet.date) : undefined}
        onChange={(_e, next) =>
          setNewValueSet((prev) => ({
            ...prev,
            date: toIsoOrUndefined(next),
          }))
        }
      />
      <Select
        label={<Label labelTexts={[{ text: "Status" }]} />}
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
      <div className={styles.identifierContainer}>
        <Identifiers
          addNewIdentifier={addNewIdentifier}
          handleChange={handleIdentifierChange}
          identifiers={newValueSet.identifier}
        />
      </div>

      <ContactDetails
        contacts={newValueSet.contact}
        handleUpdate={(field, value, index) =>
          setNewValueSet((prev) => ({
            ...prev,
            contact: prev.contact?.map((c, i) =>
              i === index ? { ...c, [field]: value } : c,
            ),
          }))
        }
        handleAdd={() =>
          setNewValueSet((prev) => ({
            ...prev,
            contact: [...(prev.contact || []), initialContact()],
          }))
        }
        handleRemove={(index) =>
          setNewValueSet((prev) => ({
            ...prev,
            contact: prev.contact?.filter((_, i) => i !== index),
          }))
        }
      />
    </div>
  );
};
