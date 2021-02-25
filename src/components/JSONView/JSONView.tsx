import React, { useContext } from 'react';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import IconBtn from '../IconBtn/IconBtn';

type Props = {
    showJSONView: () => void;
};

const JSONView = ({ showJSONView }: Props): JSX.Element => {
    const { state } = useContext(TreeContext);

    return (
        <div className="overlay">
            <div className="structor-helper">
                <div className="title">
                    <IconBtn type="x" title="Tilbake" onClick={showJSONView} />
                    <h1>JSON struktur</h1>
                </div>
                <code className="json">{JSON.stringify(JSON.parse(generateQuestionnaire(state)), undefined, 2)}</code>
            </div>
        </div>
    );
};

export default JSONView;
