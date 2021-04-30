import React, { RefObject, useContext, useRef, useState } from 'react';
import { useHistory } from 'react-router-dom';
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
import { saveAction } from '../../store/treeStore/treeActions';
import ConfirmFileUpload from '../FileUpload/ConfirmFileUpload';

type Props = {
    newQuestionnaire: () => void;
    showFormFiller: () => void;
    uploadRef: RefObject<HTMLInputElement>;
};

enum MenuItem {
    none = 'none',
    file = 'file',
    more = 'more',
}

type EndSessionPayload = {
    url: string;
};

const Navbar = ({ newQuestionnaire, showFormFiller, uploadRef }: Props): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const history = useHistory();
    const [selectedMenuItem, setSelectedMenuItem] = useState(MenuItem.none);
    const [showContained, setShowContained] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showJSONView, setShowJSONView] = useState(false);
    const [showPublish, setShowPublish] = useState(false);
    const [confirmUpload, setConfirmUpload] = useState(false);
    const navBarRef = useRef<HTMLDivElement>(null);
    const fileExtension = 'json';

    const hideMenu = () => {
        setSelectedMenuItem(MenuItem.none);
    };

    useOutsideClick(navBarRef, hideMenu, selectedMenuItem === MenuItem.none);

    const callbackAndHide = (callback: () => void) => {
        callback();
        hideMenu();
    };

    const getFileName = (): string => {
        let technicalName = state.qMetadata.name || 'skjema';
        technicalName = technicalName.length > 40 ? technicalName.substring(0, 40) + '...' : technicalName;
        const version = state.qMetadata.version ? `-v${state.qMetadata.version}` : '';
        if (state.qAdditionalLanguages && Object.values(state.qAdditionalLanguages).length < 1) {
            return `${technicalName}-${state.qMetadata.language}${version}`;
        }
        return `${technicalName}${version}`;
    };

    function exportToJsonAndDownload() {
        const questionnaire = generateQuestionnaire(state);
        const filename = `${getFileName()}.${fileExtension}`;
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
        dispatch(saveAction());
    }

    const handleMenuItemClick = (clickedItem: MenuItem) => {
        if (selectedMenuItem !== clickedItem) {
            setSelectedMenuItem(clickedItem);
        } else {
            hideMenu();
        }
    };

    const triggerUpload = () => {
        if (state.isDirty && state.qItems && Object.keys(state.qItems).length > 0) {
            setConfirmUpload(true);
        } else {
            uploadRef.current?.click();
        }
    };

    function handleLogin() {
        history.push('/login');
    }

    async function endSession() {
        try {
            const response = await fetch('.netlify/functions/end-session');
            const payload = (await response.json()) as EndSessionPayload;
            sessionStorage.clear();
            location.href = payload.url;
        } catch (err) {
            console.error('Error!', err);
        }
    }

    const cachedProfile = sessionStorage.getItem('profile');
    const profile = cachedProfile ? JSON.parse(cachedProfile) : null;

    function getProfileName(): string {
        return `${profile.given_name} ${profile.family_name}`;
    }

    return (
        <>
            <header ref={navBarRef}>
                <div>
                    <Btn title="Skjema" onClick={() => handleMenuItemClick(MenuItem.file)} />
                    {selectedMenuItem === MenuItem.file && (
                        <div className="menu file">
                            <Btn title="Nytt skjema" onClick={() => callbackAndHide(newQuestionnaire)} />
                            <Btn title="Last opp skjema" onClick={() => callbackAndHide(triggerUpload)} />
                        </div>
                    )}
                </div>

                <div className="left"></div>

                <div className="form-title" style={{ width: '100%' }}>
                    <h1>{getFileName()}</h1>
                </div>

                <div className="pull-right">
                    {profile && profile.name && (
                        <p className="truncate profile-name" title={`Du er logget inn som ${profile.name}`}>
                            {getProfileName()}
                        </p>
                    )}
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
                        {!profile && <Btn title="Logg inn" onClick={handleLogin} />}
                        {profile && <Btn title="Logg ut" onClick={endSession} />}
                    </div>
                )}
            </header>
            {showContained && <PredefinedValueSetModal close={() => setShowContained(!showContained)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {showJSONView && <JSONView showJSONView={() => setShowJSONView(!showJSONView)} />}
            {showPublish && <PublishModal close={() => setShowPublish(!showPublish)} />}
            {confirmUpload && <ConfirmFileUpload close={() => setConfirmUpload(false)} uploadRef={uploadRef} />}
        </>
    );
};

export default Navbar;
