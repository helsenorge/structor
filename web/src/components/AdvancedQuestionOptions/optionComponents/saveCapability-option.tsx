import { elementSaveCapability } from "../../../helpers/QuestionHelper";
import { IExtensionType, IValueSetSystem } from "../../../types/IQuestionnareItemType";
import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "fhir/r4";
import { ActionType } from "../../../store/treeStore/treeStore";
import { useTranslation } from "react-i18next";
import RadioBtn from "../../RadioBtn/RadioBtn";
import { removeItemExtension, setItemExtension } from "../../../helpers/extensionHelper";

type SaveCapabilityOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const SaveCapabilityOption = ({item, dispatch}: SaveCapabilityOptionProps) => {
    const { t } = useTranslation();

    return (
        <FormField label={t('Save capabilities')}>
                <RadioBtn
                    onChange={(newValue: string) => {
                        if (newValue === '0') {
                            removeItemExtension(item, IExtensionType.saveCapability, dispatch);
                        } else {
                            setItemExtension(
                                item,
                                {
                                    url: IExtensionType.saveCapability,
                                    valueCoding: {
                                        system: IValueSetSystem.saveCapabilityValueSet,
                                        code: newValue,
                                    },
                                },
                                dispatch,
                            );
                        }
                    }}
                    checked={
                        item.extension?.find((ex) => ex.url === IExtensionType.saveCapability)?.valueCoding
                            ?.code ?? '0'
                    }
                    options={elementSaveCapability}
                    name={'elementSaveCapability-radio'}
                />
            </FormField>
    )
}