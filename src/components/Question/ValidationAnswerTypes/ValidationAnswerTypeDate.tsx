import React, { useContext } from 'react';
import { QuestionnaireItem, Extension } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import Picker from '../../DatePicker/DatePicker';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { IItemProperty, IExtentionType } from '../../../types/IQuestionnareItemType';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { format, parse } from 'date-fns';

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeDate = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const dispatchExtentionUpdate = (extention: Extension) => {
        const newExtention = new Array<Extension>();

        if (item.extension === undefined || item.extension.length === 0) {
            newExtention.push(extention);
        }

        if (item.extension && item.extension.length > 0) {
            item.extension.forEach((x) => {
                if (x.url !== extention.url) {
                    newExtention.push(x);
                }
            });
            newExtention.push(extention);
        }

        dispatch(updateItemAction(item.linkId, IItemProperty.extension, newExtention));
    };

    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const minDate = item?.extension?.find((x) => x.url === IExtentionType.minValue)?.valueDate;
    const maxDate = item?.extension?.find((x) => x.url === IExtentionType.maxValue)?.valueDate;

    return (
        <>
            <FormField label="Legg til egendefinert feilmelding:">
                <input
                    defaultValue={validationText}
                    onChange={(event) => {
                        const newExtention: Extension = {
                            url: IExtentionType.validationtext,
                            valueString: event.target.value,
                        };

                        dispatchExtentionUpdate(newExtention);
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
                            const newExtention: Extension = {
                                url: IExtentionType.minValue,
                                valueDate: format(date, 'yyyy-MM-dd'),
                            };

                            dispatchExtentionUpdate(newExtention);
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
                            const newExtention: Extension = {
                                url: IExtentionType.maxValue,
                                valueDate: format(date, 'yyyy-MM-dd'),
                            };
                            dispatchExtentionUpdate(newExtention);
                        }}
                    />
                </FormField>
            </div>
        </>
    );
};

export default ValidationAnswerTypeDate;
