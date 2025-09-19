import { FocusEvent, useState } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";
import { ValidationType } from "src/components/Validation/validationTypes";
import { ValidationError } from "src/utils/validationUtils";

import UndoIcon from "../../../images/icons/arrow-undo-outline.svg";
import { updateLinkIdAction } from "../../../store/treeStore/treeActions";
import { ActionType, Items } from "../../../store/treeStore/treeStore";
import InputField from "../../InputField/inputField";

type LinkIdOptionProps = {
  item: QuestionnaireItem;
  dispatch: React.Dispatch<ActionType>;
  qItems: Items;
  parentArray: Array<string>;
  errors: ValidationError[];
};

export const LinkIdOption = ({
  item,
  dispatch,
  qItems,
  parentArray,
  errors,
}: LinkIdOptionProps): JSX.Element => {
  const { t } = useTranslation();
  const [linkId, setLinkId] = useState(item.linkId);
  const [isDuplicateLinkId, setDuplicateLinkId] = useState(false);
  const hasError = errors.some(
    (error) =>
      error.errorProperty === ValidationType.linkId &&
      item.linkId === error.linkId,
  );

  function validateLinkId(linkIdToValidate: string): void {
    const hasLinkIdConflict = !(
      qItems[linkIdToValidate] === undefined || linkIdToValidate === item.linkId
    );
    setDuplicateLinkId(hasLinkIdConflict);
  }

  function resetLinkId(): void {
    setLinkId(item.linkId);
    validateLinkId(item.linkId);
  }

  function dispatchUpdateLinkId(event: FocusEvent<HTMLInputElement>): void {
    // Verify no duplicates
    if (isDuplicateLinkId || event.target.value === item.linkId) {
      return;
    }
    dispatch(updateLinkIdAction(item.linkId, event.target.value, parentArray));
  }

  return (
    <div className={`horizontal full ${hasError ? "error-highlight-box" : ""}`}>
      <div className={`form-field ${isDuplicateLinkId ? "field-error" : ""}`}>
        <label>{t("LinkId")}</label>
        <InputField
          value={linkId}
          onChange={(event) => {
            const {
              target: { value: newLinkId },
            } = event;
            validateLinkId(newLinkId);
            setLinkId(event.target.value);
          }}
          onBlur={dispatchUpdateLinkId}
        />
        {isDuplicateLinkId && (
          <div className="error-text" aria-live="polite">
            {`${t("LinkId is already in use")} `}
            <button onClick={resetLinkId}>
              <img alt="undo icon " src={UndoIcon} height={16} />
              {` ${t("Sett tilbake til opprinnelig verdi")}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
