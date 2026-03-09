import { describe, it, expect } from "vitest";

import {
  IQuestionnaireItemType,
  IExtensionType,
} from "../../types/IQuestionnareItemType";

import { TOOLBOX_ITEM_DEFINITIONS } from "../../components/AnchorMenu/Toolbox/toolboxItems";
import {
  isItemControlReceiverComponent,
  isRecipientList,
  ItemControlType,
} from "../itemControl";
import { getInitialItemConfig } from "../questionTypeFeatures";

describe("getInitialItemConfig", () => {
  describe("receiverComponent (mottakerkomponent)", () => {
    it("should create an item with receiver-component itemControl extension", () => {
      const item = getInitialItemConfig(
        IQuestionnaireItemType.receiverComponent,
        "Mottakerkomponent",
      );

      expect(item.type).toBe("choice");
      expect(item.text).toBe("Mottakerkomponent");
      expect(item.required).toBe(true);
      expect(item.answerValueSet).toBe(
        "http://helsenorge.no/fhir/ValueSet/adresser",
      );
      expect(isItemControlReceiverComponent(item)).toBe(true);
    });

    it("should create an item with TQQC code", () => {
      const item = getInitialItemConfig(
        IQuestionnaireItemType.receiverComponent,
        "Mottakerkomponent",
      );

      expect(item.code).toBeDefined();
      expect(
        item.code?.some(
          (c) => c.system === "http://ehelse.no/fhir/ValueSet/TQQC",
        ),
      ).toBe(true);
    });

    it("should NOT fall through to default group type", () => {
      const item = getInitialItemConfig(
        IQuestionnaireItemType.receiverComponent,
        "Mottakerkomponent",
      );

      expect(item.type).not.toBe("group");
    });
  });

  describe("receiver (mottakerliste)", () => {
    it("should create an item with choice type and TQQC code", () => {
      const item = getInitialItemConfig(IQuestionnaireItemType.receiver, "");

      expect(item.type).toBe("choice");
      expect(item.code).toBeDefined();
      expect(
        item.code?.some(
          (c) => c.system === "http://ehelse.no/fhir/ValueSet/TQQC",
        ),
      ).toBe(true);
    });

    it("should be detected as recipientList and NOT as receiverComponent", () => {
      const item = getInitialItemConfig(IQuestionnaireItemType.receiver, "");

      expect(isRecipientList(item)).toBe(true);
      expect(isItemControlReceiverComponent(item)).toBe(false);
    });

    it("should NOT fall through to default group type", () => {
      const item = getInitialItemConfig(IQuestionnaireItemType.receiver, "");

      expect(item.type).not.toBe("group");
    });
  });
});

describe("TOOLBOX_ITEM_DEFINITIONS", () => {
  it("receiver type should match IQuestionnaireItemType.receiver enum value", () => {
    const receiverDef = TOOLBOX_ITEM_DEFINITIONS.find(
      (d) => d.labelKey === "Recipient list",
    );

    expect(receiverDef).toBeDefined();

    expect(receiverDef!.type).toBe(IQuestionnaireItemType.receiver);

    expect(receiverDef!.type).toBe("receiver");
  });

  it("receiverComponent type should match IQuestionnaireItemType.receiverComponent enum value", () => {
    const receiverComponentDef = TOOLBOX_ITEM_DEFINITIONS.find(
      (d) => d.labelKey === "Recipient component",
    );

    expect(receiverComponentDef).toBeDefined();

    expect(receiverComponentDef!.type).toBe(
      IQuestionnaireItemType.receiverComponent,
    );
    // This is the critical check: the value must be "receiver-component", not "receiverComponent"

    expect(receiverComponentDef!.type).toBe("receiver-component");
  });

  it("all toolbox types should produce valid items via getInitialItemConfig", () => {
    for (const def of TOOLBOX_ITEM_DEFINITIONS) {
      const item = getInitialItemConfig(
        def.type as IQuestionnaireItemType,
        "Test label",
      );

      // No toolbox item should produce a default group unless it IS a group
      if (def.type !== "group") {
        expect(item.type).not.toBe("group");
      }
    }
  });
});

describe("getInitialItemConfig for all toolbox item types", () => {
  TOOLBOX_ITEM_DEFINITIONS.forEach((def) => {
    if (
      def.type === IQuestionnaireItemType.receiverComponent ||
      def.type === IQuestionnaireItemType.receiver
    ) {
      // Already covered by dedicated tests above
      return;
    }
    it(`should create correct item for type '${def.type}'`, () => {
      // @ts-expect-error - Type is dynamic based on def.type
      const item = getInitialItemConfig(def.type, "Test label");
      // For group, display, string, etc. check type
      // @ts-expect-error - Type is dynamic based on def.type
      expect(item.type).toBe(def.type === "inline" ? "text" : def.type);
      // For text property, check label for group/display/string/text
      if (
        [
          IQuestionnaireItemType.group,
          IQuestionnaireItemType.display,
          IQuestionnaireItemType.string,
          IQuestionnaireItemType.text,
        ].includes(def.type as IQuestionnaireItemType)
      ) {
        expect(typeof item.text).toBe("string");
      }
      // For choice/openChoice, check answerOption
      if (
        [
          IQuestionnaireItemType.choice,
          IQuestionnaireItemType.openChoice,
        ].includes(def.type as IQuestionnaireItemType)
      ) {
        expect(Array.isArray(item.answerOption)).toBe(true);
        expect(item.answerOption?.length).toBeGreaterThan(0);
      }
      // For attachment, check extension
      if (def.type === IQuestionnaireItemType.attachment) {
        expect(Array.isArray(item.extension)).toBe(true);
        expect(
          item.extension?.some((ext) => ext.url === IExtensionType.maxSize),
        ).toBe(true);
      }
      // For inline, check extension and item
      // Note: 'inline' is not a FHIR item type, but an itemControl extension. This test checks that getInitialItemConfig for 'inline' produces a text item with itemControl extension and a child display item.
      // @ts-expect-error - Type is dynamic based on def.type
      if (def.type === IQuestionnaireItemType.inline) {
        expect(Array.isArray(item.extension)).toBe(true);
        expect(item.extension?.some((ext) => ext.url === "itemControl")).toBe(
          true,
        );
        expect(Array.isArray(item.item)).toBe(true);
        expect(item.item?.length).toBeGreaterThan(0);
      }
    });
  });
});

describe("ItemControlType and IQuestionnaireItemType consistency", () => {
  it("ItemControlType.receiverComponent should equal 'receiver-component'", () => {
    expect(ItemControlType.receiverComponent).toBe("receiver-component");
  });

  it("IQuestionnaireItemType.receiverComponent should equal 'receiver-component'", () => {
    expect(IQuestionnaireItemType.receiverComponent).toBe("receiver-component");
  });

  it("IQuestionnaireItemType.receiver should equal 'receiver'", () => {
    expect(IQuestionnaireItemType.receiver).toBe("receiver");
  });
});
