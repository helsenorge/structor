import React, { useContext } from 'react';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { Extension, QuestionnaireItem } from '../../../types/fhir';
import { IItemProperty, IExtentionType } from '../../../types/IQuestionnareItemType';
import FormField from '../../FormField/FormField';
import Select from '../../Select/Select';

const CUSTOM_REGEX_OPTION = 'CUSTOM';
const regexOptions = [
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
    {
        display: 'Telefonnummer',
        code: '^((\\+|00)(\\d{1,3}))?\\d{5,12}$',
    },
    {
        display: 'Kun norske bokstaver',
        code: '^[æøåÆØÅa-zA-Z ]*$',
    },
    {
        display: 'Kun norske bokstaver + bindestrek og mellomrom (benyttes ved navn)',
        code: '^[æøåÆØÅa-zA-Z\\- ]*$',
    },
    {
        display: 'Kun norske bokstaver med linjeskift',
        code: '^(?:[æøåÆØÅa-zA-Z0-9,.!?@()+\\-\\/*]|[ \r\n\t])*$',
    },
    { display: 'Postnummer', code: '^(000[1-9]|0[1-9][0-9][0-9]|[1-9][0-9][0-9][0-8])$' },
];

type Props = {
    item: QuestionnaireItem;
};

const ValidationAnswerTypeString = ({ item }: Props): JSX.Element => {
    const { dispatch } = useContext(TreeContext);

    const updateMaxLength = (number: number) => {
        dispatch(updateItemAction(item.linkId, IItemProperty.maxLength, number));
    };

    const setRegexExtension = (regexValue: string): void => {
        const newExtention: Extension = {
            url: IExtentionType.regEx,
            valueString: regexValue,
        };
        setItemExtension(item, newExtention, dispatch);
    };

    const validationText = item?.extension?.find((x) => x.url === IExtentionType.validationtext)?.valueString || '';
    const selectedRegEx = item?.extension?.find((x) => x.url === IExtentionType.regEx)?.valueString || '';
    const minLength = item?.extension?.find((x) => x.url === IExtentionType.minLength)?.valueInteger;
    const isSelectedRegexCustomRegex = selectedRegEx ? !regexOptions.find((x) => x.code === selectedRegEx) : false;

    const [isCustomRegex, setIsCustomRegex] = React.useState<boolean>(isSelectedRegexCustomRegex);

    return (
        <>
            <FormField label="Svaret skal være:">
                <Select
                    value={isCustomRegex ? CUSTOM_REGEX_OPTION : selectedRegEx}
                    options={[
                        { display: 'Uten tegn-validering', code: '' },
                        ...regexOptions,
                        { display: 'Egendefinert regulært uttrykk', code: CUSTOM_REGEX_OPTION },
                    ]}
                    onChange={(event) => {
                        if (!event.target.value) {
                            removeItemExtension(item, IExtentionType.regEx, dispatch);
                            setIsCustomRegex(false);
                        } else if (event.target.value === CUSTOM_REGEX_OPTION) {
                            setIsCustomRegex(true);
                            removeItemExtension(item, IExtentionType.regEx, dispatch);
                        } else {
                            setIsCustomRegex(false);
                            setRegexExtension(event.target.value);
                        }
                    }}
                />
                {isCustomRegex && (
                    <textarea
                        defaultValue={selectedRegEx}
                        placeholder="Legg inn egendefinert regulært uttrykk"
                        onBlur={(event) => {
                            if (!event.target.value) {
                                removeItemExtension(item, IExtentionType.regEx, dispatch);
                            } else {
                                setRegexExtension(event.target.value);
                            }
                        }}
                    />
                )}
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
            <div className="horizontal equal">
                <FormField label="Minimum antall tegn">
                    <input
                        defaultValue={minLength}
                        type="number"
                        aria-label="minimum sign"
                        onBlur={(e) => {
                            const newValue = parseInt(e.target.value);
                            if (!newValue) {
                                removeItemExtension(item, IExtentionType.minLength, dispatch);
                            } else {
                                const extension = {
                                    url: IExtentionType.minLength,
                                    valueInteger: newValue,
                                };
                                setItemExtension(item, extension, dispatch);
                            }
                        }}
                    />
                </FormField>
                <FormField label="Maksimum antall tegn">
                    <input
                        defaultValue={item.maxLength || ''}
                        type="number"
                        aria-label="maximum sign"
                        onBlur={(e) => updateMaxLength(parseInt(e.target.value.toString()))}
                    />
                </FormField>
            </div>
        </>
    );
};

export default ValidationAnswerTypeString;
