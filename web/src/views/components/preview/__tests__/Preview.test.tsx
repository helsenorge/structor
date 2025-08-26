// Preview.test.tsx
import React from "react";
import "@testing-library/jest-dom";
import { render, screen, userEvent } from "src/tests/testUtils";
import { FhirResource } from "fhir/r4";
import { Preview } from "../Preview";

// ---- hook mock
const downloadSpy = vi.fn();
vi.mock("src/hooks/useDownloadFile", () => ({
  useDownloadFile: () => ({ download: downloadSpy }),
}));

// ---- helpers
const vs = (id: string, name: string): FhirResource =>
  ({ resourceType: "ValueSet", id, name }) as unknown as FhirResource;

const cs = (id: string, name: string): FhirResource =>
  ({ resourceType: "CodeSystem", id, name }) as unknown as FhirResource;

const patient = (id: string): FhirResource =>
  ({ resourceType: "Patient", id }) as unknown as FhirResource;

// ---- tests
describe("<Preview />", () => {
  beforeEach(() => {
    downloadSpy.mockClear();
  });

  it("renderer headline: ValueSet/CodeSystem bruker name", () => {
    render(
      <Preview
        fhirResource={vs("vs-1", "MyVS")}
        resourceType="ValueSet"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 4, name: /valueset.*myvs/i }),
    ).toBeInTheDocument();
  });

  it("renderer headline: andre typer bruker id", () => {
    render(
      <Preview
        fhirResource={patient("pat-1")}
        resourceType="Patient"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
      />,
    );
    expect(
      screen.getByRole("heading", { level: 4, name: /patient.*pat-1/i }),
    ).toBeInTheDocument();
  });

  it("forwards showHeadline til RawJson (true -> viser 'Raw JSON') og viser JSON uten toggle-knapp", () => {
    const resource = cs("cs-1", "Codes");
    render(
      <Preview
        fhirResource={resource}
        resourceType="CodeSystem"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
        showHeadline={true}
      />,
    );

    // RawJson skal vise overskrift
    expect(
      screen.getByRole("heading", { level: 3, name: /raw json/i }),
    ).toBeInTheDocument();

    // Ingen toggle-knapp fordi showButton=false i Preview
    expect(
      screen.queryByRole("button", { name: /show raw json/i }),
    ).not.toBeInTheDocument();

    // JSON er rendret i <pre>, sjekk på innhold
    expect(
      screen.getByText(/"resourceType": "CodeSystem"/),
    ).toBeInTheDocument();
    expect(screen.getByText(/"id": "cs-1"/)).toBeInTheDocument();
  });

  it("showHeadline=false -> RawJson overskrift skjules, men JSON rendres fortsatt", () => {
    const resource = vs("vs-1", "MyVS");
    render(
      <Preview
        fhirResource={resource}
        resourceType="ValueSet"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
        showHeadline={false}
      />,
    );

    expect(
      screen.queryByRole("heading", { level: 3, name: /raw json/i }),
    ).not.toBeInTheDocument();
    expect(screen.getByText(/"resourceType": "ValueSet"/)).toBeInTheDocument();
    expect(screen.getByText(/"name": "MyVS"/)).toBeInTheDocument();
  });

  it("viser Edit-knapp kun når canEdit=true og kaller handleEdit + scrollToTarget", async () => {
    const onEdit = vi.fn();
    const scroll = vi.fn();

    render(
      <Preview
        fhirResource={vs("vs-1", "MyVS")}
        resourceType="ValueSet"
        handleEdit={onEdit}
        canEdit
        scrollToTarget={scroll}
        deleteResource={vi.fn()}
      />,
    );

    const editBtn = screen.getByRole("button", { name: /edit resource/i });
    await userEvent.click(editBtn);

    expect(onEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: "vs-1", resourceType: "ValueSet" }),
    );
    expect(scroll).toHaveBeenCalledTimes(1);
  });

  it("canEdit=false -> ingen Edit-knapp", () => {
    render(
      <Preview
        fhirResource={vs("vs-1", "MyVS")}
        resourceType="ValueSet"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole("button", { name: /edit resource/i }),
    ).not.toBeInTheDocument();
  });

  it("default: viser Download og bruker name for VS/CS i filnavn", async () => {
    const resource = vs("vs-1", "MyVS");
    render(
      <Preview
        fhirResource={resource}
        resourceType="ValueSet"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /download resource/i }),
    );
    expect(downloadSpy).toHaveBeenCalledWith(
      JSON.stringify(resource),
      "MyVS.json",
    );
  });

  it("non VS/CS: bruker id i filnavn ved nedlasting", async () => {
    const res = patient("pat-1");
    render(
      <Preview
        fhirResource={res}
        resourceType="Patient"
        handleEdit={vi.fn()}
        canEdit={false}
        deleteResource={vi.fn()}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /download resource/i }),
    );
    expect(downloadSpy).toHaveBeenCalledWith(JSON.stringify(res), "pat-1.json");
  });

  it("canDownload=false -> ingen Download-knapp", () => {
    render(
      <Preview
        fhirResource={vs("vs-1", "MyVS")}
        resourceType="ValueSet"
        handleEdit={vi.fn()}
        canEdit={false}
        canDownload={false}
        deleteResource={vi.fn()}
      />,
    );
    expect(
      screen.queryByRole("button", { name: /download resource/i }),
    ).not.toBeInTheDocument();
  });

  it("canDelete=true -> Delete-knapp kaller deleteResource", async () => {
    const onDelete = vi.fn();
    render(
      <Preview
        fhirResource={vs("vs-1", "MyVS")}
        resourceType="ValueSet"
        handleEdit={vi.fn()}
        canEdit={false}
        canDelete
        deleteResource={onDelete}
      />,
    );

    await userEvent.click(
      screen.getByRole("button", { name: /delete resource/i }),
    );
    expect(onDelete).toHaveBeenCalledWith(
      expect.objectContaining({ id: "vs-1" }),
    );
  });
});
