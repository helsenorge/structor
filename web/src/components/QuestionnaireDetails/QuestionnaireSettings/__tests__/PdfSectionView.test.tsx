import { TreeContext, TreeState } from "src/store/treeStore/treeStore";
import {
  IQuestionnaireMetadata,
  IQuestionnaireMetadataType,
} from "src/types/IQuestionnaireMetadataType";
import { ICodeSystem, IExtensionType } from "src/types/IQuestionnareItemType";
import { Coding, Extension } from "fhir/r4";
import { fireEvent, render, screen } from "@testing-library/react";
import PdfSectionView from "../PdfSectionView";
import { updateQuestionnaireMetadataAction } from "src/store/treeStore/treeActions";
import { Mock } from "vitest";
import { VisibilityType } from "src/helpers/globalVisibilityHelper";

describe("PdfSectionView", () => {
  const updateExtensionMock = vi.fn();

  vi.mock("react-i18next", () => ({
    useTranslation: () => {
      return {
        t: (i18nKey: any) => i18nKey,
        i18n: {
          changeLanguage: () => new Promise(() => {}),
        },
      };
    },
    initReactI18next: {
      type: "3rdParty",
      init: () => {},
    },
  }));

  describe("Generate PDF on submit", () => {
    let pdfExtension = {} as Extension;
    beforeEach(() => {
      pdfExtension = {
        url: IExtensionType.generatePDF,
        valueBoolean: true,
      } as Extension;
      updateExtensionMock.mockClear();
    });

    it("Default generate PDF", () => {
      const treeState = {
        qMetadata: {} as IQuestionnaireMetadata,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <PdfSectionView updateExtension={updateExtensionMock} />
        </TreeContext.Provider>,
      );

      const generatePDF = screen.getByTestId("generatePdf");
      expect(generatePDF).toBeChecked();
    });

    it("metadata has Generate PDF on submit", () => {
      const treeState = {
        qMetadata: { extension: [pdfExtension] } as IQuestionnaireMetadata,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <PdfSectionView updateExtension={updateExtensionMock} />
        </TreeContext.Provider>,
      );

      const generatePDF = screen.getByTestId("generatePdf");
      expect(generatePDF).toBeChecked();
    });

    it("User clicks Generate PDF on submit when metadata has no Pdf extension", () => {
      const treeState = {
        qMetadata: {} as IQuestionnaireMetadata,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <PdfSectionView updateExtension={updateExtensionMock} />
        </TreeContext.Provider>,
      );

      const generatePDF = screen.getByTestId("generatePdf");
      fireEvent.click(generatePDF);

      expect(updateExtensionMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          { url: IExtensionType.generatePDF, valueBoolean: false },
        ]),
      );
    });

    it("User selects Generate PDF on submit when metadata has Pdf extension and value is false", () => {
      pdfExtension.valueBoolean = false;
      const treeState = {
        qMetadata: { extension: [pdfExtension] } as IQuestionnaireMetadata,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <PdfSectionView updateExtension={updateExtensionMock} />
        </TreeContext.Provider>,
      );

      const generatePDF = screen.getByTestId("generatePdf");
      fireEvent.click(generatePDF);

      expect(updateExtensionMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          { url: IExtensionType.generatePDF, valueBoolean: true },
        ]),
      );
    });

    it("User removes Generate PDF on submit when metadata has Pdf extension", () => {
      const treeState = {
        qMetadata: { extension: [pdfExtension] } as IQuestionnaireMetadata,
      } as TreeState;

      render(
        <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
          <PdfSectionView updateExtension={updateExtensionMock} />
        </TreeContext.Provider>,
      );

      const generatePDF = screen.getByTestId("generatePdf");
      fireEvent.click(generatePDF);

      expect(updateExtensionMock.mock.calls[0]).toEqual(
        expect.arrayContaining([
          { url: IExtensionType.generatePDF, valueBoolean: false },
        ]),
      );
    });
  });

  describe("Global Visibility", () => {
    vi.mock("src/store/treeStore/treeActions");
    const updateMetadataActionMock = updateQuestionnaireMetadataAction as Mock;
    const hideHelpCoding = {
      code: VisibilityType.hideHelp,
      display: "Hide help texts",
      system: ICodeSystem.attachmentRenderOptions,
    } as Coding;
    const hideSublabelCoding = {
      code: VisibilityType.hideSublabel,
      display: "Hide sublabel texts",
      system: ICodeSystem.attachmentRenderOptions,
    } as Coding;
    const hideSidebarCoding = {
      code: VisibilityType.hideSidebar,
      display: "Hide sidebar texts",
      system: ICodeSystem.attachmentRenderOptions,
    } as Coding;

    beforeEach(() => {
      updateMetadataActionMock.mockClear();
    });

    describe("Hide help texts in PDF", () => {
      const hideHelpTextExtension = {
        url: IExtensionType.globalVisibility,
        valueCodeableConcept: { coding: [hideHelpCoding] },
      };

      it("metadata has no extension", () => {
        const treeState = {
          qMetadata: {} as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-helptext-pdf");
        expect(generatePDF).not.toBeChecked();
      });

      it("metadata has Hide help texts in PDF extension", () => {
        const treeState = {
          qMetadata: {
            extension: [hideHelpTextExtension],
          } as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-helptext-pdf");
        expect(generatePDF).toBeChecked();
      });

      it("User selects Hide help texts in PDF", () => {
        const treeState = {
          qMetadata: {} as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-helptext-pdf");
        fireEvent.click(generatePDF);

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([IQuestionnaireMetadataType.extension]),
        );
        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([
            expect.arrayContaining([
              expect.objectContaining({
                url: IExtensionType.globalVisibility,
              }),
            ]),
          ]),
        );

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([
            expect.arrayContaining([
              expect.objectContaining({
                valueCodeableConcept: {
                  coding: [hideHelpCoding],
                },
              }),
            ]),
          ]),
        );
      });

      it("User removes Hide help texts in PDF", () => {
        const treeState = {
          qMetadata: {
            extension: [hideHelpTextExtension],
          } as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-helptext-pdf");
        fireEvent.click(generatePDF);

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([IQuestionnaireMetadataType.extension]),
        );
        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([expect.arrayContaining([])]),
        );
      });
    });

    describe("Hide sublabels in PDF", () => {
      const hideSublableTextExtension = {
        url: IExtensionType.globalVisibility,
        valueCodeableConcept: { coding: [hideSublabelCoding] },
      };

      it("metadata has no extension", () => {
        const treeState = {
          qMetadata: {} as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sublabel");
        expect(generatePDF).not.toBeChecked();
      });

      it("metadata has Hide sublabels in PDF extension", () => {
        const treeState = {
          qMetadata: {
            extension: [hideSublableTextExtension],
          } as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sublabel");
        expect(generatePDF).toBeChecked();
      });

      it("User selects Hide sublabels in PDF", () => {
        const treeState = {
          qMetadata: {} as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sublabel");
        fireEvent.click(generatePDF);

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([IQuestionnaireMetadataType.extension]),
        );
        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([
            expect.arrayContaining([
              expect.objectContaining({
                url: IExtensionType.globalVisibility,
              }),
            ]),
          ]),
        );

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([
            expect.arrayContaining([
              expect.objectContaining({
                valueCodeableConcept: {
                  coding: [hideSublabelCoding],
                },
              }),
            ]),
          ]),
        );
      });

      it("User removes Hide sublabels in PDF", () => {
        const treeState = {
          qMetadata: {
            extension: [hideSublableTextExtension],
          } as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sublabel");
        fireEvent.click(generatePDF);

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([IQuestionnaireMetadataType.extension]),
        );
        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([expect.arrayContaining([])]),
        );
      });
    });

    describe("Hide sidebar texts in PDF", () => {
      const hideSidebarTextExtension = {
        url: IExtensionType.globalVisibility,
        valueCodeableConcept: { coding: [hideSidebarCoding] },
      };

      it("metadata has no extension", () => {
        const treeState = {
          qMetadata: {} as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sidebar");
        expect(generatePDF).not.toBeChecked();
      });

      it("metadata has Hide sidebar texts in PDF extension", () => {
        const treeState = {
          qMetadata: {
            extension: [hideSidebarTextExtension],
          } as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sidebar");
        expect(generatePDF).toBeChecked();
      });

      it("User selects Hide sidebar texts in PDF", () => {
        const treeState = {
          qMetadata: {} as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sidebar");
        fireEvent.click(generatePDF);

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([IQuestionnaireMetadataType.extension]),
        );
        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([
            expect.arrayContaining([
              expect.objectContaining({
                url: IExtensionType.globalVisibility,
              }),
            ]),
          ]),
        );

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([
            expect.arrayContaining([
              expect.objectContaining({
                valueCodeableConcept: {
                  coding: [hideSidebarCoding],
                },
              }),
            ]),
          ]),
        );
      });

      it("User removes Hide sidebar texts in PDF", () => {
        const treeState = {
          qMetadata: {
            extension: [hideSidebarTextExtension],
          } as IQuestionnaireMetadata,
        } as TreeState;

        render(
          <TreeContext.Provider value={{ state: treeState, dispatch: vi.fn() }}>
            <PdfSectionView updateExtension={vi.fn()} />
          </TreeContext.Provider>,
        );

        const generatePDF = screen.getByTestId("hide-sidebar");
        fireEvent.click(generatePDF);

        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([IQuestionnaireMetadataType.extension]),
        );
        expect(updateMetadataActionMock.mock.calls[0]).toEqual(
          expect.arrayContaining([expect.arrayContaining([])]),
        );
      });
    });
  });
});
