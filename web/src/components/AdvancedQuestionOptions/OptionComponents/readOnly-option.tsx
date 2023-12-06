import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "../../../types/fhir";
import { useTranslation } from "react-i18next";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";
import { ActionType } from "../../../store/treeStore/treeStore";
import { updateItemAction } from "../../../store/treeStore/treeActions";
import { IItemProperty } from "../../../types/IQuestionnareItemType";

type ReadOnlyOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
    isDataReceiver: boolean;
};

export const ReadOnlyOption = ({item, dispatch, isDataReceiver}: ReadOnlyOptionProps) => {
    const { t } = useTranslation();

    return (
        <>
            <div className="horizontal equal">
                <FormField>
                    <SwitchBtn
                        onChange={() => dispatch(updateItemAction(item.linkId, IItemProperty.readOnly, !item.readOnly))}
                        value={item.readOnly || false}
                        label={t('Read-only')}
                        disabled={isDataReceiver}
                    />
                </FormField>
            </div>
        </>
    )
}