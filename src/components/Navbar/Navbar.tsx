import React, { useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import Btn from '../Btn/Btn';
import MoreIcon from '../../images/icons/ellipsis-horizontal-outline.svg';
import useOutsideClick from '../../hooks/useOutsideClick';
import './Navbar.css';

type Props = {
    newQuestionnaire: () => void;
    showAdmin: () => void;
    showFormFiller: () => void;
    showJSONView: () => void;
    showImportValueSet: () => void;
    showContained: () => void;
    uploadQuestionnaire: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

enum MenuItem {
    none = 'none',
    file = 'file',
    more = 'more',
}

type EndSessionPayload = {
    url: string;
};

const Navbar = ({
    newQuestionnaire,
    showAdmin,
    showFormFiller,
    showJSONView,
    showImportValueSet,
    showContained,
    uploadQuestionnaire,
}: Props): JSX.Element => {
    const { state } = useContext(TreeContext);
    const history = useHistory();
    const [selectedMenuItem, setSelectedMenuItem] = useState(MenuItem.none);
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

    function handleLogin() {
        history.push('/login');
    }

    async function endSession() {
        try {
            const response = await fetch('.netlify/functions/end-session');
            const payload = (await response.json()) as EndSessionPayload;
            location.href = payload.url;
            sessionStorage.clear();
        } catch (err) {
            console.error('Error!', err);
        }
    }

    async function handleEndSession() {
        endSession();
    }

    const cachedProfile = sessionStorage.getItem('profile');
    const profile = cachedProfile ? JSON.parse(cachedProfile) : null;

    return (
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
                {profile && <p title={`Du er logget inn som ${profile.name}`}>{profile.name}</p>}
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
                    <Btn title="JSON" onClick={() => callbackAndHide(showJSONView)} />
                    <Btn title="Publiser" onClick={() => callbackAndHide(showAdmin)} />
                    <Btn title="Importer valg" onClick={() => callbackAndHide(showImportValueSet)} />
                    <Btn title="Valg" onClick={() => callbackAndHide(showContained)} />
                    {!profile && <Btn title="Logg inn" onClick={handleLogin} />}
                    {profile && <Btn title="Logg ut" onClick={handleEndSession} />}
                </div>
            )}
        </header>
    );
};

export default Navbar;
