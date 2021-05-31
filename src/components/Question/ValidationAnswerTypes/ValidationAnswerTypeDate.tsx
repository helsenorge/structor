import React, { useContext } from 'react';
import { QuestionnaireItem, Extension } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Picker from '../../DatePicker/DatePicker';
import { IExtentionType } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { format, parse } from 'date-fns';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeDate = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const minDate = item?.extension?.find((x) => x.url === IExtentionType.minValue)?.valueDate;
    const maxDate = item?.extension?.find((x) => x.url === IExtentionType.maxValue)?.valueDate;

    return (
        <>
            <FormField label="Legg til egendefinert feilmelding:">
                <input
                    defaultValue={validationText}
                    onBlur={(event) => {
                        if (event.target.value) {
                            const newExtention: Extension = {
                                url: IExtentionType.validationtext,
                                valueString: event.target.value,
                            };
                            setItemExtension(item, newExtention, dispatch);
                        } else {
                            removeItemExtension(item, IExtentionType.validationtext, dispatch);
                        }
                    }}
                />
            </FormField>
            <div className="horizontal">
                <FormField label="Min dato:">
                    <Picker
                        selected={minDate ? parse(minDate, 'yyyy-MM-dd', new Date()) : undefined}
                        type="date"
                        disabled={false}
                        withPortal
                        callback={(date) => {
                            if (date) {
                                const newExtention: Extension = {
                                    url: IExtentionType.minValue,
                                    valueDate: format(date, 'yyyy-MM-dd'),
                                };
                                setItemExtension(item, newExtention, dispatch);
                            } else {
                                removeItemExtension(item, IExtentionType.minValue, dispatch);
                            }
                        }}
                    />
                </FormField>
                <FormField label="Max dato:">
                    <Picker
                        selected={maxDate ? parse(maxDate, 'yyyy-MM-dd', new Date()) : undefined}
                        type="date"
                        disabled={false}
                        withPortal
                        callback={(date) => {
                            if (date) {
                                const newExtention: Extension = {
                                    url: IExtentionType.maxValue,
                                    valueDate: format(date, 'yyyy-MM-dd'),
                                };
                                setItemExtension(item, newExtention, dispatch);
                            } else {
                                removeItemExtension(item, IExtentionType.maxValue, dispatch);
                            }
                        }}
                    />
                </FormField>
            </div>
        </>
    );
};

export default ValidationAnswerTypeDate;
