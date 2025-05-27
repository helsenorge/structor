import { QuestionnaireItem } from "fhir/r4";
import { ErrorLevel } from "../../validationTypes";
import { OrderItem } from "src/store/treeStore/treeStore";
import { validateRepeatableChildren } from "../repeatableValidation";

describe("repeatable validation", () => {
  const translatationMock = vi.fn();
  beforeEach(() => {
    translatationMock.mockClear();
  });

  it("Should get error if repeatable item that is not of type group, has children", () => {
    const validationErrors = validateRepeatableChildren(
      translatationMock,
      repeatableItemWithChildren,
      qOrder,
    );

    expect(validationErrors.length).toBe(1);
    expect(validationErrors[0].errorLevel).toBe(ErrorLevel.error);
    expect(translatationMock.mock.calls[0]).toEqual([
      "Repeatable items that are not of type group cannot have children",
    ]);
  });
});

const repeatableItemWithChildren: QuestionnaireItem = {
  linkId: "865d1663-91ed-4e85-8662-258e4aa54ae0",
  type: "string",
  text: "Item som ikke er gruppe og er repeatable",
  item: [
    {
      linkId: "b1e4a4bb-4951-4f54-a9b8-50734557cdeb",
      type: "string",
      text: "Tekstsvar inni repeterende item som ikke er gruppe",
      required: false,
    },
  ],
  required: false,
  repeats: true,
};

const qOrder: OrderItem[] = [
  {
    linkId: "a8e762a7-5754-4056-900b-6c1196d73175",
    items: [
      {
        linkId: "f5753c13-fd12-464a-8dc5-9cfa33647a2c",
        items: [],
      },
    ],
  },
  {
    linkId: "865d1663-91ed-4e85-8662-258e4aa54ae0",
    items: [
      {
        linkId: "b1e4a4bb-4951-4f54-a9b8-50734557cdeb",
        items: [],
      },
    ],
  },
];
