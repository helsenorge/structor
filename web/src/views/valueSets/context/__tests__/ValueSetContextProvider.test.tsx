import React, { useContext } from "react";
import { describe, it, expect, beforeEach, vi, Mock } from "vitest";
import { ValueSet, ValueSetComposeIncludeConcept } from "fhir/r4";
import { ValueSetProvider } from "../ValueSetContextProvider";
import { ValueSetContext } from "../ValuseSetContext";
import * as initialValueSets from "../../utils/intialValuesets";
// We import the modules we are going to mock
import createUUID from "src/helpers/CreateUUID";
import { createUriUUID } from "src/helpers/uriHelper";
import { predefinedValueSetUri } from "src/types/IQuestionnareItemType";
import { render, waitFor } from "src/tests/testUtils";

// Vitest's vi.mock hoists these calls, so they apply to all imports in the file
vi.mock("src/helpers/CreateUUID");
vi.mock("src/helpers/uriHelper");

// We can now cast the imported functions to mocks for type-safety and intellisense
const createUUIDMock = createUUID as Mock;
const createUriUUIDMock = createUriUUID as Mock;

// A simple consumer component to access context values in our tests
let contextValue: any;
const TestConsumer = () => {
  contextValue = useContext(ValueSetContext);
  return (
    <div>
      {/* Display a value to ensure re-renders are captured */}
      <span>{contextValue?.newValueSet?.name}</span>
    </div>
  );
};

// Helper to create a sample ValueSet for testing handleEdit
const createSampleValueSet = (name: string): ValueSet => ({
  resourceType: "ValueSet",
  id: "vs-1",
  name,
  status: "active",
  compose: {
    include: [
      {
        system: "http://loinc.org",
        concept: [
          { code: "123", display: "Test Concept 1" },
          { code: "456", display: "Test Concept 2" },
        ],
      },
    ],
  },
});

describe("ValueSetProvider", () => {
  let uuidCounter: number;
  const initialVS = initialValueSets.initValueSet();

  beforeEach(() => {
    // Reset mocks and counters before each test to ensure isolation
    vi.clearAllMocks();
    uuidCounter = 1;
    createUUIDMock.mockImplementation(() => `mock-uuid-${uuidCounter++}`);
    createUriUUIDMock.mockImplementation(
      () => `urn:uuid:mock-uri-uuid-${uuidCounter++}`,
    );

    // Spy on initValueSet to know what the initial state should be.
    // We do a deep copy to avoid mutation issues between tests.
    vi.spyOn(initialValueSets, "initValueSet").mockReturnValue(
      JSON.parse(JSON.stringify(initialVS)),
    );
  });

  it("should provide the initial ValueSet from initValueSet on render", async () => {
    render(<TestConsumer />, { initialValueSet: initialVS });

    // expect(initialValueSets.initValueSet).toHaveBeenCalledTimes(1);
    expect(contextValue.newValueSet).toEqual(initialVS);
  });

  it("should reset the ValueSet to a new initial state when reset is called", async () => {
    render(<TestConsumer />, { initialValueSet: initialVS });

    const modifiedVs = createSampleValueSet("Modified Name");

    await waitFor(async () => {
      contextValue.handleEdit(modifiedVs);
    });

    expect(contextValue.newValueSet.name).toBe("Modified Name");
    expect(contextValue.newValueSet).not.toEqual(initialVS);

    // 2. Reset the state
    await waitFor(async () => {
      contextValue.reset();
    });

    // expect(initialValueSets.initValueSet).toHaveBeenCalledTimes(2); // Called once on initial render, once on reset
    expect(contextValue.newValueSet).toEqual(initialVS);
  });

  it("should correctly determine if a value set can be edited via canEdit", async () => {
    render(
      <ValueSetProvider>
        <TestConsumer />
      </ValueSetProvider>,
    );

    expect(contextValue.canEdit("some-other-uri")).toBe(true);
    expect(contextValue.canEdit(undefined)).toBe(true);
    expect(contextValue.canEdit(predefinedValueSetUri)).toBe(false);
  });

  it("should update the value set when handleEdit is called", async () => {
    render(
      <ValueSetProvider>
        <TestConsumer />
      </ValueSetProvider>,
    );
    const newVs = createSampleValueSet("A Whole New ValueSet");

    await waitFor(async () => {
      contextValue.handleEdit(newVs);
    });

    expect(contextValue.newValueSet).toEqual(newVs);
    expect(contextValue.newValueSet).not.toBe(newVs);
  });

  describe("copyComposeIncludeConcept", async () => {
    const conceptToCopy: ValueSetComposeIncludeConcept = {
      id: "concept-to-copy-id",
      code: "C1",
      display: "Concept One",
      extension: [
        {
          id: "ext-1",
          url: "http://example.com/ext1",
          valueCoding: { system: "urn:uuid:old-uri-1", code: "vc1" },
        },
        {
          id: "ext-2",
          url: "http://example.com/ext2",
          valueReference: { id: "ref-1", reference: "Questionnaire/q1" },
        },
      ],
    };

    const initialTestState: ValueSet = {
      ...initialValueSets.initValueSet(),
      compose: {
        include: [
          {
            ...initialValueSets.initialComposeInclude(),
            concept: [conceptToCopy],
          },
        ],
      },
    };

    beforeEach(() => {
      // We set up a specific state for these tests by re-mocking the return value
      vi.spyOn(initialValueSets, "initValueSet").mockReturnValue(
        JSON.parse(JSON.stringify(initialTestState)),
      );
    });

    it("should do nothing if the concept id is not found", async () => {
      render(
        <ValueSetProvider>
          <TestConsumer />
        </ValueSetProvider>,
      );

      const originalState = JSON.parse(
        JSON.stringify(contextValue.newValueSet),
      );

      await waitFor(async () => {
        contextValue.copyComposeIncludeConcept("non-existent-id", 0);
      });

      expect(contextValue.newValueSet).toEqual(originalState);
      expect(contextValue.newValueSet.compose.include[0].concept.length).toBe(
        1,
      );
    });

    it("should copy a concept and add it to the list with new UUIDs", async () => {
      render(
        <ValueSetProvider>
          <TestConsumer />
        </ValueSetProvider>,
      );

      await waitFor(async () => {
        contextValue.copyComposeIncludeConcept("concept-to-copy-id", 0);
      });

      const concepts = contextValue.newValueSet.compose.include[0].concept;
      expect(concepts.length).toBe(2);

      const originalConcept = concepts[0];
      const copiedConcept = concepts[1];

      // Check that the core data is the same
      expect(copiedConcept.code).toBe(originalConcept.code);
      expect(copiedConcept.display).toBe(originalConcept.display);

      // Check that IDs and specific system URIs have been replaced with new mock UUIDs
      expect(copiedConcept.id).toBe("mock-uuid-1");
      expect(copiedConcept.id).not.toBe(originalConcept.id);

      // Check extensions
      expect(copiedConcept.extension.length).toBe(2);

      // Extension 1 (valueCoding)
      expect(copiedConcept.extension[0].id).toBe("mock-uuid-3");
      expect(copiedConcept.extension[0].id).not.toBe(
        originalConcept.extension[0].id,
      );
      expect(copiedConcept.extension[0].valueCoding.system).toBe(
        "urn:uuid:mock-uri-uuid-2",
      );
      expect(copiedConcept.extension[0].valueCoding.system).not.toBe(
        originalConcept.extension[0].valueCoding.system,
      );

      // Extension 2 (valueReference)
      expect(copiedConcept.extension[1].id).toBe("mock-uuid-5");
      expect(copiedConcept.extension[1].id).not.toBe(
        originalConcept.extension[1].id,
      );
      expect(copiedConcept.extension[1].valueReference.id).toBe("mock-uuid-4");
      expect(copiedConcept.extension[1].valueReference.id).not.toBe(
        originalConcept.extension[1].valueReference.id,
      );
      expect(copiedConcept.extension[1].valueReference.reference).toBe(
        originalConcept.extension[1].valueReference.reference,
      ); // Reference string should be preserved
    });
  });
});
