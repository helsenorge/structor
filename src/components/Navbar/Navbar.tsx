import React, { useContext, useRef, useState } from 'react';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import Btn from '../Btn/Btn';
import MoreIcon from '../../images/icons/ellipsis-horizontal-outline.svg';
import useOutsideClick from '../../hooks/useOutsideClick';
import './Navbar.css';
import PublishModal from '../PublishModal/PublishModal';
import JSONView from '../JSONView/JSONView';
import PredefinedValueSetModal from '../PredefinedValueSetModal/PredefinedValueSetModal';
import ImportValueSet from '../ImportValueSet/ImportValueSet';

type Props = {
    newQuestionnaire: () => void;
    showFormFiller: () => void;
    uploadQuestionnaire: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

enum MenuItem {
    none = 'none',
    file = 'file',
    more = 'more',
}

const Navbar = ({ newQuestionnaire, showFormFiller, uploadQuestionnaire }: Props): JSX.Element => {
    const { state } = useContext(TreeContext);
    const [selectedMenuItem, setSelectedMenuItem] = useState(MenuItem.none);
    const [showContained, setShowContained] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showJSONView, setShowJSONView] = useState(false);
    const [showPublish, setShowPublish] = useState(false);
    const navBarRef = useRef<HTMLHeadingElement>(null);

    useOutsideClick(navBarRef, () => {
        hideMenu();
    });

    const hideMenu = () => {
        setSelectedMenuItem(MenuItem.none);
    };

    const callbackAndHide = (callback: () => void) => {
        callback();
        hideMenu();
    };

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

    const handleMenuItemClick = (clickedItem: MenuItem) => {
        if (selectedMenuItem !== clickedItem) {
            setSelectedMenuItem(clickedItem);
        } else {
            hideMenu();
        }
    };

    return (
        <>
            <header ref={navBarRef}>
                <div>
                    <Btn title="Skjema" onClick={() => handleMenuItemClick(MenuItem.file)} />
                    {selectedMenuItem === MenuItem.file && (
                        <div className="menu file">
                            <Btn title="Nytt skjema" onClick={() => callbackAndHide(newQuestionnaire)} />
                            <label className="regular-btn upload-btn">
                                <input
                                    type="file"
                                    style={{ display: 'none' }}
                                    onChange={(event) => {
                                        uploadQuestionnaire(event);
                                        hideMenu();
                                    }}
                                    accept="application/JSON"
                                />
                                Last opp skjema
                            </label>
                        </div>
                    )}
                </div>

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
                        onClick={() => handleMenuItemClick(MenuItem.more)}
                        onKeyPress={(e) => e.code === 'Enter' && handleMenuItemClick(MenuItem.more)}
                    >
                        <img className="more-menu-icon" src={MoreIcon} alt="more icon" height={25} />
                    </div>
                </div>
                {selectedMenuItem === MenuItem.more && (
                    <div className="menu">
                        <Btn title="JSON" onClick={() => callbackAndHide(() => setShowJSONView(!showJSONView))} />
                        <Btn title="Publiser" onClick={() => callbackAndHide(() => setShowPublish(!showPublish))} />
                        <Btn
                            title="Importer valg"
                            onClick={() => callbackAndHide(() => setShowImportValueSet(!showImportValueSet))}
                        />
                        <Btn title="Valg" onClick={() => callbackAndHide(() => setShowContained(!showContained))} />
                    </div>
                )}
            </header>
            {showContained && <PredefinedValueSetModal close={() => setShowContained(!showContained)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {showJSONView && <JSONView showJSONView={() => setShowJSONView(!showJSONView)} />}
            {showPublish && <PublishModal close={() => setShowPublish(!showPublish)} />}
        </>
    );
};

export default Navbar;
