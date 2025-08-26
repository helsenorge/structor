// ResourcesToImport.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { FhirResource } from "fhir/r4";
import ResourcesToImport from "../ResourcesToImport";
import { render, screen, userEvent } from "src/tests/testUtils";

// ---- CSS module mocks used by Preview and RawJson
vi.mock("../preview/preview-fhir-resource.module.scss", () => ({
  default: {
    existingFhirResourceHeader: "existingFhirResourceHeader",
    deleteButton: "deleteButton",
  },
}));

vi.mock("../raw-json.module.scss", () => ({
  default: {
    rawJsonContainer: "rawJsonContainer",
    jsonContainerWrapper: "jsonContainerWrapper",
    jsonContainer: "jsonContainer",
    rawJsonButton: "rawJsonButton",
  },
}));

// ---- hook mock used by Preview
const downloadSpy = vi.fn();
vi.mock("src/hooks/useDownloadFile", () => ({
  useDownloadFile: () => ({ download: downloadSpy }),
}));

describe("<ResourcesToImport />", () => {
  const makeResource = (
    type: FhirResource["resourceType"],
    id: string | undefined,
    name?: string,
  ): FhirResource =>
    ({ resourceType: type, id, ...(name ? { name } : {}) }) as FhirResource;

  it("shows 'Import resource' button when resource not already in state and calls handler on click", async () => {
    const resource = makeResource("ValueSet", "vs-1", "MyVS");
    const handleAdd = vi.fn();

    render(
      <ResourcesToImport
        fhirResource={resource}
        stateFhirResource={[]}
        handleAddNewResource={handleAdd}
        resourceType="ValueSet"
      />,
    );

    const btn = screen.getByTestId("import-resource-button");
    expect(btn).toBeInTheDocument();

    await userEvent.click(btn);
    expect(handleAdd).toHaveBeenCalledTimes(1);
    expect(handleAdd).toHaveBeenCalledWith("vs-1");

    // Preview integration: Download visible, Edit/Delete hidden (per props)
    expect(
      screen.getByRole("button", { name: /download resource/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit resource/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete resource/i }),
    ).not.toBeInTheDocument();

    // Headline from Preview should be rendered and include type + name
    expect(
      screen.getByRole("heading", { level: 4, name: /valueset.*myvs/i }),
    ).toBeInTheDocument();
  });

  it("shows 'Already imported' when resource exists in state", () => {
    const resource = makeResource("ValueSet", "vs-1", "MyVS");

    render(
      <ResourcesToImport
        fhirResource={resource}
        stateFhirResource={[resource]}
        handleAddNewResource={vi.fn()}
        resourceType="ValueSet"
      />,
    );

    expect(screen.getByTestId("already-imported")).toBeInTheDocument();
    expect(
      screen.queryByTestId("import-resource-button"),
    ).not.toBeInTheDocument();

    // Preview still renders
    expect(
      screen.getByRole("button", { name: /download resource/i }),
    ).toBeInTheDocument();
  });

  it("renders Preview correctly for CodeSystem (uses name in headline) and default flags", () => {
    const resource = makeResource("CodeSystem", "cs-42", "Codes");

    render(
      <ResourcesToImport
        fhirResource={resource}
        stateFhirResource={[]}
        handleAddNewResource={vi.fn()}
        resourceType="CodeSystem"
      />,
    );

    // Headline: "CodeSystem - Codes"
    expect(
      screen.getByRole("heading", { level: 4, name: /codesystem.*codes/i }),
    ).toBeInTheDocument();

    // Read-only controls from Preview defaults
    expect(
      screen.getByRole("button", { name: /download resource/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /edit resource/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /delete resource/i }),
    ).not.toBeInTheDocument();

    // Raw JSON content visible immediately because Preview passes showButton=false to RawJson
    expect(
      screen.getByText(/"resourceType": "CodeSystem"/),
    ).toBeInTheDocument();
    expect(screen.getByText(/"id": "cs-42"/)).toBeInTheDocument();
  });

  it("renders no import controls when fhirResource lacks an id", () => {
    const resource = makeResource("ValueSet", undefined, "NoIdVS");

    render(
      <ResourcesToImport
        fhirResource={resource}
        stateFhirResource={[]}
        handleAddNewResource={vi.fn()}
        resourceType="ValueSet"
      />,
    );

    expect(
      screen.queryByTestId("import-resource-button"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/already imported/i)).not.toBeInTheDocument();

    // Preview still shows headline (by name) and JSON
    expect(
      screen.getByRole("heading", { level: 4, name: /valueset.*noidvs/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/"name": "NoIdVS"/)).toBeInTheDocument();
  });

  it("treats undefined stateFhirResource as empty list and does not shows import button if no id", () => {
    const resource = makeResource("ValueSet", "vs-2", "Two");

    render(
      <ResourcesToImport
        fhirResource={resource}
        stateFhirResource={undefined}
        handleAddNewResource={vi.fn()}
        resourceType="ValueSet"
      />,
    );

    expect(
      screen.queryByTestId("import-resource-button"),
    ).not.toBeInTheDocument();
  });
});
