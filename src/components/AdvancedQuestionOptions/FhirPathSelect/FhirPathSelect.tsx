import React, { useContext, useEffect, useState } from 'react';
import { TreeContext } from '../../../store/treeStore/treeStore';
import GroupedSelect from '../../Select/GroupedSelect';
import { EnrichmentSet } from '../../../helpers/QuestionHelper';
import FormField from '../../FormField/FormField';
import { IExtentionType, IItemProperty } from '../../../types/IQuestionnareItemType';
import { QuestionnaireItem } from '../../../types/fhir';
import { updateItemAction } from '../../../store/treeStore/treeActions';
import { removeItemExtension, setItemExtension } from '../../../helpers/extensionHelper';
import { isOptionGroup, Option, OptionGroup } from '../../../types/OptionTypes';

type FhirPathSelectProps = {
    item: QuestionnaireItem;
};

enum FhirPathOptionEnum {
    NONE = 'NONE',
    CUSTOM = 'CUSTOM',
}

const FhirPathSelect = (props: FhirPathSelectProps): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const [isBlankButCustom, setIsBlankButCustom] = useState(false);
    const [predefinedOptionIds, setPredifinedOptionIds] = useState<Array<string>>([]);

    useEffect(() => {
        const flattened = EnrichmentSet.options.flatMap((element) => {
            if (isOptionGroup(element)) {
                return (element as OptionGroup).options.map((childElement) => childElement.code);
            }
            return (element as Option).code;
        });
        setPredifinedOptionIds(flattened);
    }, []);

    const dispatchUpdateItem = (name: IItemProperty, value: boolean) => {
        dispatch(updateItemAction(props.item.linkId, name, value));
    };

    const dispatchRemoveFhirPath = () => {
        removeItemExtension(props.item, IExtentionType.fhirPath, dispatch);
    };

    const dispatchUpdateFhirPath = (value: string) => {
        const extension = {
            url: IExtentionType.fhirPath,
            valueString: value,
        };
        setItemExtension(props.item, extension, dispatch);
    };

    const handleSelect = (selectedValue: string) => {
        if (selectedValue === FhirPathOptionEnum.NONE) {
            setIsBlankButCustom(false);
            dispatchRemoveFhirPath();
            dispatchUpdateItem(IItemProperty.readOnly, false);
        } else if (selectedValue === FhirPathOptionEnum.CUSTOM) {
            setIsBlankButCustom(true);
            dispatchUpdateItem(IItemProperty.readOnly, true);
        } else {
            setIsBlankButCustom(false);
            dispatchUpdateFhirPath(selectedValue);
            dispatchUpdateItem(IItemProperty.readOnly, true);
        }
    };

    const isCustomFhirPath = (value: string): boolean => {
        if (value === '') {
            return false;
        }

        return !predefinedOptionIds.includes(value);
    };

    const getSelectValue = (): string => {
        if (isCustom || isBlankButCustom) {
            return FhirPathOptionEnum.CUSTOM;
        } else if (!fhirPath) {
            return FhirPathOptionEnum.NONE;
        }
        return fhirPath;
    };

    const fhirPath = props.item.extension?.find((x) => x.url === IExtentionType.fhirPath)?.valueString ?? '';
    const isCustom = isCustomFhirPath(fhirPath);

    return (
        <FormField label="Beriking">
            <GroupedSelect
                value={getSelectValue()}
                options={[
                    { display: 'Ingen beriking', code: FhirPathOptionEnum.NONE },
                    ...EnrichmentSet.options,
                    { display: 'Egendefinert', code: FhirPathOptionEnum.CUSTOM },
                ]}
                onChange={(event) => {
                    handleSelect(event.target.value);
                }}
                displaySelectedValue={!!fhirPath && !isCustom && !isBlankButCustom}
            />
            {(isCustom || isBlankButCustom) && (
                <textarea
                    defaultValue={fhirPath}
                    placeholder="Legg inn egendefinert beriking"
                    onBlur={(e) => {
                        if (e.target.value) {
                            setIsBlankButCustom(false);
                            dispatchUpdateFhirPath(e.target.value);
                        }
                    }}
                />
            )}
        </FormField>
    );
};

export default FhirPathSelect;
