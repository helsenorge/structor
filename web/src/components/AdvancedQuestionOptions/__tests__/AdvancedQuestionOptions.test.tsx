
import AdvancedQuestionOptions from "../AdvancedQuestionOptions";
import { QuestionnaireItem } from 'fhir/r4';
import { render, screen } from '@testing-library/react';

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
                getItem={jest.fn()}
            />)

            expect(screen.getAllByLabelText('Definition')).toBeInTheDocument();
            expect(screen.getAllByLabelText('Item Extraction')).toBeInTheDocument();
        });
    });
});