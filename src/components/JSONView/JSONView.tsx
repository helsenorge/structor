import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { generateQuestionnaire } from '../../helpers/generateQuestionnaire';
import { TreeContext } from '../../store/treeStore/treeStore';
import IconBtn from '../IconBtn/IconBtn';

type Props = {
    showJSONView: () => void;
};

const JSONView = ({ showJSONView }: Props): JSX.Element => {
    const { t } = useTranslation();
    const { state } = useContext(TreeContext);

    return (
        <div className="overlay">
            <div className="structor-helper">
                <div className="title">
                    <IconBtn type="x" title={t('Back')} onClick={showJSONView} />
                    <h1>{t('JSON structure')}</h1>
                </div>
                <code className="json">{JSON.stringify(JSON.parse(generateQuestionnaire(state)), undefined, 2)}</code>
            </div>
        </div>
    );
};

export default JSONView;
