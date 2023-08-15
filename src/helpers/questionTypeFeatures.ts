import { QuestionnaireItem } from '../types/fhir';
import { IExtentionType, IQuestionnaireItemType } from '../types/IQuestionnareItemType';
import { createNewAnswerOption } from './answerOptionHelper';
import CreateUUID from './CreateUUID';

import {
    createItemControlExtension,
    isItemControlHighlight,
    isItemControlInline,
    isItemControlReceiverComponent,
    ItemControlType,
} from './itemControl';
import { ATTACHMENT_DEFAULT_MAX_SIZE, dropdownExtension, isRecipientList, valueSetTqqcCoding } from './QuestionHelper';
import { createUriUUID } from './uriHelper';

export const createInlineItem = (): QuestionnaireItem => {
    return {
        linkId: CreateUUID(),
        type: IQuestionnaireItemType.display,
        text: '',
        extension: [],
        code: [],
        item: [],
        required: false,
    };
};

export const getInitialItemConfig = (
    questionType: IQuestionnaireItemType,
    recipientComponentText: string,
): QuestionnaireItem => {
    const newQuestionnaireItem = {
        linkId: CreateUUID(),
        type: IQuestionnaireItemType.group, // default type is group
        text: '',
        extension: [],
        code: [],
        item: [],
        required: false,
    } as QuestionnaireItem;
    if (questionType === IQuestionnaireItemType.group) {
        newQuestionnaireItem.type = IQuestionnaireItemType.group;
    } else if (questionType === IQuestionnaireItemType.attachment) {
        const maxFileSizeExtension = {
            url: IExtentionType.maxSize,
            valueDecimal: ATTACHMENT_DEFAULT_MAX_SIZE,
        };
        newQuestionnaireItem.extension?.push(maxFileSizeExtension);
        newQuestionnaireItem.type = IQuestionnaireItemType.attachment;
    } else if (questionType === IQuestionnaireItemType.receiver) {
        newQuestionnaireItem.type = IQuestionnaireItemType.choice;
        newQuestionnaireItem.code?.push(valueSetTqqcCoding);
        newQuestionnaireItem.extension?.push(dropdownExtension);
    } else if (questionType === IQuestionnaireItemType.receiverComponent) {
        newQuestionnaireItem.type = IQuestionnaireItemType.choice;
        newQuestionnaireItem.code?.push(valueSetTqqcCoding);
        const receiverComponentExtension = createItemControlExtension(ItemControlType.receiverComponent);
        newQuestionnaireItem.extension?.push(receiverComponentExtension);
        newQuestionnaireItem.text = recipientComponentText;
        newQuestionnaireItem.answerValueSet = 'http://helsenorge.no/fhir/ValueSet/adresser';
        newQuestionnaireItem.required = true;
    } else if (questionType === IQuestionnaireItemType.boolean) {
        newQuestionnaireItem.type = IQuestionnaireItemType.boolean;
    } else if (questionType === IQuestionnaireItemType.choice) {
        newQuestionnaireItem.type = IQuestionnaireItemType.choice;
        const system = createUriUUID();
        newQuestionnaireItem.answerOption = [createNewAnswerOption(system), createNewAnswerOption(system)];
    } else if (questionType === IQuestionnaireItemType.date) {
        newQuestionnaireItem.type = IQuestionnaireItemType.date;
    } else if (questionType === IQuestionnaireItemType.dateTime) {
        newQuestionnaireItem.type = IQuestionnaireItemType.dateTime;
    } else if (questionType === IQuestionnaireItemType.decimal) {
        newQuestionnaireItem.type = IQuestionnaireItemType.decimal;
    } else if (questionType === IQuestionnaireItemType.display) {
        newQuestionnaireItem.type = IQuestionnaireItemType.display;
    } else if (questionType === IQuestionnaireItemType.inline) {
        newQuestionnaireItem.type = IQuestionnaireItemType.text;
        const inlineExtension = createItemControlExtension(ItemControlType.inline);
        newQuestionnaireItem.extension?.push(inlineExtension);
        newQuestionnaireItem.item?.push(createInlineItem());
    } else if (questionType === IQuestionnaireItemType.integer) {
        newQuestionnaireItem.type = IQuestionnaireItemType.integer;
    } else if (questionType === IQuestionnaireItemType.openChoice) {
        newQuestionnaireItem.type = IQuestionnaireItemType.openChoice;
        const system = createUriUUID();
        newQuestionnaireItem.answerOption = [createNewAnswerOption(system), createNewAnswerOption(system)];
    } else if (questionType === IQuestionnaireItemType.quantity) {
        newQuestionnaireItem.type = IQuestionnaireItemType.quantity;
    } else if (questionType === IQuestionnaireItemType.string) {
        newQuestionnaireItem.type = IQuestionnaireItemType.string;
    } else if (questionType === IQuestionnaireItemType.text) {
        newQuestionnaireItem.type = IQuestionnaireItemType.text;
    } else if (questionType === IQuestionnaireItemType.time) {
        newQuestionnaireItem.type = IQuestionnaireItemType.time;
    }

    return newQuestionnaireItem;
};

export const canTypeBeValidated = (item: QuestionnaireItem): boolean => {
    const itemType = item.type as IQuestionnaireItemType;
    return (
        [
            IQuestionnaireItemType.attachment,
            IQuestionnaireItemType.integer,
            IQuestionnaireItemType.decimal,
            IQuestionnaireItemType.quantity,
            IQuestionnaireItemType.text,
            IQuestionnaireItemType.string,
            IQuestionnaireItemType.date,
            IQuestionnaireItemType.dateTime,
        ].includes(itemType) && !isItemControlInline(item)
    );
};

export const canTypeHaveSublabel = (item: QuestionnaireItem): boolean => {
    return (
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlReceiverComponent(item) &&
        item.type !== IQuestionnaireItemType.group &&
        item.type !== IQuestionnaireItemType.display &&
        item.type !== IQuestionnaireItemType.boolean
    );
};

export const canTypeBeRequired = (item: QuestionnaireItem): boolean => {
    return (
        item.type !== IQuestionnaireItemType.group &&
        item.type !== IQuestionnaireItemType.display &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlReceiverComponent(item)
    );
};

export const canTypeBeHighlight = (item: QuestionnaireItem): boolean => {
    return item.type === IQuestionnaireItemType.display || isItemControlHighlight(item);
};

export const canTypeBeBeriket = (item: QuestionnaireItem): boolean => {
    return (
        (item.type === IQuestionnaireItemType.string ||
            item.type === IQuestionnaireItemType.text ||
            item.type === IQuestionnaireItemType.boolean ||
            item.type === IQuestionnaireItemType.quantity ||
            item.type === IQuestionnaireItemType.integer ||
            item.type === IQuestionnaireItemType.decimal ||
            item.type === IQuestionnaireItemType.date ||
            item.type === IQuestionnaireItemType.dateTime ||
            item.type === IQuestionnaireItemType.time) &&
        !isItemControlInline(item)
    );
};

export const canTypeHaveHelp = (item: QuestionnaireItem): boolean => {
    return item.type !== IQuestionnaireItemType.display && !isItemControlInline(item) && !isItemControlHighlight(item);
};

export const canTypeHaveSummary = (item: QuestionnaireItem): boolean => {
    return item.type === IQuestionnaireItemType.group;
};

export const canTypeHavePrefix = (item: QuestionnaireItem): boolean => {
    return item.type !== IQuestionnaireItemType.display && !isItemControlInline(item) && !isItemControlHighlight(item);
};

export const canTypeHaveChoiceRender = (item: QuestionnaireItem): boolean => {
    return item.type === IQuestionnaireItemType.choice || item.type === IQuestionnaireItemType.openChoice;
};

export const canTypeHaveInitialValue = (item: QuestionnaireItem): boolean => {
    return (
        item.type !== IQuestionnaireItemType.display &&
        item.type !== IQuestionnaireItemType.group &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlReceiverComponent(item)
    );
};

export const canTypeBeReadonly = (item: QuestionnaireItem): boolean => {
    return (
        item.type !== IQuestionnaireItemType.display &&
        item.type !== IQuestionnaireItemType.group &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlReceiverComponent(item)
    );
};

export const canTypeBeRepeatable = (item: QuestionnaireItem): boolean => {
    return (
        item.type !== IQuestionnaireItemType.display &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlReceiverComponent(item)
    );
};

export const canTypeHaveCalculatedExpressionExtension = (item: QuestionnaireItem): boolean => {
    return (
        item.type === IQuestionnaireItemType.integer ||
        item.type === IQuestionnaireItemType.decimal ||
        item.type === IQuestionnaireItemType.quantity
    );
};

export const canTypeHavePlaceholderText = (item: QuestionnaireItem): boolean => {
    return (
        (item.type === IQuestionnaireItemType.string || item.type === IQuestionnaireItemType.text) &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item)
    );
};

export const canTypeHaveChildren = (item: QuestionnaireItem): boolean => {
    return (
        item.type !== IQuestionnaireItemType.display &&
        !isItemControlInline(item) &&
        !isItemControlHighlight(item) &&
        !isItemControlReceiverComponent(item)
    );
};

export const canTypeCopyData = (item: QuestionnaireItem): boolean => {
    return (
        item.type !== IQuestionnaireItemType.display &&
        item.type !== IQuestionnaireItemType.group &&
        item.type !== IQuestionnaireItemType.attachment &&
        !isItemControlReceiverComponent(item) &&
        !isRecipientList(item)
    );
};

export const getItemDisplayType = (item: QuestionnaireItem): string => {
    if (isItemControlReceiverComponent(item)) {
        return 'Recipient component';
    } else if (isRecipientList(item)) {
        return 'Recipient list';
    } else if (
        isItemControlInline(item) ||
        isItemControlHighlight(item) ||
        item.type === IQuestionnaireItemType.display
    ) {
        return 'Information text';
    } else if (item.type === IQuestionnaireItemType.string || item.type === IQuestionnaireItemType.text) {
        return 'Text';
    } else if (item.type === IQuestionnaireItemType.group) {
        return 'Group';
    } else if (item.type === IQuestionnaireItemType.date || item.type === IQuestionnaireItemType.dateTime) {
        return 'Date';
    } else if (item.type === IQuestionnaireItemType.time) {
        return 'Time';
    } else if (item.type === IQuestionnaireItemType.attachment) {
        return 'Attachment';
    } else if (item.type === IQuestionnaireItemType.boolean) {
        return 'Confirmation';
    } else if (item.type === IQuestionnaireItemType.choice || item.type === IQuestionnaireItemType.openChoice) {
        return 'Choice';
    } else if (
        item.type === IQuestionnaireItemType.decimal ||
        item.type === IQuestionnaireItemType.integer ||
        item.type === IQuestionnaireItemType.quantity
    ) {
        return 'Number';
    }

    return '';
};
