import React from "react";

import {
  Coding,
  QuestionnaireItem,
  QuestionnaireItemAnswerOption,
  ValueSet,
  ValueSetComposeIncludeConcept,
} from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IItemProperty } from "../../../types/IQuestionnareItemType";

import { getValueSetValues } from "../../../helpers/valueSetHelper";
import FormField from "../../FormField/FormField";
import Select from "../../Select/Select";
import Typeahead from "../../Typeahead/Typeahead";

interface PredefinedValueSetsProps {
  item: QuestionnaireItem;
  qContained: ValueSet[] | undefined;
  dispatchUpdateItem: (
    name: IItemProperty,
    value:
      | string
      | boolean
      | QuestionnaireItemAnswerOption[]
      | Element
      | undefined,
  ) => void;
}

const PredefinedValueSets = ({
  item,
  qContained,
  dispatchUpdateItem,
}: PredefinedValueSetsProps): React.JSX.Element => {
  const { t } = useTranslation();

  const containedValueSets =
    qContained?.map((valueSet) => {
      return {
        code: valueSet.id,
        display: valueSet.title,
      } as ValueSetComposeIncludeConcept;
    }) || [];

  const handleDisplaySelected = (): string => {
    if (item.answerValueSet && item.answerValueSet.indexOf("#") >= 0) {
      return item.answerValueSet.substring(1);
    }
    return "";
  };

  const renderPreDefinedValueSet = (): JSX.Element[] | undefined => {
    const selectedPredefinedValueSet = handleDisplaySelected();
    if (selectedPredefinedValueSet !== "") {
      return getContainedValueSetValues(selectedPredefinedValueSet).map(
        (x, index) => {
          return (
            <div className="predefined-value" key={x.code}>
              {`item ${index + 1}`} <br /> {`${x.code}: (${x.display})`}
              <br />
              {`${t("has extensions")}: ${x.extension ? t("Yes") : t("No")}`}
            </div>
          );
        },
      );
    }

    return undefined;
  };

  const handleDisplaySelectedTitle = (): string => {
    if (item.answerValueSet && item.answerValueSet.indexOf("#") >= 0) {
      const id = item.answerValueSet.substring(1);
      return qContained?.find((x) => x.id === id)?.title || "";
    }
    return "";
  };

  const handleSelectedValueSet = (id: string): void => {
    const valueSet = qContained?.find((x) => x.id === id);
    if (valueSet) {
      dispatchUpdateItem(IItemProperty.answerValueSet, `#${id}`);
    }
  };

  const getContainedValueSetValues = (valueSetId: string): Array<Coding> => {
    const valueSet = qContained?.find((x) => x.id === valueSetId);
    return getValueSetValues(valueSet);
  };

  return (
    <>
      <FormField label={t("Select answer valueset")}>
        {containedValueSets.length > 5 ? (
          <Typeahead
            defaultValue={handleDisplaySelectedTitle()}
            items={containedValueSets}
            onChange={handleSelectedValueSet}
          />
        ) : (
          <Select
            value={handleDisplaySelected()}
            options={containedValueSets || []}
            onChange={(event) => handleSelectedValueSet(event.target.value)}
            placeholder={t("Choose an option..")}
          />
        )}
      </FormField>
      <FormField>{renderPreDefinedValueSet()}</FormField>
    </>
  );
};

export default PredefinedValueSets;
