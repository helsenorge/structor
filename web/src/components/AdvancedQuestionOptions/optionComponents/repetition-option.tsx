import FormField from "../../FormField/FormField";
import { QuestionnaireItem } from "../../../types/fhir";
import { useTranslation } from "react-i18next";
import SwitchBtn from "../../SwitchBtn/SwitchBtn";
import { ActionType } from "../../../store/treeStore/treeStore";
import { removeItemExtension, setItemExtension } from "../../../helpers/extensionHelper";
import { IExtentionType, IItemProperty } from "../../../types/IQuestionnareItemType";
import InputField from "../../InputField/inputField";
import { updateItemAction } from "../../../store/treeStore/treeActions";

type RepetitionOptionProps = {
    item: QuestionnaireItem;
    dispatch: React.Dispatch<ActionType>;
};

export const RepetitionOption = ({item, dispatch}: RepetitionOptionProps) => {
    const { t } = useTranslation();

    const getRepeatsText = item?.extension?.find((x) => x.url === IExtentionType.repeatstext)?.valueString ?? '';
    const minOccurs = item?.extension?.find((x) => x.url === IExtentionType.minOccurs)?.valueInteger;
    const maxOccurs = item?.extension?.find((x) => x.url === IExtentionType.maxOccurs)?.valueInteger;

    return (
        <>
            <div className="horizontal full">
                <FormField
                    label={t('Repetition')}
                    sublabel={t('Choose whether the question group can be repeated')}
                ></FormField>
            </div>
            <FormField>
                <SwitchBtn
                    onChange={(): void => {
                        if (item.repeats) {
                            removeItemExtension(
                                item,
                                [
                                    IExtentionType.repeatstext,
                                    IExtentionType.minOccurs,
                                    IExtentionType.maxOccurs,
                                ],
                                dispatch,
                            );
                        }
                        dispatch(updateItemAction(item.linkId, IItemProperty.repeats, !item.repeats));
                    }}
                    value={item.repeats || false}
                    label={t('Repeatable')}
                />
                {item.repeats && (
                    <>
                        <FormField label={t('Repeat button text')} sublabel={t('Default is set to "Add"')}>
                            <InputField
                                defaultValue={getRepeatsText}
                                onBlur={(e) => {
                                    if (e.target.value) {
                                        const extension = {
                                            url: IExtentionType.repeatstext,
                                            valueString: e.target.value,
                                        }
                                        setItemExtension(item, extension, dispatch);
                                        
                                    } else {
                                        removeItemExtension(item, IExtentionType.repeatstext, dispatch);
                                    }
                                }}
                            />
                        </FormField>
                        <div className="horizontal equal">
                            <FormField
                                label={t('Min answers')}
                                sublabel={t(
                                    'Enter the minimum number of times the question group can be repeated',
                                )}
                            >
                                <input
                                    type="number"
                                    defaultValue={minOccurs}
                                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (!event.target.value) {
                                            removeItemExtension(item, IExtentionType.minOccurs, dispatch);
                                        } else {
                                            const extension = {
                                                url: IExtentionType.minOccurs,
                                                valueInteger: parseInt(event.target.value),
                                            };
                                            setItemExtension(item, extension, dispatch);
                                        }
                                    }}
                                />
                            </FormField>
                            <FormField
                                label={t('Max answers')}
                                sublabel={t(
                                    'Enter the maximum number of times the question group can be repeated',
                                )}
                            >
                                <input
                                    type="number"
                                    defaultValue={maxOccurs}
                                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                        if (!event.target.value) {
                                            removeItemExtension(item, IExtentionType.maxOccurs, dispatch);
                                        } else {
                                            const extension = {
                                                url: IExtentionType.maxOccurs,
                                                valueInteger: parseInt(event.target.value),
                                            };
                                            setItemExtension(item, extension, dispatch);
                                        }
                                    }}
                                />
                            </FormField>
                        </div>
                    </>
                )}
            </FormField>
        </>
    )
}