/* tslint:disable */
// Source files:
//

interface BaseType {
    _exists: boolean;
    _namespace: string;
}
export interface _any extends BaseType {
    content: any;
}

export interface _boolean extends BaseType {
    content: boolean;
}

export interface _Date extends BaseType {
    content: Date;
}

export interface _number extends BaseType {
    content: number;
}

export interface _string extends BaseType {
    content: string;
}

export type document = BaseType;
export var document: document;
