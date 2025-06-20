export enum IQuestionnaireItemType {
  attachment = "attachment",
  // address is not a fhir-type, but used internally for types choice
  receiver = "receiver",
  receiverComponent = "receiver-component",
  boolean = "boolean",
  choice = "choice",
  date = "date",
  dateTime = "dateTime",
  decimal = "decimal",
  display = "display",
  group = "group",
  // inline is not a fhir-type, but used internally for text item with itemControl 'inline'
  inline = "inline",
  integer = "integer",
  // number is not a fhir-type, but used internally for types integer, decimal and quantity
  number = "number",
  openChoice = "open-choice",
  // extention
  predefined = "predifined",
  quantity = "quantity",
  reference = "reference",
  string = "string",
  text = "text",
  time = "time",
  url = "url",
}

export enum ICodingProperty {
  code = "code",
  display = "display",
  system = "system",
}

export enum IItemProperty {
  answerOption = "answerOption",
  answerValueSet = "answerValueSet",
  code = "code",
  definition = "definition",
  enableBehavior = "enableBehavior",
  enableWhen = "enableWhen",
  extension = "extension",
  initial = "initial",
  linkId = "linkId",
  maxLength = "maxLength",
  prefix = "prefix",
  text = "text",
  _text = "_text",
  readOnly = "readOnly",
  repeats = "repeats",
  required = "required",
  type = "type",
}

export enum IOperator {
  greaterThan = ">",
  greaterThanOrEqual = ">=",
  lessThan = "<",
  lessThanOrEqual = "<=",
  notEqual = "!=",
  equal = "=",
  exists = "exists",
  notExists = "notexists", // only used internally, not valid in FHIR
}

export type IEnableWhen = {
  answerInteger?: number;
  operator?: string;
  question?: string;
};

export const predefinedValueSetUri =
  "http://ehelse.no/fhir/ValueSet/Predefined";

export enum IValueSetSystem {
  saveCapabilityValueSet = "http://helsenorge.no/fhir/ValueSet/sdf-save-capabilities",
  authenticationRequirementValueSet = "http://ehelse.no/fhir/ValueSet/AuthenticationRequirement",
  canBePerformedByValueSet = "http://ehelse.no/fhir/ValueSet/CanBePerformedBy",
  itemControlValueSet = "http://hl7.org/fhir/ValueSet/questionnaire-item-control",
  presentationbuttonsValueSet = "http://helsenorge.no/fhir/ValueSet/presentationbuttons",
  sotHeader = "http://ehelse.no/fhir/ValueSet/SOTHeaders",
  hyperlinkTargetValueset = "http://helsenorge.no/fhir/ValueSet/sdf-hyperlink-target",
}

export enum ICodeSystem {
  renderOptionsCodeSystem = "http://helsenorge.no/fhir/CodeSystem/RenderOptions",
  choiceRenderOptions = "http://helsenorge.no/fhir/CodeSystem/ChoiceRenderOptions",
  attachmentRenderOptions = "http://helsenorge.no/fhir/CodeSystem/AttachmentRenderOptions",
  progressIndicatorOptions = "http://helsenorge.no/fhir/CodeSystem/ProgressIndicatorOptions",
  score = "http://ehelse.no/Score",
  scoringFormulas = "http://ehelse.no/scoringFormulas",
  tableColumn = "http://helsenorge.no/fhir/CodeSystem/TableColumn",
  tableOrderingFunctions = "http://helsenorge.no/fhir/CodeSystem/TableOrderingFunctions",
  tableOrderingColumn = "http://helsenorge.no/fhir/CodeSystem/TableOrderingColumn",
  tableColumnName = "http://helsenorge.no/fhir/CodeSystem/TableColumnName",
  sliderLabels = "http://helsenorge.no/fhir/CodeSystem/SliderLabels",
  sliderDisplayType = "http://helsenorge.no/fhir/CodeSystem/SliderDisplayType",
  validationOptions = "http://helsenorge.no/fhir/CodeSystem/ValidationOptions",
  workflow = "http://helsenorge.no/fhir/CodeSystem/workflow",
  contextParameter = "http://helsenorge.no/fhir/CodeSystem/ContextParameter",
}

export enum IExtensionType {
  authenticationRequirement = "http://ehelse.no/fhir/StructureDefinition/sdf-authenticationrequirement",
  calculatedExpression = "http://ehelse.no/fhir/StructureDefinition/sdf-calculatedExpression",
  canBePerformedBy = "http://ehelse.no/fhir/StructureDefinition/sdf-canbeperformedby",
  endpoint = "http://ehelse.no/fhir/StructureDefinition/sdf-endpoint",
  entryFormat = "http://hl7.org/fhir/StructureDefinition/entryFormat",
  fhirPath = "http://ehelse.no/fhir/StructureDefinition/sdf-fhirpath",
  generatePDF = "http://ehelse.no/fhir/StructureDefinition/sdf-generatepdf",
  guidanceAction = "http://helsenorge.no/fhir/StructureDefinition/sdf-guidanceaction",
  guidanceParam = "http://helsenorge.no/fhir/StructureDefinition/sdf-guidanceparameter",
  hidden = "http://hl7.org/fhir/StructureDefinition/questionnaire-hidden",
  itemControl = "http://hl7.org/fhir/StructureDefinition/questionnaire-itemControl",
  markdown = "http://hl7.org/fhir/StructureDefinition/rendering-markdown",
  maxDecimalPlaces = "http://hl7.org/fhir/StructureDefinition/maxDecimalPlaces",
  maxSize = "http://hl7.org/fhir/StructureDefinition/maxSize",
  maxValue = "http://hl7.org/fhir/StructureDefinition/maxValue",
  minValue = "http://hl7.org/fhir/StructureDefinition/minValue",
  minLength = "http://hl7.org/fhir/StructureDefinition/minLength",
  optionReference = "http://ehelse.no/fhir/StructureDefinition/sdf-optionReference",
  ordinalValue = "http://hl7.org/fhir/StructureDefinition/ordinalValue",
  valueSetLabel = "http://hl7.org/fhir/StructureDefinition/valueset-label",
  presentationbuttons = "http://helsenorge.no/fhir/StructureDefinition/sdf-presentationbuttons",
  questionnaireUnit = "http://hl7.org/fhir/StructureDefinition/questionnaire-unit",
  regEx = "http://hl7.org/fhir/StructureDefinition/regex",
  repeatstext = "http://ehelse.no/fhir/StructureDefinition/repeatstext",
  maxOccurs = "http://hl7.org/fhir/StructureDefinition/questionnaire-maxOccurs",
  minOccurs = "http://hl7.org/fhir/StructureDefinition/questionnaire-minOccurs",
  validationtext = "http://ehelse.no/fhir/StructureDefinition/validationtext",
  navigator = "http://helsenorge.no/fhir/StructureDefinition/sdf-questionnaire-navgiator-state",
  navigatorCodeSystem = "http://helsenorge.no/fhir/CodeSystem/sdf-questionnaire-navigator-state ",
  fhirPathMaxValue = "http://ehelse.no/fhir/StructureDefinition/sdf-maxvalue",
  fhirPathMinValue = "http://ehelse.no/fhir/StructureDefinition/sdf-minvalue",
  sublabel = "http://helsenorge.no/fhir/StructureDefinition/sdf-sublabel",
  saveCapability = "http://helsenorge.no/fhir/StructureDefinition/sdf-save-capabilities",
  printVersion = "http://helsenorge.no/fhir/StructureDefinition/sdf-questionnaire-print-version",
  hyperlinkTarget = "http://helsenorge.no/fhir/StructureDefinition/sdf-hyperlink-target",
  globalVisibility = "http://helsenorge.no/fhir/StructureDefintion/sdf-itemControl-visibility",
  copyExpression = "http://hl7.org/fhir/StructureDefinition/cqf-expression",
  workflow = "http://hl7.org/fhir/ValueSet/usage-context-type",
  itemExtractionContext = "http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire-itemExtractionContext",
}

export enum UseContextSystem {
  helsetjeneste_full = "urn:oid:2.16.578.1.12.4.1.1.8655",
  journalinnsyn_basispluss = "urn:oid:2.16.578.1.12.4.1.1.7614",
  registerinnsyn_basis = "urn:oid:2.16.578.1.12.4.1.1.7615",
}

export enum ItemExtractionContext {
  observation = "http://hl7.org/fhir/StructureDefinition/Observation",
  serviceRequest = "http://hl7.org/fhir/StructureDefinition/ServiceRequest",
  condition = "http://hl7.org/fhir/StructureDefinition/Condition",
  organization = "http://hl7.org/fhir/StructureDefinition/Organization",
  practitioner = "http://hl7.org/fhir/StructureDefinition/Practitioner",
  medicationStatement = "http://hl7.org/fhir/StructureDefinition/MedicationStatement",
}

export enum MetaSecuritySystem {
  tjenesteomraade = "urn:oid:2.16.578.1.12.4.1.1.7618",
  kanUtforesAv = "http://helsenorge.no/fhir/KanUtforesAv",
}

export enum WorkflowCode {
  workflow = "workflow",
  request = "request",
}
