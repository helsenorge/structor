import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import Btn from '../Btn/Btn';
import IconBtn from '../IconBtn/IconBtn';
import MoreIcon from '../../images/icons/ellipsis-horizontal-outline.svg';
import './Navbar.css';

type Props = {
    showAdmin: () => void;
    showFormFiller: () => void;
    showJSONView: () => void;
    showImportValueSet: () => void;
    showContained: () => void;
};

const Navbar = ({ showAdmin, showFormFiller, showJSONView, showImportValueSet, showContained }: Props): JSX.Element => {
    const { state } = useContext(TreeContext);
    const [menuIsVisible, setMenuIsVisible] = useState(false);

    const getFileName = (): string => {
        const technicalName = state.qMetadata.name || 'skjema';
        const version = state.qMetadata.version ? `-v${state.qMetadata.version}` : '';
        if (state.qAdditionalLanguages && Object.values(state.qAdditionalLanguages).length < 1) {
            return `${technicalName}-${state.qMetadata.language}${version}.json`;
        }
        return `${technicalName}${version}.json`;
    };

    function exportToJsonAndDownload() {
        const questionnaire = generateQuestionnaire(state);
        const filename = getFileName();
        const contentType = 'application/json;charset=utf-8;';

        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            const blob = new Blob([decodeURIComponent(encodeURI(questionnaire))], {
                type: contentType,
            });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            const a = document.createElement('a');
            a.download = filename;
            a.href = 'data:' + contentType + ',' + encodeURIComponent(questionnaire);
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        const currentClass = (event.target as Element).className;
        if (menuIsVisible && currentClass.indexOf('more-menu') < 0) {
            setTimeout(() => setMenuIsVisible(false), 200);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    });

    return (
        <header>
            <Link to="/">
                <IconBtn type="back" title="Tilbake" />
            </Link>

            <div className="left"></div>

            <div className="pull-right">
                <Btn title="Forhåndsvisning" onClick={showFormFiller} />
                <Btn title="Lagre" onClick={() => exportToJsonAndDownload()} />
                <div
                    className="more-menu"
                    tabIndex={0}
                    role="button"
                    aria-label="menu list"
                    aria-pressed="false"
                    onClick={() => setMenuIsVisible(!menuIsVisible)}
                    onKeyPress={(e) => e.code === 'Enter' && setMenuIsVisible(!menuIsVisible)}
                >
                    <img className="more-menu-icon" src={MoreIcon} alt="more icon" height={25} />
                </div>
            </div>
            {menuIsVisible && (
                <div className="menu">
                    <Btn title="JSON" onClick={showJSONView} />
                    <Btn title="Publiser" onClick={showAdmin} />
                    <Btn title="Importer valg" onClick={showImportValueSet} />
                    <Btn title="Valg" onClick={showContained} />
                </div>
            )}
        </header>
    );
};

export default Navbar;
