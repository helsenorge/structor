import { useContext } from 'react';
import { importValueSetAction } from '../store/valueSetStore/ValueSetAction';
import { ValueSetContext } from '../store/valueSetStore/ValueSetStore';
import { ValueSet } from '../types/fhir';

export const handleImportValueSet = (contained: ValueSet[]): void => {
    const { dispatch } = useContext(ValueSetContext);
    dispatch(importValueSetAction(contained));
};
