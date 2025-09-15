import React, { useCallback, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TreeContext } from '../store/treeStore/treeStore';
import { ValidationErrors } from '../helpers/orphanValidation';

import AnchorMenu from '../components/AnchorMenu/AnchorMenu';
import FormDetailsDrawer from '../components/Drawer/FormDetailsDrawer/FormDetailsDrawer';
import IconBtn from '../components/IconBtn/IconBtn';
import Navbar from '../components/Navbar/Navbar';
import QuestionDrawer from '../components/QuestionDrawer/QuestionDrawer';
import TranslationModal from '../components/Languages/Translation/TranslationModal';
import FormFillerPreview from '../components/Refero/FormFillerPreview';

import './FormBuilder.css';
import DeleteConfirmation from '../components/MultiSelect/DeleteConfirmation';
import { deleteItemAction } from '../store/treeStore/treeActions';
import { Node } from '../store/treeStore/treeActions';

const FormBuilder = (): JSX.Element => {
    const { state, dispatch } = useContext(TreeContext);
    const { t } = useTranslation();
    const [showFormDetails, setShowFormDetails] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Array<ValidationErrors>>([]);
    const [translationErrors, setTranslationErrors] = useState<Array<ValidationErrors>>([]);
    const [translateLang, setTranslateLang] = useState('');

    const [selectedNodes, setSelectedNodes] = React.useState<{ node: Node; path: Array<string> }[]>([]);
    const [isDeleteConfirmationModalVisible, setIsDeleteConfirmationModalVisible] = useState(false);

    const toggleFormDetails = useCallback(() => {
        setShowFormDetails(!showFormDetails);
    }, [showFormDetails]);

    const treePathToOrderArray = (treePath: string[]): string[] => {
        const newPath = [...treePath];
        newPath.splice(-1);
        return newPath;
    };

    const isParentSelected = (path: string[]): boolean => {
        for (const pathString of path) {
            // Check if any of the selectedNodes have a title that matches the pathString
            if (selectedNodes.some((selectedNode) => selectedNode.node.title === pathString)) {
                return false;
            }
        }
        return true;
    };

    const handleOnMultipleDelete = () => {
        selectedNodes.map((item) => {
            const isDeletable = isParentSelected(item.path.slice(-2, -1));

            if (!isDeletable) {
                return;
            }

            dispatch(deleteItemAction(item.node.title, treePathToOrderArray(item.path)));
        });
        setSelectedNodes([]);
        setIsDeleteConfirmationModalVisible(false);
    };

    return (
        <>
            <Navbar
                showFormFiller={() => setShowPreview(!showPreview)}
                validationErrors={validationErrors}
                setValidationErrors={setValidationErrors}
                translationErrors={translationErrors}
                setTranslationErrors={setTranslationErrors}
            />
            {selectedNodes.length > 0 && (
                <div className={`header-wrapper ${true ? '' : 'd-none'}`}>
                    <div className="title">
                        <i className="cross-icon" onClick={() => setSelectedNodes([])} />
                        <span className="items-selected">{selectedNodes.length} selected</span>
                    </div>
                    <div className="delete-multiple p-2" onClick={() => setIsDeleteConfirmationModalVisible(true)}>
                        <i className="delete-icon" />
                        Delete
                    </div>
                </div>
            )}
            <div className="editor">
                <AnchorMenu
                    dispatch={dispatch}
                    qOrder={state.qOrder}
                    qItems={state.qItems}
                    qCurrentItem={state.qCurrentItem}
                    validationErrors={validationErrors}
                    selectedNodes={selectedNodes}
                    setSelectedNodes={setSelectedNodes}
                />
                {showPreview && (
                    <FormFillerPreview
                        showFormFiller={() => setShowPreview(!showPreview)}
                        language={state.qMetadata.language}
                        state={state}
                    />
                )}
                {translateLang && (
                    <TranslationModal close={() => setTranslateLang('')} targetLanguage={translateLang} />
                )}
            </div>
            <div className="page-wrapper">
                <div className="details-button">
                    <IconBtn
                        type="info"
                        title={t('Questionnaire details')}
                        color="black"
                        onClick={toggleFormDetails}
                        size="large"
                    />
                </div>
                <FormDetailsDrawer
                    setTranslateLang={(language: string) => {
                        setTranslateLang(language);
                        toggleFormDetails();
                    }}
                    closeDrawer={toggleFormDetails}
                    isOpen={showFormDetails}
                />
                <QuestionDrawer validationErrors={validationErrors} />
                <DeleteConfirmation
                    isVisible={isDeleteConfirmationModalVisible}
                    setIsDeleteConfirmationModalVisible={setIsDeleteConfirmationModalVisible}
                    handleOnMultipleDelete={handleOnMultipleDelete}
                />
            </div>
        </>
    );
};

export default FormBuilder;
