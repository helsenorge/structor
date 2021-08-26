import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { IExtentionType, IItemProperty, IQuestionnaireItemType } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import SwitchBtn from '../../SwitchBtn/SwitchBtn';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';

interface ValidationTypeProp {
    item: QuestionnaireItem;
}

const ValidationAnswerTypeNumber = ({ item }: ValidationTypeProp): JSX.Element => {
    const { t } = useTranslation();
    const { dispatch } = useContext(TreeContext);
    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const minValue = item?.extension?.find((x) => x.url === IExtentionType.minValue)?.valueInteger;
    const maxValue = item?.extension?.find((x) => x.url === IExtentionType.maxValue)?.valueInteger;
    const maxDecimalPlaces = item?.extension?.find((x) => x.url === IExtentionType.maxDecimalPlaces)?.valueInteger;
    const isDecimal = item?.type === IQuestionnaireItemType.decimal || item?.type === IQuestionnaireItemType.quantity;

    const dispatchUpdateItemType = (value: IQuestionnaireItemType.decimal | IQuestionnaireItemType.integer) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.type, value));
    };

    const changeItemType = () => {
        const newItemType =
            item?.type === IQuestionnaireItemType.decimal
                ? IQuestionnaireItemType.integer
                : IQuestionnaireItemType.decimal;

        dispatchUpdateItemType(newItemType);
        if (newItemType === IQuestionnaireItemType.integer) {
            removeItemExtension(item, IExtentionType.maxDecimalPlaces, dispatch);
        }
    };

    return (
        <>
            <div className="horizontal equal">
                {item?.type !== IQuestionnaireItemType.quantity && (
                    <div className="form-field">
                        <SwitchBtn label={t('Allow decimals')} initial value={isDecimal} onChange={changeItemType} />
                    </div>
                )}
                {isDecimal && (
                    <div className="form-field">
                        <label className="#">{t('Max number of decimals')}</label>
                        <input
                            type="number"
                            defaultValue={maxDecimalPlaces}
                            onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                                if (!event.target.value) {
                                    removeItemExtension(item, IExtentionType.maxDecimalPlaces, dispatch);
                                } else {
                                    const extension = {
                                        url: IExtentionType.maxDecimalPlaces,
                                        valueInteger: parseInt(event.target.value),
                                    };
                                    setItemExtension(item, extension, dispatch);
                                }
                            }}
                        />
                    </div>
                )}
            </div>

            <div className="horizontal equal">
                <div className="form-field" id="number">
                    <label className="#">{t('Min value')}</label>
                    <input
                        type="number"
                        defaultValue={minValue}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (!event.target.value) {
                                removeItemExtension(item, IExtentionType.minValue, dispatch);
                            } else {
                                const extension = {
                                    url: IExtentionType.minValue,
                                    valueInteger: parseInt(event.target.value),
                                };
                                setItemExtension(item, extension, dispatch);
                            }
                        }}
                    ></input>
                </div>

                <div className="form-field" id="number">
                    <label className="#">{t('Max value')}</label>
                    <input
                        type="number"
                        defaultValue={maxValue}
                        onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                            if (!event.target.value) {
                                removeItemExtension(item, IExtentionType.maxValue, dispatch);
                            } else {
                                const extension = {
                                    url: IExtentionType.maxValue,
                                    valueInteger: parseInt(event.target.value),
                                };
                                setItemExtension(item, extension, dispatch);
                            }
                        }}
                    ></input>
                </div>
            </div>

            <div className="form-field custom-input-error-message">
                <label className="#">{t('Enter custom error message')}</label>
                <input
                    type="input"
                    defaultValue={validationText}
                    placeholder={t('error message')}
                    onBlur={(event: React.ChangeEvent<HTMLInputElement>) => {
                        if (!event.target.value) {
                            removeItemExtension(item, IExtentionType.validationtext, dispatch);
                        } else {
                            const extension = {
                                url: IExtentionType.validationtext,
                                valueString: event.target.value,
                            };
                            setItemExtension(item, extension, dispatch);
                        }
                    }}
                ></input>
            </div>
        </>
    );
};

export default ValidationAnswerTypeNumber;
