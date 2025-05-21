import React, { useContext } from "react";

import { Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";

import {
  ICodeSystem,
  ICodingProperty,
} from "../../../types/IQuestionnareItemType";

import { updateChildWithMatchingCode } from "../../../helpers/codeHelper";
import createUUID from "../../../helpers/CreateUUID";
import { createUriUUID } from "../../../helpers/uriHelper";
import {
  addItemCodeAction,
  deleteItemCodeAction,
  updateItemCodePropertyAction,
} from "../../../store/treeStore/treeActions";
import { TreeContext } from "../../../store/treeStore/treeStore";
import { ValidationError } from "../../../utils/validationUtils";
import Btn from "../../Btn/Btn";
import FormField from "../../FormField/FormField";
import UriField from "../../FormField/UriField";
import InputField from "../../InputField/inputField";

type CodeProps = {
  linkId: string;
  itemValidationErrors: ValidationError[];
};

const Codes = ({
  linkId,
  itemValidationErrors,
}: CodeProps): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);

  const codes = state.qItems[linkId].code?.map((code) => {
    // Add id (for internal usage) if not already set
    return { ...code, id: code.id || createUUID() };
  });

  const createEmptyCode = (): Coding => {
    return { code: "", display: "", system: createUriUUID(), id: createUUID() };
  };

  const updateChildWithTableColumnCode = (
    value: string,
    code: string,
  ): void => {
    updateChildWithMatchingCode(
      state.qItems[linkId],
      state.qItems,
      state.qOrder,
      value,
      ICodeSystem.tableColumn,
      code,
      dispatch,
    );
  };

  const updateCode = (
    index: number,
    prop: ICodingProperty,
    value: string,
    system?: string,
    code?: string,
  ): void => {
    dispatch(updateItemCodePropertyAction(linkId, index, prop, value));

    if (
      prop === ICodingProperty.display &&
      system === ICodeSystem.tableColumnName
    ) {
      updateChildWithTableColumnCode(value, code || "");
    }
  };

  const renderCode = (code: Coding, index: number): React.JSX.Element => {
    const hasValidationError = itemValidationErrors.some(
      (x) => x.errorProperty.substring(0, 4) === "code" && index === x.index,
    );
    return (
      <div
        key={`${code.id}`}
        className={`code-section ${
          hasValidationError ? "validation-error" : ""
        }`}
      >
        <div className="horizontal equal">
          <FormField label={t("Display")}>
            <InputField
              defaultValue={code.display}
              onBlur={(event) =>
                updateCode(
                  index,
                  ICodingProperty.display,
                  event.target.value,
                  code.system,
                  code.code,
                )
              }
            />
          </FormField>
          <FormField label={t("Code")}>
            <InputField
              defaultValue={code.code}
              onBlur={(event) =>
                updateCode(index, ICodingProperty.code, event.target.value)
              }
            />
          </FormField>
        </div>
        <div className="horizontal full">
          <FormField label={t("System")}>
            <UriField
              value={code.system}
              onBlur={(event) =>
                updateCode(index, ICodingProperty.system, event.target.value)
              }
            />
          </FormField>
        </div>
        <div className="center-text">
          <Btn
            title={`- ${t("Remove Code")}`}
            type="button"
            onClick={() => dispatch(deleteItemCodeAction(linkId, index))}
            variant="secondary"
          />
        </div>
        <hr style={{ margin: "24px 0px" }} />
      </div>
    );
  };

  return (
    <div className="codes">
      {codes && codes.map((code, index) => renderCode(code, index))}
      <div className="center-text">
        <Btn
          title={`+ ${t("Add Code")}`}
          type="button"
          onClick={() => {
            dispatch(addItemCodeAction(linkId, createEmptyCode()));
          }}
          variant="primary"
        />
      </div>
    </div>
  );
};

export default Codes;
