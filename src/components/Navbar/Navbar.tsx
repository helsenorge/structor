import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import Btn from '../Btn/Btn';
import IconBtn from '../IconBtn/IconBtn';

type Props = {
    showAdmin: () => void;
    showFormFiller: () => void;
    showJSONView: () => void;
    showImportValueSet: () => void;
};

const Navbar = ({ showAdmin, showFormFiller, showJSONView, showImportValueSet }: Props): JSX.Element => {
    const { state } = useContext(TreeContext);

    function exportToJsonAndDownload() {
        const questionnaire = generateQuestionnaire(state);
        const filename = state.qMetadata.title || 'skjema' + '.json';
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

    return (
        <header>
            <Link to="/">
                <IconBtn type="back" title="Tilbake" />
            </Link>

            <div className="left"></div>

            <div className="pull-right">
                <Btn title="Forhåndsvisning" onClick={showFormFiller} />
                <Btn title="JSON" onClick={showJSONView} />
                <Btn title="Lagre" onClick={() => exportToJsonAndDownload()} />
                <Btn title="Publiser" onClick={showAdmin} />
                <Btn title="Importer" onClick={showImportValueSet} />
            </div>
        </header>
    );
};

export default Navbar;
