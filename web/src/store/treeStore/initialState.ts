import createUUID from "../../helpers/CreateUUID";
import { INITIAL_LANGUAGE } from "../../helpers/LanguageHelper";
import { getTjenesteomraadeCoding, tjenesteomraadeCode } from "../../helpers/MetadataHelper";
import { VisibilityType, createVisibilityCoding } from "../../helpers/globalVisibilityHelper";
import { initPredefinedValueSet } from "../../helpers/initPredefinedValueSet";
import { IExtensionType } from "../../types/IQuestionnareItemType";
import { TreeState } from "./treeStore";


const initialState: TreeState = {
    isDirty: false,
    qItems: {},
    qOrder: [],
    qMetadata: {
        title: '',
        description: '',
        resourceType: 'Questionnaire',
        language: INITIAL_LANGUAGE.code,
        name: '',
        status: 'draft',
        publisher: 'NHN',
        meta: {
            profile: ['http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire'],
            tag: [
                {
                    system: 'urn:ietf:bcp:47',
                    code: INITIAL_LANGUAGE.code,
                    display: INITIAL_LANGUAGE.display,
                },
            ],
            security: [getTjenesteomraadeCoding(tjenesteomraadeCode.helsehjelp)],
        },
        useContext: [],
        contact: [
            {
                name: 'http://www.nhn.no',
            },
        ],
        subjectType: ['Patient'],
        extension: [
            {
                url: 'http://helsenorge.no/fhir/StructureDefinition/sdf-sidebar',
                valueCoding: { system: 'http://helsenorge.no/fhir/ValueSet/sdf-sidebar', code: '1' },
            },
            {
                url: 'http://helsenorge.no/fhir/StructureDefinition/sdf-information-message',
                valueCoding: { system: 'http://helsenorge.no/fhir/ValueSet/sdf-information-message', code: '1' },
            },
            {
                url: IExtensionType.globalVisibility,
                valueCodeableConcept: {
                    coding: [
                        createVisibilityCoding(VisibilityType.hideHelp),
                        createVisibilityCoding(VisibilityType.hideSublabel),
                    ],
                },
            },
        ],
    },
    qContained: initPredefinedValueSet,
    qCurrentItem: undefined,
    qAdditionalLanguages: {},
};


export const getInitialState = (): TreeState => {
    // Autocreates a random questionnaire id for the user which will be the default value
    if (initialState.qMetadata.id === undefined || initialState.qMetadata.id === '') {
        initialState.qMetadata.id = createUUID();
    }
    return initialState;
};