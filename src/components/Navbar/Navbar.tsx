import React, { useContext, useRef, useState } from 'react';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import Btn from '../Btn/Btn';
import MoreIcon from '../../images/icons/ellipsis-horizontal-outline.svg';
import useOutsideClick from '../../hooks/useOutsideClick';
import './Navbar.css';
import JSONView from '../JSONView/JSONView';
import PredefinedValueSetModal from '../PredefinedValueSetModal/PredefinedValueSetModal';
import ImportValueSet from '../ImportValueSet/ImportValueSet';
import { saveAction } from '../../store/treeStore/treeActions';
import { validateOrphanedElements, ValidationErrors } from '../../helpers/orphanValidation';
import { ValidationErrorsModal } from '../ValidationErrorsModal/validationErrorsModal';
import { useTranslation } from 'react-i18next';

type Props = {
    showFormFiller: () => void;
    setValidationErrors: (errors: ValidationErrors[]) => void;
    validationErrors: ValidationErrors[];
};

enum MenuItem {
    none = 'none',
    file = 'file',
    more = 'more',
}

const Navbar = ({ showFormFiller, setValidationErrors, validationErrors }: Props): JSX.Element => {
    const { i18n, t } = useTranslation();
    const { state, dispatch } = useContext(TreeContext);
    const [selectedMenuItem, setSelectedMenuItem] = useState(MenuItem.none);
    const [showContained, setShowContained] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showJSONView, setShowJSONView] = useState(false);
    const [showValidationErrors, setShowValidationErrors] = useState<boolean>(false);
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

    const cachedProfile = sessionStorage.getItem('profile');
    const profile = cachedProfile ? JSON.parse(cachedProfile) : null;

    function getProfileName(): string {
        return `${profile.given_name} ${profile.family_name}`;
    }

    return (
        <>
            <header ref={navBarRef}>
                <div className="form-title">
                    <h1>{getFileName()}</h1>
                </div>

                <div className="pull-right">
                    {profile && profile.name && (
                        <p
                            className="truncate profile-name"
                            title={t('You are logged in as {0}').replace('{0}', profile.name)}
                        >
                            {getProfileName()}
                        </p>
                    )}
                    <Btn title={t('Preview')} onClick={showFormFiller} />
                    <Btn title={t('Save')} onClick={() => exportToJsonAndDownload()} />
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
                        <Btn
                            title={t('Validate')}
                            onClick={() => {
                                setValidationErrors(
                                    validateOrphanedElements(t, state.qOrder, state.qItems, state.qContained || []),
                                );
                                setShowValidationErrors(true);
                            }}
                        />
                        <Btn title={t('JSON')} onClick={() => callbackAndHide(() => setShowJSONView(!showJSONView))} />
                        <Btn
                            title={t('Import choices')}
                            onClick={() => callbackAndHide(() => setShowImportValueSet(!showImportValueSet))}
                        />
                        <Btn
                            title={t('Choices')}
                            onClick={() => callbackAndHide(() => setShowContained(!showContained))}
                        />
                        {i18n.language !== 'nb-NO' ? (
                            <Btn
                                title={t('Change to norwegian')}
                                onClick={() =>
                                    callbackAndHide(() => {
                                        i18n.changeLanguage('nb-NO');
                                        localStorage.setItem('editor_language', 'nb-NO');
                                    })
                                }
                            />
                        ) : (
                            <div></div>
                        )}
                        {i18n.language !== 'en-US' ? (
                            <Btn
                                title={t('Change to English')}
                                onClick={() =>
                                    callbackAndHide(() => {
                                        i18n.changeLanguage('en-US');
                                        localStorage.setItem('editor_language', 'en-US');
                                    })
                                }
                            />
                        ) : (
                            <div></div>
                        )}
                        {i18n.language !== 'fr-FR' ? (
                            <Btn
                                title={t('Change to French')}
                                onClick={() =>
                                    callbackAndHide(() => {
                                        i18n.changeLanguage('fr-FR');
                                        localStorage.setItem('editor_language', 'fr-FR');
                                    })
                                }
                            />
                        ) : (
                            <div></div>
                        )}
                    </div>
                )}
            </header>
            {showValidationErrors && (
                <ValidationErrorsModal
                    validationErrors={validationErrors}
                    onClose={() => setShowValidationErrors(false)}
                />
            )}
            {showContained && <PredefinedValueSetModal close={() => setShowContained(!showContained)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {showJSONView && <JSONView showJSONView={() => setShowJSONView(!showJSONView)} />}
        </>
    );
};

export default Navbar;
