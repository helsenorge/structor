import { AnswerTypes } from "./IAnswer";

export default interface JSONQuestion {
    linkId: string; // sectionId.newId
    text: string; // question text
    type: AnswerTypes; // display | boolean | decimal | integer | date | dateTime
    required: boolean; // true | false TODO
    repeats: boolean; // TODO
    readOnly: boolean; // TODO
    options: {
        reference: string; // with a hashtag in front. TODO: Add valuesetID
    };
}
