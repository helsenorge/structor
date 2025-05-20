import React, { useContext } from "react";

import { ContactDetail, Extension, Meta, UsageContext } from "fhir/r4";
import { useTranslation } from "react-i18next";
import SwitchBtn from "src/components/SwitchBtn/SwitchBtn";
import { updateQuestionnaireMetadataAction } from "src/store/treeStore/treeActions";
import { IQuestionnaireMetadataType } from "src/types/IQuestionnaireMetadataType";

import {
  ICodeSystem,
  IExtensionType,
  WorkflowCode,
} from "../../../types/IQuestionnareItemType";

import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";

const WorkflowView = (): React.JSX.Element => {
  const { t } = useTranslation();
  const { state, dispatch } = useContext(TreeContext);
  const { qMetadata } = state;

  const hasUseContextWorkflowRequest = (): boolean => {
    const existing = (qMetadata.useContext || []).filter((x: UsageContext) => {
      return x.valueCodeableConcept?.coding?.find((obj) => {
        return (
          obj.system === ICodeSystem.workflow &&
          obj.code === WorkflowCode.request &&
          obj.display === "Henvendelse"
        );
      });
    });
    if (existing === undefined || existing.length === 0) {
      return false;
    } else {
      return true;
    }
  };

  const updateMeta = (
    propName: IQuestionnaireMetadataType,
    value: string | Meta | Extension[] | ContactDetail[] | UsageContext,
  ): void => {
    dispatch(updateQuestionnaireMetadataAction(propName, value));
  };

  return (
    <FormField
      label={t("Workflow")}
      sublabel={t(
        "Should the form be included in a workflow at Helsenorge? This field is only used by Norsk helsenett.",
      )}
    >
      <SwitchBtn
        onChange={() => {
          const updateValue = {
            code: {
              system: IExtensionType.workflow,
              code: WorkflowCode.workflow,
              display: "Workflow Setting",
            },
            valueCodeableConcept: {
              coding: [
                {
                  system: ICodeSystem.workflow,
                  code: WorkflowCode.request,
                  display: "Henvendelse",
                },
              ],
            },
          };

          if (hasUseContextWorkflowRequest()) {
            // Removes useContext by creating a new array without the spesific value and overwrite meta
            const useContextToSet = (qMetadata.useContext || []).filter(
              (x: UsageContext) => {
                return x.valueCodeableConcept?.coding?.find((obj) => {
                  return (
                    obj.system !== ICodeSystem.workflow &&
                    obj.code !== WorkflowCode.request &&
                    obj.display !== "Henvendelse"
                  );
                });
              },
            );
            updateMeta(IQuestionnaireMetadataType.useContext, useContextToSet);
          } else {
            // Adds useContext by pushing value on the existing ones
            const existingUseContexts = (qMetadata.useContext || []).filter(
              (x: UsageContext) => {
                return x.valueCodeableConcept?.coding?.find((obj) => {
                  return (
                    obj.system !== ICodeSystem.workflow &&
                    obj.code !== WorkflowCode.request &&
                    obj.display !== "Henvendelse"
                  );
                });
              },
            );
            existingUseContexts.push(updateValue);
            updateMeta(
              IQuestionnaireMetadataType.useContext,
              existingUseContexts,
            );
          }
        }}
        value={hasUseContextWorkflowRequest() || false}
        label={t("Request")}
      />
    </FormField>
  );
};

export default WorkflowView;
