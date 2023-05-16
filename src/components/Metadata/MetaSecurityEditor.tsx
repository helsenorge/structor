import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    getMetaSecurity,
    metaSecurityOptions,
    metaSecurityCode,
    skjemaUtfyllerOptions,
    formFillingAccessCode,
    skjemaUtfyllerCode,
    formFillingAccessOptions,
    getFormFillingAccess,
    updateMetaSecurity,
    getTilgangsstyringCodes,
} from '../../helpers/MetadataHelper';
import FormField from '../FormField/FormField';
import { TreeContext } from '../../store/treeStore/treeStore';
import RadioBtn from '../RadioBtn/RadioBtn';
import { MetaSecuritySystem } from '../../types/IQuestionnareItemType';
import Checkbox from '@helsenorge/designsystem-react/components/Checkbox';
import { CheckboxOption } from '../../types/OptionTypes';

const MetaSecurityEditor = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = React.useContext(TreeContext);
    const { qMetadata } = state;
    const [displayTilgangsstyring, setDisplayTilgangsstyring] = React.useState(
        getTilgangsstyringCodes(qMetadata)?.length > 0,
    );

    const updateTjenesteomraadeMetaSecurity = (code: string): void => {
        const securityToSet =
            qMetadata.meta?.security?.filter((f) => f.system !== MetaSecuritySystem.tjenesteomraade) || [];
        securityToSet.push(getMetaSecurity(code));
        updateMetaSecurity(qMetadata, securityToSet, dispatch);
    };

    const getTjenesteOmraadeSystem = (): string => {
        const system =
            qMetadata.meta &&
            qMetadata.meta.security &&
            qMetadata.meta.security.length > 0 &&
            qMetadata.meta.security.filter((f) => f.system === MetaSecuritySystem.tjenesteomraade)?.[0]?.code;

        return system || metaSecurityCode.helsehjelp;
    };

    const optionsIsChecked = (v: CheckboxOption): boolean => {
        return getTilgangsstyringCodes(qMetadata)?.find((f) => f === v.code) !== undefined;
    };

    const onChangeUtfyllingAvSkjema = (value: string) => {
        setDisplayTilgangsstyring(value !== skjemaUtfyllerCode.Standard);
        const securityToSet =
            qMetadata.meta?.security?.filter((f) => f.system !== MetaSecuritySystem.kanUtforesAv) || [];
        if (value !== skjemaUtfyllerCode.Standard) {
            securityToSet.push(getFormFillingAccess(formFillingAccessCode.kunInnbygger));
        }
        updateMetaSecurity(qMetadata, securityToSet, dispatch);
    };

    const onChangeTilgangsstyring = (code: string): void => {
        const securityToSet =
            qMetadata.meta?.security?.filter((f) => f.code !== code || f.system !== MetaSecuritySystem.kanUtforesAv) ||
            [];

        const finnes =
            qMetadata.meta?.security?.find((f) => f.code === code && f.system === MetaSecuritySystem.kanUtforesAv) !==
            undefined;
        if (!finnes) {
            securityToSet.push(getFormFillingAccess(code));
        }
        updateMetaSecurity(qMetadata, securityToSet, dispatch);
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
                    checked={displayTilgangsstyring ? skjemaUtfyllerCode.Tilpassert : skjemaUtfyllerCode.Standard}
                    onChange={onChangeUtfyllingAvSkjema}
                    options={skjemaUtfyllerOptions}
                    name={'formfilling-radio'}
                />
            </FormField>

            {/* Skjema Utfylling Tilgangsstyring */}
            {displayTilgangsstyring && (
                <FormField label={t('Hvem skal kunne fylle ut skjemaet?')}>
                    {formFillingAccessOptions.map((option) => {
                        return (
                            <Checkbox
                                key={option.code}
                                label={option.display}
                                disabled={option.disabled}
                                value={option.code}
                                name={option.code}
                                checked={optionsIsChecked(option)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    // eslint-disable-next-line
                                    console.log('e', e.target.value);
                                    onChangeTilgangsstyring(e.target.value);
                                }}
                                inputId={option.code}
                            />
                        );
                    })}
                </FormField>
            )}
        </>
    );
};

export default MetaSecurityEditor;
