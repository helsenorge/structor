import React from 'react';
import { useTranslation } from 'react-i18next';
import {
    getTjenesteomraadeCoding,
    tjenesteomaadeOptions,
    tjenesteomraadeCode,
    skjemaUtfyllerOptions,
    skjemaUtfyllerCode,
    tilgangsstyringOptions,
    getTilgangsstyringCoding,
    updateMetaSecurity,
    getTilgangsstyringCodes,
    filterMetaSecurity,
    filterOutMetaSecurity,
    kunInnbyggerMetaSecurity,
} from '../../helpers/MetadataHelper';
import FormField from '../FormField/FormField';
import { TreeContext } from '../../store/treeStore/treeStore';
import RadioBtn from '../RadioBtn/RadioBtn';
import { MetaSecuritySystem } from '../../types/IQuestionnareItemType';
import { CheckboxOption } from '../../types/OptionTypes';
import CheckboxBtn from '../CheckboxBtn/CheckboxBtn';
import InfoCheckbox from '../CheckboxBtn/InfoCheckbox';

const MetaSecurityEditor = (): JSX.Element => {
    const { t } = useTranslation();
    const { state, dispatch } = React.useContext(TreeContext);
    const { qMetadata } = state;
    const [displayTilgangsstyring, setDisplayTilgangsstyring] = React.useState(
        getTilgangsstyringCodes(qMetadata)?.length > 0,
    );

    const updateTjenesteomraadeMetaSecurity = (code: string): void => {
        const securityToSet = filterOutMetaSecurity(qMetadata, MetaSecuritySystem.tjenesteomraade) || [];
        securityToSet.push(getTjenesteomraadeCoding(code));
        updateMetaSecurity(qMetadata, securityToSet, dispatch);
    };

    const getTjenesteomraadeSystem = (): string => {
        const system =
            qMetadata.meta &&
            qMetadata.meta.security &&
            qMetadata.meta.security.length > 0 &&
            filterMetaSecurity(qMetadata, MetaSecuritySystem.tjenesteomraade)?.[0]?.code;

        return system || tjenesteomraadeCode.helsehjelp;
    };

    const optionsIsChecked = (v: CheckboxOption): boolean => {
        return getTilgangsstyringCodes(qMetadata)?.find((f) => f === v.code) !== undefined;
    };

    const onChangeUtfyllingAvSkjema = (value: string) => {
        setDisplayTilgangsstyring(value !== skjemaUtfyllerCode.Standard);
        const securityToSet = filterOutMetaSecurity(qMetadata, MetaSecuritySystem.kanUtforesAv) || [];
        if (value !== skjemaUtfyllerCode.Standard) {
            securityToSet.push(kunInnbyggerMetaSecurity);
        }
        updateMetaSecurity(qMetadata, securityToSet, dispatch);
    };

    const onChangeTilgangsstyring = (code: string): void => {
        const securityToSet =
            qMetadata.meta?.security?.filter(
                (f) =>
                    (f.code !== code || f.system !== MetaSecuritySystem.kanUtforesAv) && f !== kunInnbyggerMetaSecurity,
            ) || [];

        const finnes =
            filterMetaSecurity(qMetadata, MetaSecuritySystem.kanUtforesAv)?.find((f) => f.code === code) !== undefined;
        if (!finnes) {
            securityToSet.push(getTilgangsstyringCoding(code));
        }
        const trengerIkkeKunInnbygger = securityToSet.find(
            (f) => f.system === MetaSecuritySystem.kanUtforesAv && f.code !== kunInnbyggerMetaSecurity.code,
        );
        if (!trengerIkkeKunInnbygger) {
            securityToSet.push(kunInnbyggerMetaSecurity);
        }
        updateMetaSecurity(qMetadata, securityToSet, dispatch);
    };

    return (
        <>
            {/* Tjenesteomraade Tilgangsstyring */}
            <FormField
                label={'Velg tjenesteområde'}
                sublabel={'Hvilket tjenesteområde må innbyggeren ha for å få tilgang til skjema'}
            >
                <RadioBtn
                    checked={getTjenesteomraadeSystem()}
                    onChange={updateTjenesteomraadeMetaSecurity}
                    options={tjenesteomaadeOptions}
                    name={'servicearea-radio'}
                />
            </FormField>

            {/* Utfylling Av Skjema */}
            <FormField
                label={'Utfylling av skjema'}
                sublabel={
                    'Hvem som kan fylle ut skjemaet styres av en standard tilgangstjeneste. Dersom skjemaet skal ha annen tilgangsstyring enn standard, må dette velges her. Velg hvilke representasjonsforhold som skal kunne fylle ut skjemaet.'
                }
            >
                <RadioBtn
                    checked={displayTilgangsstyring ? skjemaUtfyllerCode.Tilpasset : skjemaUtfyllerCode.Standard}
                    onChange={onChangeUtfyllingAvSkjema}
                    options={skjemaUtfyllerOptions}
                    name={'formfilling-radio'}
                />
            </FormField>

            {/* Skjema Utfylling Tilgangsstyring */}
            {displayTilgangsstyring && (
                <FormField label={t('Hvem skal kunne fylle ut skjemaet?')}>
                    <InfoCheckbox
                        key={kunInnbyggerMetaSecurity.code}
                        label={kunInnbyggerMetaSecurity.display}
                        checked={true}
                    />
                    {tilgangsstyringOptions.map((option) => {
                        return (
                            <CheckboxBtn
                                key={option.code}
                                label={option.display}
                                value={option.code}
                                checked={optionsIsChecked(option)}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    onChangeTilgangsstyring(e.target.value);
                                }}
                            />
                        );
                    })}
                </FormField>
            )}
        </>
    );
};

export default MetaSecurityEditor;
