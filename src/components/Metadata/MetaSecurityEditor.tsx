import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    getMetaSecurity,
    metaSecurityOptions,
    metaSecurityCode,
    skjemaUtfyllerOptions,
    formFillingAccessDisplay,
    formFillingAccessCode,
    skjemaUtfyllerCode,
} from '../../helpers/MetadataHelper';
import FormField from '../FormField/FormField';
import { IQuestionnaireMetadataType } from '../../types/IQuestionnaireMetadataType';
import { ContactDetail, Extension, Meta, UsageContext } from '../../types/fhir';
import { TreeContext } from '../../store/treeStore/treeStore';
import { updateQuestionnaireMetadataAction } from '../../store/treeStore/treeActions';
import RadioBtn from '../RadioBtn/RadioBtn';
import CheckboxBtn from '../CheckboxBtn/CheckboxBtn';
import { MetaSecuritySystem } from '../../types/IQuestionnareItemType';

const MetaSecurityEditor = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = React.useContext(TreeContext);
    const { qMetadata } = state;
    const [displayTilgangsstyring, setDisplayTilgangsstyring] = React.useState(false);

    const updateTjenesteomraadeMetaSecurity = (code: string): void => {
        const securityToSet =
            qMetadata.meta?.security?.filter((f) => f.system !== MetaSecuritySystem.tjenesteomraade) || [];
        securityToSet.push(getMetaSecurity(code));

        const newMeta = {
            ...qMetadata.meta,
            security: securityToSet,
        } as Meta;

        dispatch(updateQuestionnaireMetadataAction(IQuestionnaireMetadataType.meta, newMeta));
    };

    const getTjenesteOmraadeSystem = (): string => {
        const system =
            qMetadata.meta &&
            qMetadata.meta.security &&
            qMetadata.meta.security.length > 0 &&
            qMetadata.meta.security.filter((f) => f.system === MetaSecuritySystem.tjenesteomraade)?.[0]?.code;

        return system || metaSecurityCode.helsehjelp;
    };

    const getUtfyllingAvSkjema = () => {
        const utforesAvCode =
            qMetadata.meta &&
            qMetadata.meta.security &&
            qMetadata.meta.security.length > 0 &&
            qMetadata.meta.security.filter((f) => f.system === MetaSecuritySystem.kanUtforesAv)?.[0]?.code;

        const system = displayTilgangsstyring ? skjemaUtfyllerCode.Tilpassert : utforesAvCode;

        return system ? skjemaUtfyllerCode.Tilpassert : skjemaUtfyllerCode.Standard;
    };

    const onChangeUtfyllingAvSkjema = (value: string) => {
        setDisplayTilgangsstyring(value !== skjemaUtfyllerCode.Standard);
    };

    const onChangeTilgangsstyring = (code: string): void => {
        /* eslint-disable */
        console.log('Here', code);
    };

 return (
    <>
        {/* Tjenesteomraade Tilgangsstyring */}
        <FormField
            label={t('Select service area')}
            sublabel={t('Which service area the bruker needs to have to have access to form')}
        >
            <RadioBtn
                checked={getTjenesteOmraadeSystem()}
                onChange={updateTjenesteomraadeMetaSecurity}
                options={metaSecurityOptions}
                name={'servicearea-radio'}
            />
        </FormField>

        {/* Utfylling Av Skjema */}
        <FormField
            label={t('Filling out form')}
            sublabel={t(
                'Who fills out the form is controlled by a standard access service. If the form is to have access control other than standard, this must be selected here. Choose which representation conditions should be able to fill in the form.',
            )}
        >
            <RadioBtn
                checked={getUtfyllingAvSkjema()}
                onChange={onChangeUtfyllingAvSkjema}
                options={skjemaUtfyllerOptions}
                name={'formfilling-radio'}
            />
        </FormField>

        {/* Skjema Utfylling Tilgangsstyring */}
        {displayTilgangsstyring && (
            <FormField label={t('Hvem skal kunne fylle ut skjemaet?')}>
                <CheckboxBtn
                    value={true}
                    disabled={true}
                    label={formFillingAccessDisplay.kunInnbygger}
                    onChange={() => onChangeTilgangsstyring(formFillingAccessCode.kunInnbygger)}
                />
                <CheckboxBtn
                    value={false}
                    label={formFillingAccessDisplay.barnUnder12}
                    onChange={() => onChangeTilgangsstyring(formFillingAccessCode.barnUnder12)}
                />
                <CheckboxBtn
                    value={false}
                    label={formFillingAccessDisplay.barnMellom12Og16}
                    onChange={() => onChangeTilgangsstyring(formFillingAccessCode.barnMellom12Og16)}
                />
                <CheckboxBtn
                    value={false}
                    label={formFillingAccessDisplay.representantOrdinaertFullmakt}
                    onChange={() => onChangeTilgangsstyring(formFillingAccessCode.representantOrdinaertFullmakt)}
                />
            </FormField>
        )}
    </>
 );
};

export default MetaSecurityEditor;