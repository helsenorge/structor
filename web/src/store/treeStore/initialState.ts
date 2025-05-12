import { IExtensionType } from "../../types/IQuestionnareItemType";

import { TreeState } from "./treeStore";
import createUUID from "../../helpers/CreateUUID";
import {
  VisibilityType,
  createVisibilityCoding,
} from "../../helpers/globalVisibilityHelper";
import { initPredefinedValueSet } from "../../helpers/initPredefinedValueSet";
import { INITIAL_LANGUAGE } from "../../helpers/LanguageHelper";
import {
  getTjenesteomraadeCoding,
  tjenesteomraadeCode,
} from "../../helpers/MetadataHelper";

const initialState: TreeState = {
  isEdited: false,
  isDirty: false,
  qItems: {},
  qOrder: [],
  qMetadata: {
    title: "",
    description: "",
    resourceType: "Questionnaire",
    language: INITIAL_LANGUAGE.code,
    name: "",
    status: "draft",
    publisher: "NHN",
    meta: {
      profile: ["http://ehelse.no/fhir/StructureDefinition/sdf-Questionnaire"],
      tag: [
        {
          system: "urn:ietf:bcp:47",
          code: INITIAL_LANGUAGE.code,
          display: INITIAL_LANGUAGE.display,
        },
      ],
      security: [getTjenesteomraadeCoding(tjenesteomraadeCode.helsehjelp)],
    },
    useContext: [],
    contact: [
      {
        name: "http://www.nhn.no",
      },
    ],
    subjectType: ["Patient"],
    extension: [
      {
        url: "http://helsenorge.no/fhir/StructureDefinition/sdf-sidebar",
        valueCoding: {
          system: "http://helsenorge.no/fhir/ValueSet/sdf-sidebar",
          code: "1",
        },
      },
      {
        url: "http://helsenorge.no/fhir/StructureDefinition/sdf-information-message",
        valueCoding: {
          system: "http://helsenorge.no/fhir/ValueSet/sdf-information-message",
          code: "1",
        },
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

export const getInitialState = (resetState: boolean = false): TreeState => {
  // Autocreates a random questionnaire id for the user which will be the default value
  if (!initialState.qMetadata.id) {
    initialState.qMetadata.id = createUUID();
  }
  if (!initialState.qMetadata.url) {
    initialState.qMetadata.url = `Questionnaire/${initialState.qMetadata.id}`;
  }

  if (resetState) {
    const id = createUUID();
    return {
      ...initialState,
      qMetadata: {
        ...initialState.qMetadata,
        id: id,
        url: `Questionnaire/${id}`,
      },
    };
  }
  return initialState;
};

export const getMinimalInitialState = (): TreeState => {
  return {
    isEdited: getInitialState().isEdited,
    isDirty: getInitialState().isDirty,
    qItems: getInitialState().qItems,
    qOrder: getInitialState().qOrder,
    qMetadata: getInitialState().qMetadata,
  };
};
