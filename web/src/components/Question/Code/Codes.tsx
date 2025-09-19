import React, { useContext, useEffect, useState } from "react";

import { Coding } from "fhir/r4";
import { useTranslation } from "react-i18next";
import {
  ErrorClassVariant,
  getSeverityClass,
} from "src/components/Validation/validationHelper";

import { ICodingProperty } from "../../../types/IQuestionnareItemType";

import { canEditCode } from "../../../helpers/codeHelper";
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

  const [rollback, setRollback] = useState(false);

  useEffect(() => {
    setRollback(false);
    setCodes(getCodes());
  }, [rollback, state.qItems[linkId].code]);

  const getCodes = (): Coding[] | undefined => {
    return state.qItems[linkId].code?.map((code) => {
      // Add id (for internal usage) if not already set
      return { ...code, id: code.id || createUUID() };
    });
  };

  const [codes, setCodes] = useState(getCodes);

  const createEmptyCode = (): Coding => {
    return { code: "", display: "", system: createUriUUID(), id: createUUID() };
  };

  const updateCode = (
    index: number,
    prop: ICodingProperty,
    value: string,
    system?: string,
  ): void => {
    if (!system || canEditCode(system, prop)) {
      dispatch(updateItemCodePropertyAction(linkId, index, prop, value));
    } else {
      setRollback(true);
    }
  };

  const renderCode = (code: Coding, index: number): React.JSX.Element => {
    const errorClass = getSeverityClass(
      ErrorClassVariant.highlight,
      itemValidationErrors.filter(
        (x) => x.errorProperty.substring(0, 4) === "code" && index === x.index,
      ),
    );
    return (
      <div key={`${code.id}`} className={`code-section ${errorClass}`}>
        <div className="horizontal equal">
          <FormField label={t("Display")}>
            <InputField
              testId={`code-display-${index}`}
              defaultValue={code.display}
              onBlur={(event) =>
                updateCode(
                  index,
                  ICodingProperty.display,
                  event.target.value,
                  code.system,
                )
              }
            />
          </FormField>
          <FormField label={t("Code")}>
            <InputField
              testId={`code-code-${index}`}
              defaultValue={code.code}
              onBlur={(event) =>
                updateCode(
                  index,
                  ICodingProperty.code,
                  event.target.value,
                  code.system,
                )
              }
            />
          </FormField>
        </div>
        <div className="horizontal full">
          <FormField label={t("System")}>
            <UriField
              testId={`code-system-${index}`}
              value={code.system}
              onBlur={(event) =>
                updateCode(
                  index,
                  ICodingProperty.system,
                  event.target.value,
                  code.system,
                )
              }
            />
          </FormField>
        </div>
        <div className="center-text">
          <Btn
            testId={`code-remove-${index}`}
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
          testId="code-add"
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
