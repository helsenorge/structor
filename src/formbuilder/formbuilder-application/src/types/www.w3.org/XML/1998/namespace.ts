/* tslint:disable */
import * as Primitive from '../../../xml-primitives';

// Source files:
// http://hl7.org/fhir/xml.xsd

interface BaseType {
    _exists: boolean;
    _namespace: string;
}
type LangType = string;
type _LangType = Primitive._string;

export type SpaceType = 'default' | 'preserve';
interface _SpaceType extends Primitive._string {
    content: SpaceType;
}

export type document = BaseType;
export var document: document;
