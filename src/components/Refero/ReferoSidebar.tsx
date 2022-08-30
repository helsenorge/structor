import React from 'react';
import { getSidebarElements, generateSectionContent } from '../../locales/referoSidebarResources';
import { Questionnaire } from '../../types/fhir';

type Props = {
    questionnaire: Questionnaire | string;
};

const ReferoSidebar = ({ questionnaire }: Props) => {
    const [isSidebarViewEnabled, setIsSidebarViewEnabled] = React.useState(false);
    const sidebarData = getSidebarElements(questionnaire ? questionnaire : '');

    return (
        <div
            style={{
                position: 'fixed',
                top: '70px',
                bottom: 0,
                right: 0,
                padding: 8,
                backgroundColor: '#fff',
                zIndex: 90,
                transition: 'transform .5s ease,-webkit-transform .5s ease',
                width: '27.5rem',
                borderLeft: '2px #AAA solid',
                transform: isSidebarViewEnabled ? 'translateX(0)' : 'translateX(100%)',
            }}
        >
            <button className="referoSidebar-button" onClick={() => setIsSidebarViewEnabled(!isSidebarViewEnabled)}>
                ?
            </button>
            {isSidebarViewEnabled && (
                <div className="referoSidebar-content">
                    {generateSectionContent('Alternativer for utfylling', sidebarData['SOT-1'])}
                    {generateSectionContent('Veiledning og ansvarlig', sidebarData['SOT-2'])}
                    {generateSectionContent('Behandling hos mottaker', sidebarData['SOT-3'])}
                </div>
            )}
        </div>
    );
};

export default ReferoSidebar;
