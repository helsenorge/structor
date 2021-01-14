import React, { useContext, useState } from 'react';
import { TreeContext } from '../../../store/treeStore/treeStore';
import { ValueSetComposeIncludeConcept } from '../../../types/fhir';
import FormField from '../../FormField/FormField';
import RadioBtn from '../../RadioBtn/RadioBtn';
import Select from '../../Select/Select';

const PredefinedValueSet = (): JSX.Element => {
    const [value, setValue] = useState('');
    const { state } = useContext(TreeContext);
    const { qContained } = state;

    const getContainedValueSetValues = (valueSetId: string): Array<{ system?: string; display?: string }> => {
        console.log(qContained, 'valuesets');
        const valueSet = qContained?.find((x) => x.id === valueSetId);
        if (valueSet && valueSet.compose && valueSet.compose.include && valueSet.compose.include[0].concept) {
            return valueSet.compose.include[0].concept.map((x) => {
                return { system: valueSet.compose?.include[0].system, display: x.display };
            });
        }
        return [];
    };

    const containedValueSets = qContained?.map((valueSet) => {
        return {
            code: valueSet.id,
            display: valueSet.title,
        } as ValueSetComposeIncludeConcept;
    });

    return (
        <div>
            <FormField label="Velg spørsmål">
                <Select
                    value={value}
                    options={containedValueSets || []}
                    onChange={(event) => {
                        const id = event.target.value;
                        setValue(id);
                        // todo add referance to item.
                        console.log(id, 'selected');
                    }}
                    placeholder="Velg et alternativ.."
                />
            </FormField>
            <FormField label="Svarene kan ikke redigeres">
                {getContainedValueSetValues(value).map((x, index) => {
                    return <RadioBtn name={x.system} key={index} disabled showDelete={false} value={x.display} />;
                })}
            </FormField>
        </div>
    );
};

export default PredefinedValueSet;
