import questionnaire from "src/tests/__data__/Validering_av_items_uten_grupper-nb-NO.json";
import { loadQuestionnaireIntoState } from "src/tests/loadQuestionnaire";

import type { QuestionnaireItem } from "fhir/r4";
import type { TFunction } from "i18next";
import type { Items, OrderItem } from "src/store/treeStore/treeStore";


import { ErrorLevel } from "../../validationTypes";
import {
  validateGroupParent,
  validatehasGroupAsParent,
  validateRepeatableGroup,
} from "../groupValidation";


describe("group validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  describe("repeatable group", () => {
    it("Should get error if repeatable group is child of a group", () => {
      const validationErrors = validateGroupParent(
        translatationMock as unknown as TFunction<"translation">,
        repeatableGroup,
        qItems,
        qOrder,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Repeatable group must be child of a group",
      ]);
    });
    it("Should get error if repeatable group has step coding", () => {
      const validationErrors = validateRepeatableGroup(
        translatationMock as unknown as TFunction<"translation">,
        repeatableGroupWithStepCoding,
      );

      expect(validationErrors.length).toBe(1);
      expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
      expect(translatationMock.mock.calls[0]).toEqual([
        "Repeatable group cannot be displayed as a step in stepview",
      ]);
    });
  });
});

//Constants for repeatable group without a parent group
const repeatableGroup: QuestionnaireItem = {
  linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
  type: "group",
  text: "Repeatable group",
  code: [],
  item: [],
  required: false,
  repeats: true,
};
const qItems: Items = {
  "4d86e6d0-51c8-477e-a74e-8e0a4d253fce": {
    linkId: "4d86e6d0-51c8-477e-a74e-8e0a4d253fce",
    type: "group",
    text: "group",
    extension: [],
    code: [],
    item: [],
    required: false,
  },
  "a8e762a7-5754-4056-900b-6c1196d73175": repeatableGroup,
};
const qOrder: OrderItem[] = [
  {
    linkId: "4d86e6d0-51c8-477e-a74e-8e0a4d253fce",
    items: [],
  },
  {
    linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
    items: [],
  },
];

//Constants for repeatale group with step coding
const repeatableGroupWithStepCoding: QuestionnaireItem = {
  linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
  type: "group",
  text: "Repeatable group with step coding",
  extension: [
    {
      url: "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
      valueCodeableConcept: {
        coding: [
          {
            system: "http://hl7.org/fhir/ValueSet/questionnaire-item-control",
            code: "step",
          },
        ],
      },
    },
  ],
  required: false,
  repeats: true,
};

describe("validatehasGroupAsParent - full questionnaire flow", () => {
  const tMock = vi.fn(
    (key: string) => key,
  ) as unknown as TFunction<"translation">;
  const state = loadQuestionnaireIntoState(questionnaire);
  const { qItems: stateItems, qOrder: stateOrder } = state;

  beforeEach(() => {
    vi.mocked(tMock).mockClear();
  });

  describe("items that should have warnings (no group ancestor)", () => {
    it("root string item without group parent", () => {
      const item = stateItems["a01e2056-ffce-4f18-88f0-7f92f132ff29"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
      expect(errors[0].linkId).toBe("a01e2056-ffce-4f18-88f0-7f92f132ff29");
    });

    it("root string item with children but no group parent", () => {
      const item = stateItems["a87be74f-fc84-404e-9251-306e455fa509"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("group that is child of a non-group item (nested under string)", () => {
      const item = stateItems["dd8700a1-6082-4c98-8de0-ef18db99d3dc"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("root display item without group parent", () => {
      const item = stateItems["1"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("root string item with deeply nested children but no group parent", () => {
      const item = stateItems["8a05207d-3d81-4c20-edf5-f6aee679a5aa"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("string nested under string (no group in ancestor chain)", () => {
      const item = stateItems["79b9b699-32db-4d51-855b-c50fee029e25"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("deeply nested string with no group ancestor", () => {
      const item = stateItems["8abd822b-257c-4123-ecdd-c03c505ac19d"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("choice item nested under display (no group ancestor)", () => {
      const item = stateItems["1.1"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });

    it("group nested under choice which is under display (no group ancestor)", () => {
      const item = stateItems["b8365346-c765-47f6-8574-26c03f8a6711"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(1);
      expect(errors[0].errorLevel).toBe(ErrorLevel.warning);
    });
  });

  describe("items that should have no errors (have group ancestor or are root groups)", () => {
    it("root group item (Gruppe 1)", () => {
      const item = stateItems["1b52300d-0e20-4597-8680-7c0f6f16f7d9"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("root group item (gruppe paa topp)", () => {
      const item = stateItems["406277c5-ab3f-4132-9252-1b6f82c300ba"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("string item that is direct child of a group", () => {
      const item = stateItems["5a03c435-05c4-4388-8aae-602775d2c456"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("string item nested under group (further nested under non-group ancestors)", () => {
      const item = stateItems["6a4319a3-bcac-43e0-8a8b-dbf4b63705aa"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("deeply nested string with group in ancestor chain", () => {
      const item = stateItems["34711f0d-4988-4a36-9d2e-ad120aa147ba"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("item nested 3 levels deep with group as ancestor", () => {
      const item = stateItems["9ade6ba3-a8f8-413a-8eb0-06f862c065c3"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("boolean nested inside group (deep chain: display > choice > group > boolean)", () => {
      const item = stateItems["1.1-1"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });

    it("group nested inside boolean inside group (has group ancestor)", () => {
      const item = stateItems["1.1-1.1"];
      const errors = validatehasGroupAsParent(
        tMock,
        item,
        stateItems,
        stateOrder,
      );

      expect(errors).toHaveLength(0);
    });
  });
});
