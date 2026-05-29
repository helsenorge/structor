# Structor - FHIR Questionnaire Builder

Editor for FHIR Questionnaires used by Helsenorge. Build, edit, translate and preview
questionnaires that are rendered by [@helsenorge/refero](https://www.npmjs.com/package/@helsenorge/refero) —
the same library that renders them for end-users on helsenorge.no.

## Features

- **Author questionnaires** — build a tree of groups and questions covering all common FHIR item
  types (boolean, decimal, integer, string, quantity, duration, date/time, choice, open-choice,
  attachment, reference, ...) with markdown-formatted question text.
- **Configure behavior** — set validation rules, enableWhen logic, repeats, required fields, and
  the FHIR extensions Refero understands (sidebar info, calculated expressions, hidden items,
  scoring, etc.) via the per-question and questionnaire-wide settings panels.
- **Manage terminology** — local code systems and value sets, plus Helsenorge's predefined value
  sets that can be attached with one click.
- **Translate** — parallel translations per language, with CSV export/import so translators can
  work in Excel.
- **Preview live** — render the current draft with Refero exactly as a patient would see it on
  helsenorge.no, including validation and conditional logic.
- **Generate PDF and trigger follow-up** — produce a PDF response document and configure guidance
  actions on submit via `sdf-generatepdf` / `sdf-guidanceaction`.
- **Persist and share** — drafts are autosaved to the browser (IndexedDB) and can be
  exported/imported as FHIR Questionnaire JSON.

## Links

- Use the application: <https://skjemabygger.helsenorge.no/>
- Public documentation on  [Skjema og strukturert datafangst](https://helsenorge.atlassian.net/wiki/spaces/HELSENORGE/pages/1254850609/Skjema+og+strukturert+datafangst)

## Stack

- React 19 + TypeScript + Vite
- Redux Toolkit + React Context (`TreeContext` for the questionnaire tree)
- React Router 7
- @helsenorge/designsystem-react, @helsenorge/refero
- Lexical for rich text editing
- i18next for translations
- SCSS Modules
- Vitest + Testing Library
- ESLint, Stylelint, Prettier (run via Husky pre-commit)

## Getting started

Requires Node.

```bash
npm install
npm start          # http://localhost:3000/
```

Production builds are served from `/static_skjemabygger/` unless `VITE_BASE_PATH` is set
(see [vite.config.ts](vite.config.ts)).

## FHIR extensions

A Questionnaire produced by Structor is plain FHIR R4, but extended with extensions [@helsenorge/refero](https://www.npmjs.com/package/@helsenorge/refero) understands. The full set of supported extension URLs lives in
`IExtensionType` in [src/types/IQuestionnareItemType.ts](src/types/IQuestionnareItemType.ts).
The main groups are:

- **HL7 base** — `questionnaire-hidden`, `questionnaire-itemControl`, `minValue`/`maxValue`,
  `minLength`, `regex`, `minOccurs`/`maxOccurs`, `maxDecimalPlaces`, `maxSize`, `entryFormat`,
  `rendering-markdown`, `ordinalValue`, `valueset-label`, `questionnaire-unit`, `cqf-expression`
  (copy expression), `sdc-questionnaire-itemExtractionContext`.
- **ehelse / sdf-** (Norwegian profile) — `sdf-calculatedExpression`, `sdf-fhirpath`,
  `sdf-maxvalue`/`sdf-minvalue` (FHIRPath-based bounds), `sdf-optionReference`,
  `sdf-authenticationrequirement`, `sdf-canbeperformedby`, `sdf-endpoint`, `sdf-generatepdf`,
  `repeatstext`, `validationtext`.
- **helsenorge** — `sdf-sublabel` / `sdf-sublabel-text`, `sdf-presentationbuttons`,
  `sdf-save-capabilities`, `sdf-questionnaire-print-version`, `sdf-questionnaire-navgiator-state`,
  `sdf-hyperlink-target`, `sdf-itemControl-visibility`, `sdf-guidanceaction` / `sdf-guidanceparameter`.

The Extensions panel on a question shows raw extensions, while named editors (e.g. validation,
calculated expression, sidebar info) write the corresponding extension behind the scenes.

## Project structure

```text
src/
  views/         FrontPage (questionnaire list) and FormBuilder (editor)
  components/    Shared UI: Drawer, QuestionDrawer, Refero wrapper, valueInputs, ...
  store/         TreeContext + reducer for the questionnaire tree, IndexedDB persistence
  contexts/      ValidationContext etc.
  router/        Route configuration
  helpers/       FHIR/Questionnaire helpers
  hooks/         Custom React hooks
  locales/       i18next resources
  types/         TypeScript types (FHIR extensions etc.)
```

## Docker

The multi-stage Dockerfile builds two variants:

```bash
# Static (mounted under /static_skjemabygger/)
docker build -f web/Dockerfile --target static --build-arg PAT=$HNDEV_PAT -t skjemabygger/static .
docker run -p 8080:8080 --rm skjemabygger/static
# http://localhost:8080/static_skjemabygger/

# Webapp (mounted under /)
docker build -f web/Dockerfile --target webapp --build-arg PAT=$HNDEV_PAT -t skjemabygger/webapp .
docker run -p 8080:8080 --rm skjemabygger/webapp
# http://localhost:8080/
```

`PAT` is an Azure DevOps Personal Access Token with access to the internal `@helsenorge/*` packages.

## Testing

```bash
npm test                                    # full run with coverage
npm run test:run -- path/to/file.test.tsx   # single file
```

The coverage report is emitted as `lcov` to `web/coverage/` (consumed by SonarQube in CI).
