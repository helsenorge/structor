import { UpdateFormMetaAction, UpdateActionTypes } from './ActionTypes';
import { State } from './FormStore';

export default function UpdateActions(draft: State, action: UpdateFormMetaAction): void {
    switch (action.type) {
        case UpdateActionTypes.UPDATE_FORM_META:
            if (action.title !== undefined) draft.title = action.title;
            if (action.description !== undefined) draft.description = action.description;
            break;
    }
}
