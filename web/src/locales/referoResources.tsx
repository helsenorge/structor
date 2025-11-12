import { Resources } from "@helsenorge/refero";

export const getResources = (language: string): Resources => {
  if (language === "en-GB") {
    return {
      dateLabel_february: "February",
      dateLabel_march: "March",
      dateLabel_may: "May",
      dateLabel_june: "June",
      dateLabel_july: "July",
      dateLabel_september: "September",
      dateLabel_october: "October",
      dateLabel_november: "November",
      formSend_skjema_i_oppgave: "Submit response",
      dateLabel_january: "January",
      harikkeTilgang_skjema_ungdom: "You do not have access to this form",
      attachmentError_minFiles: "You must add at least {0} file(s)",
      attachmentError_maxFiles: "A maximum of {0} file(s) are allowed",
      attachmentError_fileSize: "File size must be less than {0}MB",
      attachmentError_fileType: "Allowed file types are:",
      dateError_invalid: "Invalid date",
      hjelpeknapp_ariaLabel: "more information about the form",
      dateError_time_invalid: "Invalid time",
      dateLabel_year: "Year",
      dateLabel_month: "Month",
      kanIkkeLagreErrorBody: "You cannot save the form",
      kanIkkeLagreErrorTitle: "Cannot save form",
      skjemaTittelVedDiscretion: "Submitted form",
      uploadFileError: "Technical error",
      attachment_max_occurrences:
        "You cannot upload more than {0} attachments to this form",
      attachmentError_wrong_file_type: "Invalid file type",
      attachmentError_fileSize_total:
        "Total file size exceeds the allowed limit",
      attachment_max_occurrences_single_file:
        "You cannot upload more than {0} attachments to this form",
      attachment_min_occurrences_single_file:
        "You must upload at least {0} attachments to this form",
      kan_ikke_autofylle_skjema:
        "The questions in this form have been changed since you started filling it out, so you must fill out the form again.",
      attachmentError_minFiles_and_maxFiles:
        "You must upload between {0} and {1} attachments to this form",
      dateLabel_april: "April",
      dateLabel_august: "August",
      dateLabel_december: "December",
      confirmDeleteButtonText: "Delete row",
      confirmDeleteCancelButtonText: "Discard changes",
      confirmDeleteHeading: "There are unsaved changes",
      confirmDeleteDescription:
        "If you delete the row, your changes will be discarded.",
      skjemaAccessDeniedErrorTitle: "This form is not available",
      skjemaAccessDeniedDiscretionSubjectOnlyErrorBody:
        "The form must be completed by you personally.",
      validationNotAllowed: "is not allowed",
      helsenorge: "helsenorge.no",
      formCancel: "Cancel",
      formSend: "Submit",
      formOptional: "(optional)",
      repeatButtonText: "Add",
      confirmationActionButton: "Ok",
      sendtConfirmation: "Submitted",
      sendtConfirmationText:
        "You will find a copy of the message in your inbox. You can delete messages whenever you want.\nA copy is also stored in Documents. You can delete this document, or hide it from the person to whom you have given power of attorney.",
      sendInnSkjemaErrorTitle: "Error",
      sendInnSkjemaErrorBody:
        "An error occurred while submitting the form. Try again later",
      errorAfterMaxDate: "Date cannot be after maximum date",
      errorBeforeMinDate: "Date cannot be before minimum date",
      ugyldigTid: "Invalid time",
      ugyldigDatoTid: "Invalid date and time",
      oppgiVerdi: "Select one of the options",
      oppgiGyldigVerdi: "Please enter a valid value",
      innsendtSkjema: "Form sent to {0} via Helsenorge",
      skjemaKopi: "Your copy of completed form attached.",
      oppgavenFinsIkke: "The task does not exist,",
      deleteButtonText: "Delete",
      validationSummaryHeader:
        "Check that the following are filled in correctly:",
      selectDefaultPlaceholder: "Select one of the options",
      validationFileMax: "File size must be less than {0} MB",
      supportedFileFormats: "Valid file formats are jpeg, png and pdf",
      ikkeBesvart: "Not answered",
      loadSkjemaErrorTitle: "A technical error has occurred",
      loadSkjemaErrorBody: "Try again later.",
      loadSkjemaButtonOk: "Ok",
      berikingFailedOnRetrievalBody:
        "Due to a technical error, the form can not be submitted right now. You can still fill out and save it, but you will have to submit the form later.",
      berikingFailedOnRetrievalTitle: "A problem has occurred",
      confirmDiscretionSendButtonText: "Submit without saving",
      confirmDiscretionlagreAndSendButtonText: "Submit and save",
      sendtConfirmationDiscretion: "No copy of the form exists in Helsenorge.",
      anonymousUploadTitle: "Uploading attachment failed",
      anonymousUploadDescription: "You must log in to upload attachments.",
      skjemaLoginButton: "Log in to submit",
      skjemaLoginMessageAuthenticationRequirementOptional:
        "You should log in to fill out and submit this form in order to save a copy of it. You may submit this form without logging in, but you will then not receive a copy of the form.",
      skjemaLoginMessageAuthenticationRequirementRequired:
        "You must log in to fill out and submit this form.",
      confirmDiscretionTitle: "Do you want to submit without saving?",
      confirmDiscretionText:
        "A copy of the form will be saved to your inbox. You may choose not to save the form.",
      skjemaAccessDeniedNoAccessToTjenesteErrorBody:
        '<p> You have attempted to use a service that is not available to you or the person you represent. <br/>\nThis may be because you have not given the necessary consent, the power of attorney does not allow you to use this service, or you as a parent are not allowed to use the service on behalf of your child. </p>\n\n<p> If you wish, you may <a href="https://tjenester.helsenorge.no/personverninnstilling">change your consent</a>. </p>',
      lagreSkjemaButtonFortsettSenere: "Continue later",
      lagreSkjemaButtonFortsettUtfylling: "Continue filling out",
      lagreSkjemaTittel: "The form is saved",
      helpButtonTooltip: "Show tooltip",
      sidebarSectionText_Veileder_Opplysninger_KontaktHelsenorge:
        "The information you fill in will not be stored.",
      sidebar_printLink: "Print version",
      lagreSkjemaDokumenterBody: "The form is stored in Documents",
      formFinish: "Submit",
      formRequiredErrorMessage: "This field is required",
      deleteAttachmentText: "Delete",
      uploadButtonText: "Upload file",
      autoSuggestLoadError: "Technical error",
      stringOverMaxLengthError:
        "You have typed too many characters. Make the text shorter.",
      chooseFilesText: "Select files",
      skjemaLoginMessageAuthenticationRequirementRequiredPrint:
        "You must {loginLink} to submit a form. Alternatively, you can fill in a print version instead, see {omSkjemaLink}.",
      loggeInnLinkText: "log in",
      skjemaLoginMessageAuthenticationRequirementOptionalPrint:
        "You should {loginLink} to fill out and submit this form in order to save a copy of it. You may submit this form without logging in, but you will then not receive a copy of the form.",
      skjemaLoginMessageAuthenticationRequirementRequiredNoPrint:
        "You need to {loginLink} to complete and submit this form.",
      autosuggestNoSuggestions:
        'No results found for "{0}". Try another word or check for spelling errors.',
      skipLinkText: "Go to navigator",
      sidebar_titleSkjema: "About the form",
      sidebar_openlabel: "Display information on the form",
      sidebar_closelabel: "Close information on the form",
      sidebar_titlearia: "Help about",
      personverninnstillingerLink: "Privacy settings",
      formSave: "Save",
      sidebarSectionHeader_Alternativer: "Options regarding completion",
      sidebarSectionHeader_Veiledning: "Guidance and person responsible",
      sidebarSectionHeader_BehandlingMottaker: "Processing by the recipient",
      sidebarSectionText_Alternativer_LoggInn:
        "If you do not wish to log in to Helsenorge, you can print this version instead: {0}.",
      sidebarSectionText_Alternativer_Representasjon:
        "If you fill in the form on behalf of anyone else, you must first choose who you wish to represent",
      sidebarSectionText_Veiledning_KontaktHelsenorge:
        "Please contact Helsenorge’s helpline on 23 32 70 00 if you have any questions about how to use Helsenorge.",
      sidebarSectionText_Veiledning_LagringInnboks:
        "Once you have submitted the form, you will find a copy of the sent message in your inbox. This is your own copy, which you can delete whenever you want. In addition, Helsenorge normally stores a copy of the form in Documents as well. You can delete this document, or hide it from the person to whom you have given power of attorney.",
      sidebarSectionText_Veiledning_LagringDokument:
        "When you complete the form, the completed form is saved in Documents. You can choose to share it with your GP, print it out, hide it from any delegatee, or delete it.",
      message_printVersionAvailable:
        "Alternatively, you can fill in the paper form; see {omSkjemaLink}.",
      message_canRepresentOthers:
        "Select {omSkjemaLink} if you have any questions or wish to fill in the form on behalf of someone other than yourself. Here, you will find information about who you can contact and how the information you provide will be processed.",
      message_canNotRepresentOthers:
        "Select {omSkjemaLink} if you have any questions. Here, you will find information about who you can contact and how the information you provide will be processed.",
      message_noAccessToTjeneste:
        "You must expand your Helsenorge consent in order to complete this form. Go to {personverninnstillingerLink} to do this.",
      formProceed: "Continue",
      openChoiceOption: "Other",
      year_field_invalid: "Enter a valid value for the year field",
      year_field_required: "Year is required",
      year_field_mindate: "The earliest year you can choose is",
      year_field_maxdate: "The most recent year you can choose is",
      yearmonth_field_month_placeholder: "Select month",
      yearmonth_field_required: "Year and month are required",
      adresseKomponent_header: "Who is the recipient?",
      adresseKomponent_sublabel:
        "You must select recipient before submitting the questionnaire.",
      adresseKomponent_velgHelseregion: "Select health region",
      adresseKomponent_velgHelseforetak: "Select health company",
      adresseKomponent_velgSykehus: "Select hospital",
      adresseKomponent_velgAvdeling: "Select department",
      adresseKomponent_skjemaSendesTil: "Questionnaire will be sent to:",
      adresseKomponent_feilmelding: "You must select a recipient.",
      adresseKomponent_loadError: "Technical error. Could not load recipients.",
      adresseKomponent_velgKlinikk: "Select clinic",
      adresseKomponent_velgSeksjon: "Select section",
      adresseKomponent_velgSengepost: "Select bed post",
      adresseKomponent_velgPoliklinikk: "Select polyclinic",
      adresseKomponent_velgTjeneste: "Select place of treatment",
      linkOpensInNewTab: "Opens in new tab",
      nextStep: "Next",
      previousStep: "Previous",
      message_skjemaHaddeVedlegg:
        "The attachments are not included to the copied form. In case the attachments are still relevant, you must upload them again.",
      flervalg_tekst: "Multiple choice",
      loggetut_feil_tittel: "You have been logged out.",
      harIkkeTilgang_sperretadresse:
        "You do not have access to fill in this form, because your address is blocked.",
      harIkkeTilgang_scop_segselv:
        "You do not have access to fill in this form because you do not have the correct consent level. Go to {personverninnstillingerLink} on Helsenorge to change this.",
      harIkkeTilgang_scop_fullmakt:
        "You do not have access to fill out this form because your authorization does not apply to this service.",
      harIkkeTilgang_skjema_kunInnbygger:
        "This form cannot be completed on behalf of others.",
      harIkkeTilgang_skjema_paVegnAvBarn:
        "This form cannot be completed by parents on behalf of children.",
      harIkkeTilgang_skjema_paVegnAvBarnUnder12:
        "This form cannot be completed by parents on behalf of children under 12 years of age.",
      harIkkeTilgang_skjema_paVegnAvBarnMellom12Og16:
        "This form cannot be completed by parents on behalf of children between 12-16 years of age.",
      harIkkeTilgang_skjema_kanIkkeFullmakt:
        "This form cannot be completed by proxy.",
      harIkkeTilgang_default: "You do not have access to fill in this form.",
      maxCharactersText: "characters",
      dateFormat_ddmmyyyy: "(dd.mm.yyyy)",
      timeError_hours_digits: "The field for hours only allows 2 characters",
      timeError_minutes_digits:
        "The field for minutes only allows 2 characters",
      microwebstep_navigasjon_tilbake_button: "Back",
      microwebstep_navigasjon_neste_button: "Next",
      microwebstep_navigasjon_avbryt_button: "Cancel",
      quantity_unit_sublabel: "Enter in",
      autolagering_tekst:
        "You can continue filling out the form or delete it from Documents (Dokumenter)",
      autolagering_emne:
        "You were automatically logged out when you filled in a form",
      valgt_tekst: "Selected",
      alternativer_tekst: "Options",
    };
  } else {
    return {
      confirmDeleteButtonText: "Slett rad",
      confirmDeleteCancelButtonText: "Avbryt",
      confirmDeleteHeading: "Det finnes endringer som ikke er lagret",
      confirmDeleteDescription:
        "Hvis du sletter raden, vil du miste endringene du har gjort.",
      skjemaAccessDeniedErrorTitle: "Dette skjemaet er ikke tilgjengelig",
      skjemaAccessDeniedDiscretionSubjectOnlyErrorBody:
        "Skjemaet må fylles ut personlig av den det gjelder",
      validationNotAllowed: "er ikke tillatt",
      helsenorge: "Helsenorge",
      formCancel: "Avbryt",
      formSend: "Send inn",
      formOptional: "(valgfritt)",
      repeatButtonText: "Legg til",
      confirmationActionButton: "Ok",
      sendtConfirmation: "Sendt",
      sendtConfirmationText:
        "Du finner en kopi av meldingen i innboksen din på Helsenorge. Du kan slette meldinger når du vil.\nEn kopi er også lagret i Dokumenter på Helsenorge. Dette dokumentet kan du slette, eller skjule for den du eventuelt har gitt fullmakt.",
      sendInnSkjemaErrorTitle: "Feil",
      sendInnSkjemaErrorBody:
        "Det skjedde en feil under innsending av skjema. Prøv igjen senere.",
      errorAfterMaxDate: "Dato kan ikke være etter maksimum dato",
      errorBeforeMinDate: "Dato kan ikke være før minimums dato",
      ugyldigTid: "Ugyldig tid",
      ugyldigDatoTid: "Ugyldig dato og tid",
      oppgiVerdi: "Velg ett av alternativene",
      oppgiGyldigVerdi: "Oppgi en gyldig verdi",
      innsendtSkjema: "Skjema sendt inn til {0} via Helsenorge.",
      skjemaKopi: "Din kopi av utfylt skjema vedlagt.",
      oppgavenFinsIkke: "Skjemaet eller oppgaven finnes ikke.",
      deleteButtonText: "Slett",
      validationSummaryHeader: "Sjekk at følgende er riktig utfylt:",
      selectDefaultPlaceholder: "Velg ett av alternativene",
      validationFileMax: "Filstørrelsen må være mindre enn {0} MB",
      supportedFileFormats: "Gyldige filformater er jpeg, png og pdf",
      ikkeBesvart: "Ikke besvart",
      loadSkjemaErrorTitle: "Det har skjedd en teknisk feil",
      loadSkjemaErrorBody: "Prøv igjen senere.",
      loadSkjemaButtonOk: "Ok",
      berikingFailedOnRetrievalBody:
        "Det er ikke mulig å sende inn skjemaet akkurat nå grunnet en teknisk feil. Du kan fortsatt fylle ut og lagre skjemaet, men må sende inn skjemaet senere.",
      berikingFailedOnRetrievalTitle: "Et problem har oppstått",
      confirmDiscretionSendButtonText: "Send uten å lagre",
      confirmDiscretionlagreAndSendButtonText: "Send og lagre",
      sendtConfirmationDiscretion:
        "Det finnes ingen kopi av skjemaet på Helsenorge.",
      anonymousUploadTitle: "Opplasting av vedlegg feilet",
      anonymousUploadDescription:
        "Du må logge inn for å kunne laste opp vedlegg.",
      skjemaLoginButton: "Logg inn for å sende inn",
      skjemaLoginMessageAuthenticationRequirementOptional:
        "Du bør logge inn for å fylle ut og sende inn dette skjemaet, slik at du får lagre en kopi. Det er også mulig å sende inn dette skjemaet uten å logge inn. Du vil da ikke få noen kopi av skjemaet.",
      skjemaLoginMessageAuthenticationRequirementRequired:
        "Du må logge inn for å fylle ut og sende dette skjemaet.",
      confirmDiscretionTitle: "Vil du sende og lagre?",
      confirmDiscretionText:
        "En kopi av skjemaet vil normalt bli lagret på Helsenorge. Du kan unngå denne lagringen hvis du vil.",
      skjemaAccessDeniedNoAccessToTjenesteErrorBody:
        '<p>Du har forsøkt å bruke en tjeneste som ikke er tilgjengelig for deg eller den du representerer.<br/>\nDette kan skyldes at du ikke har gitt nødvendig samtykke, fullmakten ikke tillater at du bruker denne tjenesten eller at du som forelder ikke har lov til å bruke tjenesten for barnet ditt.</p>\n\n<p>Dersom du ønsker, kan du <a href="https://tjenester.helsenorge.no/personverninnstillinger">forandre på samtykket ditt</a>.</p>',
      lagreSkjemaButtonFortsettSenere: "Fortsett senere",
      lagreSkjemaButtonFortsettUtfylling: "Fortsett å fylle ut",
      lagreSkjemaTittel: "Skjemaet er lagret i Dokumenter",
      helpButtonTooltip: "Vis hjelp",
      sidebarSectionText_Veileder_Opplysninger_KontaktHelsenorge:
        "Opplysningene du fyller ut lagres ikke.",
      sidebar_printLink: "Utskriftsversjon",
      lagreSkjemaDokumenterBody:
        "Velg fortsett senere dersom du ønsker å gå ut av skjemaet.",
      formFinish: "Fullfør",
      formRequiredErrorMessage: "Du må fylle ut dette feltet",
      deleteAttachmentText: "Slett",
      uploadButtonText: "Last opp fil",
      autoSuggestLoadError: "Teknisk feil",
      stringOverMaxLengthError:
        "Du har skrevet for mange tegn. Gjør teksten kortere.",
      chooseFilesText: "Velg filer",
      skjemaLoginMessageAuthenticationRequirementRequiredPrint:
        "Du må {loginLink} for å kunne sende skjema. Alternativt kan du fylle ut på papir, klikk på {omSkjemaLink} for å få vite mer.",
      loggeInnLinkText: "logge inn",
      skjemaLoginMessageAuthenticationRequirementOptionalPrint:
        "Du bør {loginLink} for å fylle ut og sende inn dette skjemaet, slik at du får lagre en kopi. Det er også mulig å sende inn dette skjemaet uten å logge inn. Du vil da ikke få noen kopi av skjemaet.",
      skjemaLoginMessageAuthenticationRequirementRequiredNoPrint:
        "Du må {loginLink} for å fylle ut og sende dette skjemaet.",
      autosuggestNoSuggestions:
        'Ingen treff på "{0}". Prøv med et annet ord eller sjekk for skrivefeil.',
      skipLinkText: "Hopp til navigator",
      sidebar_titleSkjema: "Om skjema",
      sidebar_openlabel: "Vis informasjon om skjema",
      sidebar_closelabel: "Lukk informasjon om skjema",
      sidebar_titlearia: "Hjelp om",
      personverninnstillingerLink: "personverninnstillinger",
      formSave: "Lagre",
      sidebarSectionHeader_Alternativer: "Alternativer for utfylling",
      sidebarSectionHeader_Veiledning: "Veiledning og ansvarlig",
      sidebarSectionHeader_BehandlingMottaker: "Behandling hos mottaker",
      sidebarSectionText_Alternativer_LoggInn:
        "Hvis du ikke vil logge inn på Helsenorge, kan du skrive ut denne versjonen i stedet: {0}.",
      sidebarSectionText_Alternativer_Representasjon:
        "Hvis du vil fylle ut skjemaet på vegne av andre, må du først velge hvem du vil representere",
      sidebarSectionText_Veiledning_KontaktHelsenorge:
        "Ta kontakt med Veiledning Helsenorge på telefon 23 32 70 00 hvis du har spørsmål om hvordan du bruker Helsenorge.",
      sidebarSectionText_Veiledning_LagringInnboks:
        "Når du har sendt inn skjemaet, finner du en kopi av den sendte meldingen i innboksen din. Dette er din egen kopi, som du kan slette når du vil. I tillegg lagrer Helsenorge normalt en kopi av skjemaet også i Dokumenter. Dette dokumentet kan du slette, eller skjule for den du eventuelt har gitt fullmakt.",
      sidebarSectionText_Veiledning_LagringDokument:
        "Når du fullfører skjemautfyllingen, lagres det utfylte skjemaet i Dokumenter. Dette dokumentet kan du slette, eller skjule for den du eventuelt har gitt fullmakt.",
      message_printVersionAvailable:
        "Alternativt kan du fylle ut på papir, klikk på {omSkjemaLink} for å få vite mer.",
      message_canRepresentOthers:
        "Klikk på {omSkjemaLink} hvis du har spørsmål eller ønsker å fylle ut på vegne av andre enn deg selv. Her finner du informasjon om hvor du kan henvende deg og hvordan opplysningene du oppgir vil bli behandlet.",
      message_canNotRepresentOthers:
        "Klikk på {omSkjemaLink} hvis du har spørsmål. Her finner du informasjon om hvor du kan henvende deg og hvordan opplysningene du oppgir vil bli behandlet.",
      message_noAccessToTjeneste:
        "Du har ikke tilgang til å fylle ut dette skjemaet. Hvis det skyldes at du ikke har rett samtykke, kan du gå til {personverninnstillingerLink} på Helsenorge.",
      uploadFileError: "Teknisk feil",
      hjelpeknapp_ariaLabel: "mer informasjon om skjema",
      skjemaTittelVedDiscretion: "Innsendt skjema",
      formProceed: "Gå videre",
      openChoiceOption: "Annet",
      year_field_invalid: "Du må skrive inn et gyldig årstall",
      year_field_required: "Årstall er påkrevd",
      year_field_mindate: "Det tidligste året du kan velge er",
      year_field_maxdate: "Det seneste året du kan velge er",
      yearmonth_field_month_placeholder: "Velg måned",
      yearmonth_field_required: "Årstall og måned er påkrevd",
      adresseKomponent_header: "Hvem er mottaker av skjemaet?",
      adresseKomponent_sublabel: "Du må velge mottaker før du sender skjemaet.",
      adresseKomponent_velgHelseregion: "Velg helseregion",
      adresseKomponent_velgHelseforetak: "Velg helseforetak",
      adresseKomponent_velgSykehus: "Velg sykehus",
      adresseKomponent_velgAvdeling: "Velg avdeling",
      adresseKomponent_skjemaSendesTil: "Skjemaet sendes til:",
      adresseKomponent_feilmelding: "Du må velge en mottaker",
      adresseKomponent_loadError: "Teknisk feil. Kunne ikke laste mottakere.",
      adresseKomponent_velgKlinikk: "Velg klinikk",
      adresseKomponent_velgSeksjon: "Velg seksjon",
      adresseKomponent_velgSengepost: "Velg sengepost",
      adresseKomponent_velgPoliklinikk: "Velg poliklinikk",
      adresseKomponent_velgTjeneste: "Velg behandlingssted",
      kanIkkeLagreErrorTitle: "Kan ikke lagre skjema",
      kanIkkeLagreErrorBody:
        "Valgene du har tatt i skjema tilsier ikke at skjema trenger å lagres.",
      linkOpensInNewTab: "Åpnes i ny fane",
      nextStep: "Neste",
      previousStep: "Forrige",
      message_skjemaHaddeVedlegg:
        "Vedlegg fra en tidligere lagret versjon blir ikke automatisk lagt til dette skjemaet. Ønsker du å bruke et vedlegg fra et tidligere skjema, må du legge det inn på nytt.",
      flervalg_tekst: "Flervalg",
      loggetut_feil_tittel: "Du har blitt logget ut",
      harIkkeTilgang_sperretadresse:
        "Du kan ikke fylle ut dette skjemaet fordi du har adressesperre.",
      harIkkeTilgang_scop_segselv:
        "Du må utvide din bruk av Helsenorge for å kunne fylle ut dette skjemaet.\nGå til {personverninnstillingerLink} på Helsenorge for å endre samtykkenivå.",
      harIkkeTilgang_scop_fullmakt:
        "Fullmakten din gir ikke tilgang til å fylle ut dette skjemaet.",
      harIkkeTilgang_skjema_kunInnbygger:
        "Dette skjemaet kan kun fylles ut av den du representerer.",
      harIkkeTilgang_skjema_paVegnAvBarn:
        "Du har ikke tilgang til å fylle ut skjema på vegne av barnet ditt.",
      harIkkeTilgang_skjema_paVegnAvBarnUnder12:
        "Du har ikke tilgang til å fylle ut skjema på vegne av barnet ditt.",
      harIkkeTilgang_skjema_paVegnAvBarnMellom12Og16:
        "Du har ikke tilgang til å fylle ut skjema på vegne av barnet ditt.",
      harIkkeTilgang_skjema_kanIkkeFullmakt:
        "Fullmakten din gir ikke tilgang til å fylle ut dette skjemaet.",
      harIkkeTilgang_default:
        "Du har ikke tilgang til å fylle ut disse opplysningene.",
      kan_ikke_autofylle_skjema:
        "Spørsmålene i dette skjemaet har blitt endret etter at du startet på det, du må derfor fylle ut skjemaet på nytt.",
      maxCharactersText: "tegn",
      harikkeTilgang_skjema_ungdom:
        "Du kan ikke fylle ut dette skjemaet fordi du er under 16 år.",
      attachmentError_minFiles: "Legg til minst {0} fil(er)",
      attachmentError_maxFiles: "Maks {0} fil(er) er tillatt",
      attachmentError_fileSize: "Filstørrelse må være mindre enn {0}MB",
      attachmentError_fileType: "Tillatte filtyper er:",
      dateError_invalid: "Ugyldig dato",
      dateError_time_invalid: "Ugyldig klokkeslett",
      dateLabel_january: "Januar",
      dateLabel_february: "Februar",
      dateLabel_march: "Mars",
      dateLabel_april: "April",
      dateLabel_may: "Mai",
      dateLabel_june: "Juni",
      dateLabel_july: "Juli",
      dateLabel_august: "August",
      dateLabel_september: "September",
      dateLabel_october: "Oktober",
      dateLabel_november: "November",
      dateLabel_december: "Desember",
      dateFormat_ddmmyyyy: "(dd.mm.åååå)",
      timeError_hours_digits: "Felt for timer tillater kun 2 tegn",
      timeError_minutes_digits: "Felt for minutter tillater kun 2 tegn",
      dateLabel_year: "År",
      dateLabel_month: "Måned",
      microwebstep_navigasjon_tilbake_button: "Tilbake",
      microwebstep_navigasjon_neste_button: "Neste",
      microwebstep_navigasjon_avbryt_button: "Avbryt",
      formSend_skjema_i_oppgave: "Send svar",
      attachmentError_minFiles_and_maxFiles:
        "Minst {0} fil(er) og maks {1} fil(er) er tillatt",
      quantity_unit_sublabel: "Oppgi i",
      attachment_max_occurrences:
        "Du kan ikke laste opp flere enn {0} vedlegg til dette skjema",
      attachmentError_wrong_file_type:
        "Du kan kun laste opp filer av typen {0} til dette skjema",
      attachmentError_fileSize_total:
        "Total filstørrelse må være mindre enn {0}MB",
      attachment_max_occurrences_single_file:
        "Du kan ikke laste opp flere enn {0} vedlegg på dette feltet {1}",
      attachment_min_occurrences_single_file:
        "Du må minst laste opp {0} vedlegg på dette feltet {1}",
      autolagering_tekst:
        "Du kan fortsette å fylle ut skjemaet eller slette det fra Dokumenter",
      autolagering_emne:
        "Du ble automatisk logget ut idet du fylte ut et skjema",
      valgt_tekst: "Valgt",
      alternativer_tekst: "Alternativer",
    };
  }
};
