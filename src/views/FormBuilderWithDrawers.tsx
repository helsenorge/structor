import './FormBuilderWithDrawers.css';

import { TreeContext } from '../store/treeStore/treeStore';
import React, { useCallback, useContext, useState } from 'react';
import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import FormFiller from '../components/FormFiller/FormFiller';
import ImportValueSet from '../components/ImportValueSet/ImportValueSet';
import JSONView from '../components/JSONView/JSONView';
import Navbar from '../components/Navbar/Navbar';
import PublishModal from '../components/PublishModal/PublishModal';
import PredefinedValueSetModal from '../components/PredefinedValueSetModal/PredefinedValueSetModal';
import QuestionDrawer from '../components/QuestionDrawer/QuestionDrawer';

const FormBuilderWithDrawers = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const [isIframeVisible, setIsIframeVisible] = useState(false);
    const [isShowingFireStructure, setIsShowingFireStructure] = useState(false);
    const [showImportValueSet, setShowImportValueSet] = useState(false);
    const [showResults, setShowAdminMenu] = useState(false);
    const [showContained, setShowContained] = useState(false);
    const [showFormDetails, setShowFormDetails] = useState(true);

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);

    return (
        <>
            <Navbar
                showAdmin={() => setShowAdminMenu(!showResults)}
                showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)}
                showImportValueSet={() => setShowImportValueSet(!showImportValueSet)}
                showContained={() => setShowContained(!showContained)}
            />

            {showResults && <PublishModal close={() => setShowAdminMenu(!showResults)} />}
            {showImportValueSet && <ImportValueSet close={() => setShowImportValueSet(!showImportValueSet)} />}
            {isShowingFireStructure && (
                <JSONView showJSONView={() => setIsShowingFireStructure(!isShowingFireStructure)} />
            )}
            {showContained && <PredefinedValueSetModal close={() => setShowContained(!showContained)} />}
            {isIframeVisible && (
                <FormFiller
                    showFormFiller={() => setIsIframeVisible(!isIframeVisible)}
                    language={state.qMetadata.language}
                />
            )}

            <div className="editor">
                <div className="anchor-wrapper">
                    <AnchorMenu
                        dispatch={dispatch}
                        qOrder={state.qOrder}
                        qItems={state.qItems}
                        toggleFormDetails={toggleFormDetails}
                        areFormDetailsVisible={showFormDetails}
                    />
                </div>
                <div className="page-wrapper">
                    <QuestionDrawer />
                </div>
            </div>
        </>
    );
};

export default FormBuilderWithDrawers;
