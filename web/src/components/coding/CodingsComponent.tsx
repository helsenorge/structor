import { Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";

import Button from "@helsenorge/designsystem-react/components/Button";
import Expander from "@helsenorge/designsystem-react/components/Expander";
import ExpanderList from "@helsenorge/designsystem-react/components/ExpanderList";
import Icon from "@helsenorge/designsystem-react/components/Icon";
import PlusSmall from "@helsenorge/designsystem-react/components/Icons/PlusSmall";

import CodingComponent from "./CodingComponent";

import style from "./codingComponent.module.scss";
type Props = {
  codings?: Coding[];
  updateCoding: (coding?: Coding[]) => void;
  hasValidationError?: (index: number) => boolean;
  collapsable?: boolean;
  label?: React.ReactNode;
  addText?: string;
  deleteText?: string;
};

const CodingsComponent = ({
  codings,
  updateCoding,
  hasValidationError,
  collapsable,
  label,
  addText,
  deleteText,
}: Props): React.JSX.Element => {
  const { t } = useTranslation();
  const handleUpdateCodings = (coding: Coding, index: number): void => {
    updateCoding(codings?.map((c, i) => (i === index ? coding : c)));
  };
  const handleRemoveCoding = (index: number): void => {
    updateCoding(codings?.filter((_, i) => i !== index));
  };
  const addCoding = (): void => {
    const newCoding: Coding = {
      id: createUUID(),
      code: "",
      display: "",
      system: createUriUUID(),
    };
    updateCoding([...(codings || []), newCoding]);
  };
  return (
    <div>
      <header className={style.codingHeader}>
        {label ? label : null}
        <Button
          variant="borderless"
          onClick={addCoding}
          ariaLabel={addText ?? t("Add coding")}
        >
          <Icon svgIcon={PlusSmall} />

          {addText ?? t("Add coding")}
        </Button>
      </header>
      <ExpanderList>
        {codings?.map((coding, index) =>
          collapsable ? (
            <Expander
              key={coding.id || coding.code}
              title={`${coding.system || t("New coding")}`}
              contentClassNames={`${style.codingContent} ${hasValidationError && hasValidationError(index) ? style.error : ""}`}
              expanded={
                hasValidationError && hasValidationError(index)
                  ? true
                  : index === 0
              }
            >
              <CodingComponent
                coding={coding}
                updateCoding={(coding) => handleUpdateCodings(coding, index)}
                removeCoding={() => handleRemoveCoding(index)}
                deleteText={deleteText}
              />
            </Expander>
          ) : (
            <CodingComponent
              key={coding.id || coding.code}
              coding={coding}
              updateCoding={(coding) => handleUpdateCodings(coding, index)}
              removeCoding={() => handleRemoveCoding(index)}
              deleteText={deleteText}
            />
          ),
        )}
      </ExpanderList>
    </div>
  );
};

export default CodingsComponent;
