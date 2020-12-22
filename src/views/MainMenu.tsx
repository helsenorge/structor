import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { TreeContext } from '../store/treeStore/treeStore';
import { resetQuestionnaireAction } from '../store/treeStore/treeActions';
import { Questionnaire } from '../types/fhir';
import mapToTreeState from '../helpers/FhirToTreeStateMapper';
import './MainMenu.css';
import Btn from '../components/Btn/Btn';

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
        <>
            <div className="main-header">
                <div className="mainheader-top">
                    <div className="logo">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 405.81 42.43">
                            <title>Logo Norsk helsenett</title>
                            <g id="Layer_2" data-name="Layer 2">
                                <g id="Layer_1-2" data-name="Layer 1">
                                    <path
                                        className="cls-1"
                                        d="M0,11.52H3.67V16.7h.12c1.34-3.61,5.36-6.05,9.6-6.05,8.44,0,11,4.42,11,11.58V41.56H20.72V22.81c0-5.18-1.69-9.08-7.62-9.08S3.78,18.16,3.67,24V41.56H0Z"
                                    ></path>
                                    <path
                                        className="cls-1"
                                        d="M58.19,26.54c0,8.62-5,15.89-14.2,15.89s-14.2-7.27-14.2-15.89,5-15.89,14.2-15.89,14.2,7.27,14.2,15.89m-24.73,0c0,6.4,3.49,12.81,10.53,12.81s10.53-6.4,10.53-12.81S51,13.74,44,13.74s-10.53,6.4-10.53,12.8"
                                    ></path>
                                    <path
                                        className="cls-1"
                                        d="M63.66,11.52H67v7h.11A11.1,11.1,0,0,1,78.5,11.12v3.67c-6.63-.35-11.18,4.54-11.18,10.77v16H63.66Z"
                                    ></path>
                                    <path
                                        className="cls-1"
                                        d="M100,20.31c-.18-4.54-3.67-6.58-7.86-6.58-3.26,0-7.1,1.28-7.1,5.18,0,3.26,3.73,4.42,6.23,5.06l4.89,1.11c4.19.64,8.56,3.08,8.56,8.32,0,6.52-6.46,9-12,9-7,0-11.76-3.26-12.34-10.59H84c.29,4.94,4,7.51,8.85,7.51,3.44,0,8.2-1.51,8.2-5.7,0-3.49-3.26-4.66-6.58-5.47l-4.71-1c-4.78-1.28-8.38-2.91-8.38-8,0-6.11,6-8.44,11.29-8.44,6,0,10.77,3.14,11,9.66Z"
                                    ></path>
                                    <polygon
                                        className="cls-1"
                                        points="109.97 0 113.64 0 113.64 26.07 130.29 11.52 135.18 11.52 122.37 22.64 136.05 41.55 131.45 41.55 119.58 25.2 113.64 30.15 113.64 41.55 109.97 41.55 109.97 0"
                                    ></polygon>
                                    <path
                                        className="cls-2"
                                        d="M140.06,0H150V15.48h.12c1.51-3.08,5.59-5,9.19-5,10.07,0,10.89,7.33,10.89,11.7V41.56h-9.9V26.95c0-4.13.47-8.32-4.95-8.32-3.73,0-5.36,3.14-5.36,6.46V41.56h-9.89Z"
                                    ></path>
                                    <path
                                        className="cls-2"
                                        d="M184.58,28.87c.17,4.13,2.56,6.87,6.75,6.87A5.89,5.89,0,0,0,197,32.42h9.26c-1.81,7-8.27,10-15,10-9.84,0-16.53-5.94-16.53-16.06,0-9.26,7.39-15.89,16.29-15.89,10.82,0,16.24,8.15,15.77,18.39Zm12.28-5.53c-.17-3.38-2.56-6.17-5.88-6.17-3.49,0-5.82,2.5-6.4,6.17Z"
                                    ></path>
                                    <rect className="cls-2" x="211.46" width="9.89" height="41.56"></rect>
                                    <path
                                        className="cls-2"
                                        d="M235.43,31.6A4.06,4.06,0,0,0,237.06,35a6.2,6.2,0,0,0,3.67,1c1.92,0,4.66-.82,4.66-3.2s-3.08-2.79-4.83-3.2c-6.23-1.57-14-1.74-14-9.89,0-7.27,7.86-9.25,13.79-9.25,6.63,0,13.56,1.92,13.91,9.78H245.1a2.85,2.85,0,0,0-1.28-2.62,5.86,5.86,0,0,0-3.14-.76c-1.63,0-4.25.18-4.25,2.27,0,2.85,6.63,3.37,11.17,4.36,6.11,1.22,7.68,5.65,7.68,8.15,0,8.09-7.68,10.77-14.49,10.77C233.63,42.43,226.3,40,226,31.6Z"
                                    ></path>
                                    <path
                                        className="cls-2"
                                        d="M268,28.87c.18,4.13,2.56,6.87,6.75,6.87a5.89,5.89,0,0,0,5.64-3.32h9.26c-1.81,7-8.26,10-15,10-9.83,0-16.53-5.94-16.53-16.06,0-9.26,7.39-15.89,16.3-15.89,10.83,0,16.24,8.15,15.77,18.39Zm12.28-5.53c-.17-3.38-2.56-6.17-5.88-6.17-3.49,0-5.82,2.5-6.4,6.17Z"
                                    ></path>
                                    <path
                                        className="cls-2"
                                        d="M294.5,11.35h9.6v4.13h.12c1.8-3.08,5.88-5,9.49-5,10.07,0,10.88,7.33,10.88,11.7V41.55h-9.89V26.95c0-4.13.47-8.32-4.94-8.32-3.73,0-5.36,3.14-5.36,6.46V41.55H294.5Z"
                                    ></path>
                                    <path
                                        className="cls-2"
                                        d="M339,28.87c.17,4.13,2.56,6.87,6.75,6.87a5.9,5.9,0,0,0,5.64-3.32h9.25c-1.81,7-8.26,10-15,10-9.83,0-16.53-5.94-16.53-16.06,0-9.26,7.39-15.89,16.3-15.89,10.82,0,16.24,8.15,15.77,18.39Zm12.28-5.53c-.17-3.38-2.56-6.17-5.88-6.17-3.49,0-5.82,2.5-6.4,6.17Z"
                                    ></path>
                                    <path
                                        className="cls-2"
                                        d="M385.34,17.75h-7.7V31.48c0,2.39,1.4,2.91,3.55,2.91.81,0,1.69-.12,2.56-.12v7.27c-1.81.06-3.61.29-5.41.29-8.44,0-10.59-2.45-10.59-10.65V17.75h-5v-6.4h5V2.21h9.89v9.14h7.7Z"
                                    ></path>
                                    <path
                                        className="cls-2"
                                        d="M405.81,17.75H399.7V31.48c0,2.39,1.4,2.91,3.55,2.91.82,0,1.69-.12,2.56-.12v7.27c-1.81.06-3.61.29-5.41.29-8.44,0-10.59-2.45-10.59-10.65V17.75h-5v-6.4h5V2.21h9.89v9.14h6.11Z"
                                    ></path>
                                </g>
                            </g>
                        </svg>
                    </div>
                    <div className="app-name">
                        <h2 style={{ margin: 0 }}>Skjemabygger</h2>
                    </div>
                </div>
            </div>
            <div className="main-menu align-everything">
                <div className="align-everything">
                    <Link to="/new-create-form">
                        <Btn title="Opprett nytt skjema" icon="ion-plus-round" variant="primary" />
                    </Link>
                    <label className="regular-btn secondary" style={{ marginLeft: 30 }}>
                        <input type="file" style={{ display: 'none' }} onChange={onChange} accept="application/JSON" />
                        <i className="ion-ios-cloud-upload-outline" /> Last opp skjema
                    </label>
                </div>
            </div>
        </>
    );
};

export default MainMenu;
