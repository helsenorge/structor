import React, { useContext } from 'react';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { IItemProperty, IExtentionType } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeString = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const updateMaxLength = (number: number) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.maxLength, number));
    };

    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const selectedRegEx = item?.extension?.find((x) => x.url === IExtentionType.regEx)?.valueString || '';

    return (
        <>
            <FormField label="Svaret skal være:">
                <Select
                    value={selectedRegEx}
                    options={[
                        { display: 'Velg kriterie', code: '' },
                        {
                            display: 'Epost',
                            code:
                                "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
                        },
                        {
                            display: 'URL',
                            code:
                                '^(http[s]?:\\/\\/(www\\.)?|ftp:\\/\\/(www\\.)?|www\\.){1}([0-9A-Za-z-\\.@:%_+~#=]+)+((\\.[a-zA-Z]{2,3})+)(/(.)*)?(\\?(.)*)?',
                        },
                        {
                            display: 'Fødselsnummer',
                            code:
                                '^((((0[1-9]|[12]\\d|3[01])([04][13578]|[15][02]))|((0[1-9]|[12]\\d|30)([04][469]|[15]1))|((0[1-9]|[12]\\d)([04]2)))|((([0-7][1-9]|[12]\\d|3[01])(0[13578]|1[02]))|(([0-7][1-9]|[12]\\d|30)(0[469]|11))|(([0-7][1-9]|[12]\\d)(02))))\\d{7}$',
                        },
                        { display: 'Postnummer', code: '^(000[1-9]|0[1-9][0-9][0-9]|[1-9][0-9][0-9][0-8])$' },
                    ]}
                    onChange={(event) => {
                        if (!event.target.value) {
                            removeItemExtension(item, IExtentionType.regEx, dispatch);
                        } else {
                            const newExtention: Extension = {
                                url: IExtentionType.regEx,
                                valueString: event.target.value,
                            };
                            setItemExtension(item, newExtention, dispatch);
                        }
                    }}
                ></Select>
            </FormField>
            <FormField label="Legg til egendefinert feilmelding:">
                <input
                    defaultValue={validationText}
                    onChange={(event) => {
                        if (!event.target.value) {
                            removeItemExtension(item, IExtentionType.validationtext, dispatch);
                        } else {
                            const newExtention: Extension = {
                                url: IExtentionType.validationtext,
                                valueString: event.target.value,
                            };
                            setItemExtension(item, newExtention, dispatch);
                        }
                    }}
                />
            </FormField>
            <FormField label="Maximum antall tegn">
                <input
                    defaultValue={item.maxLength || ''}
                    type="input"
                    aria-label="maximum sign"
                    onBlur={(e) => updateMaxLength(parseInt(e.target.value.toString()))}
                ></input>
            </FormField>
        </>
    );
};

export default ValidationAnswerTypeString;
