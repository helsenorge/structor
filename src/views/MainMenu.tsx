import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { TreeContext } from '../store/treeStore/treeStore';
import UploadIcon from '../images/icons/cloud-upload.svg';
import { resetQuestionnaireAction } from '../store/treeStore/treeActions';
import { Questionnaire } from '../types/fhir';
import mapToTreeState from '../helpers/FhirToTreeStateMapper';
import './MainMenu.css';

const MainMenu = (): JSX.Element => {
    const { dispatch } = useContext(TreeContext);
    const history = useHistory();

    function onChange(event: React.ChangeEvent<HTMLInputElement>) {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        if (event.target.files && event.target.files[0]) reader.readAsText(event.target.files[0]);
    }

    function onReaderLoad(event: ProgressEvent<FileReader>) {
        if (event.target && event.target.result) {
            const obj = JSON.parse(event.target.result as string);
            reuploadJSONFile(obj);
            history.push('/new-create-form');
        }
    }

    function reuploadJSONFile(questionnaireObj: Questionnaire) {
        const importedState = mapToTreeState(questionnaireObj);
        dispatch(resetQuestionnaireAction(importedState));
    }

    return (
        <div className="main-menu align-everything">
            <div className="align-everything">
                <Link to="/new-create-form">
                    <button className="index-buttons">Nytt skjema</button>
                </Link>
                <label className="index-buttons">
                    <input type="file" style={{ display: 'none' }} onChange={onChange} />
                    <img src={UploadIcon} className="upload-icon" />
                    {'Last opp skjema'}
                </label>
            </div>
        </div>
    );
};

export default MainMenu;
