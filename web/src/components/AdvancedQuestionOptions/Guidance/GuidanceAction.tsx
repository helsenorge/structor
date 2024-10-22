import { FocusEvent, useContext } from "react";

import { QuestionnaireItem } from "fhir/r4";
import { useTranslation } from "react-i18next";

import { IExtensionType } from "../../../types/IQuestionnareItemType";

import {
  createGuidanceActionExtension,
  hasExtension,
  removeItemExtension,
  setItemExtension,
} from "../../../helpers/extensionHelper";
import { getGuidanceAction } from "../../../helpers/QuestionHelper";
import { TreeContext } from "../../../store/treeStore/treeStore";
import FormField from "../../FormField/FormField";
import InputField from "../../InputField/inputField";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";

type GuidanceActionProps = {
  item: QuestionnaireItem;
};

const GuidanceAction = (props: GuidanceActionProps): JSX.Element => {
  const { t } = useTranslation();
  const { dispatch } = useContext(TreeContext);
  const hasGuidanceAction = hasExtension(
    props.item,
    IExtensionType.guidanceAction,
  );
  const action = getGuidanceAction(props.item);

  const toggleGuidanceAction = (): void => {
    if (hasGuidanceAction) {
      removeItemExtension(props.item, IExtensionType.guidanceAction, dispatch);
    } else {
      setItemExtension(props.item, createGuidanceActionExtension(), dispatch);
    }
  };

  const updateGuidanceAction = (event: FocusEvent<HTMLInputElement>): void => {
    setItemExtension(
      props.item,
      createGuidanceActionExtension(event.target.value),
      dispatch,
    );
  };

  return (
    <div>
      <FormField>
        <SwitchBtn
          onChange={toggleGuidanceAction}
          value={hasGuidanceAction}
          label={t("Redirect user")}
        />
      </FormField>
      {hasGuidanceAction && (
        <FormField label={t("Relative redirect url")}>
          <InputField
            defaultValue={action}
            placeholder={t("For example /infopage")}
            onBlur={updateGuidanceAction}
          />
        </FormField>
      )}
    </div>
  );
};

export default GuidanceAction;
