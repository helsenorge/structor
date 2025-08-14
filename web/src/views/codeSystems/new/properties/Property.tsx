import { CodeSystemProperty } from "fhir/r4";
import { useTranslation } from "react-i18next";
import IdInput from "src/components/extensions/valueInputs/IdInput";

import Button from "@helsenorge/designsystem-react/components/Button";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import RemoveIcon from "@helsenorge/designsystem-react/components/Icons/TrashCan";
import Input from "@helsenorge/designsystem-react/components/Input";
import Label from "@helsenorge/designsystem-react/components/Label";
import Select from "@helsenorge/designsystem-react/components/Select";

import { useCodeSystemContext } from "../../context/useCodeSystemContext";

import styles from "./code-system-properties.module.scss";

type Props = {
  index: number;
  property: CodeSystemProperty;
};

const Property = ({ index, property }: Props): React.JSX.Element => {
  const { setNewCodeSystem } = useCodeSystemContext();
  const { t } = useTranslation();
  const updateProperty = (
    key: keyof CodeSystemProperty,
    value: string,
  ): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      property: prev?.property?.map((c) =>
        c.id === property.id ? { ...c, [key]: value } : c,
      ),
    }));
  };
  const removeProperty = (): void => {
    setNewCodeSystem((prev) => ({
      ...prev,
      property: prev?.property?.filter((c) => c.id !== property.id),
    }));
  };
  return (
    <div className={styles.propertyContainer}>
      <div>
        <IdInput value={property.id} />
        <Input
          value={property.uri}
          onChange={(event) => updateProperty("uri", event.target.value)}
          label="URI"
        />
        <Input
          value={property.code}
          onChange={(event) => updateProperty("code", event.target.value)}
          label="Code"
        />
        <Select
          label={<Label labelTexts={[{ text: "type" }]} />}
          value={property.type || "string"}
          onChange={(event) => updateProperty("type", event.target.value)}
        >
          <option value="code">{"code"}</option>
          <option value="Coding">{"Coding"}</option>
          <option value="string">{"String"}</option>
          <option value="integer">{"Integer"}</option>
          <option value="boolean">{"Boolean"}</option>
          <option value="dateTime">{"DateTime"}</option>
          <option value="decimal">{"Decimal"}</option>
        </Select>
        <Input
          value={property.description}
          onChange={(event) =>
            updateProperty("description", event.target.value)
          }
          label="Description"
        />
      </div>
      <div className={styles.headerContainer}>
        <Button
          variant="borderless"
          onClick={() => removeProperty()}
          concept="destructive"
          ariaLabel={t("Remove include")}
        >
          <Icon svgIcon={RemoveIcon} />
        </Button>
      </div>
    </div>
  );
};
export default Property;
