import { Coding } from '../types/fhir';
import { ICodeSystem } from '../types/IQuestionnareItemType';
import { ScoringFormulaCodes, ScoringFormulaNames } from '../types/scoringFormulas';

export const getSelectedScoringCode = (code: Coding[]): string => {
    let codeToReturn = '0';
    code.forEach((x) => {
        if (x.code && (x.system === ICodeSystem.scoringFormulas || (x.code && x.system === ICodeSystem.score))) {
            codeToReturn = x.code.toString();
        }
    });
    return codeToReturn;
};

export const getScoringFormulaName = (scoringCode: string): string => {
    if (scoringCode === ScoringFormulaCodes.sectionScore) {
        return ScoringFormulaNames.sectionScore;
    } else {
        return ScoringFormulaNames.totalScore;
    }
};
