
import AdvancedQuestionOptions from "../AdvancedQuestionOptions";
import { Extension, QuestionnaireItem } from 'fhir/r4';
import { render, screen } from '@testing-library/react';
import { vi } from "vitest";
import { IExtensionType, ItemExtractionContext } from "../../../types/IQuestionnareItemType";

describe('validationUtils', () => {
    const item: QuestionnaireItem = {
        linkId: '123',
        type: 'choice',
    };

    describe('AdvancedQuestionOptions', () => {
        it('ItemExtraction and Definition componenets exists', () => {
            render(<AdvancedQuestionOptions
                item={item}
                parentArray={[]}
                conditionalArray={[]}
                getItem={vi.fn()}
            />);

            expect(screen.queryAllByAltText('Definition')).toBeTruthy();
            expect(screen.queryAllByAltText('Item Extraction')).toBeTruthy();
        });

        it('ItemExtraction default is <Not set>', () => {
            render(<AdvancedQuestionOptions
                item={item}
                parentArray={[]}
                conditionalArray={[]}
                getItem={vi.fn()}
            />);

            expect(screen.getByTestId('radioBtn-Not set')).toHaveProperty("checked");
        });

        it('Item has Observation extesion', () => {            
            const observationItem: QuestionnaireItem = {
                linkId: '123',
                type: 'choice',
                extension: [{url: IExtensionType.itemExtractionContext, valueUri: ItemExtractionContext.observation }] as Extension[],
            };

            render(<AdvancedQuestionOptions
                item={observationItem}
                parentArray={[]}
                conditionalArray={[]}
                getItem={vi.fn()}
            />);

            expect(screen.getByTestId('radioBtn-Observation')).toHaveProperty("checked");
        });

        // it('Click Item Extraction ServiceRequest', () => {         
        //     const newItem: QuestionnaireItem = {
        //         linkId: '123',
        //         type: 'choice',
        //     };

        //     render(<AdvancedQuestionOptions
        //         item={newItem}
        //         parentArray={[]}
        //         conditionalArray={[]}
        //         getItem={vi.fn()}
        //     />);

        //     screen.getByTestId('radioBtn-ServiceRequest').onclick;
        //     expect(item.extension?.find((ex) => ex.url === IExtensionType.itemExtractionContext)?.valueUri).toBe(ItemExtractionContext.serviceRequest);
        // });
    });
});