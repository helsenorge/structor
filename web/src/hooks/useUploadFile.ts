import { useCallback, useContext, useRef, useState } from "react";

import { mapToTreeState } from "src/helpers/FhirToTreeStateMapper";
import { saveQuestionnaire } from "src/store/treeStore/indexedDbHelper";
import { resetQuestionnaireAction } from "src/store/treeStore/treeActions";
import { TreeContext } from "src/store/treeStore/treeStore";

export interface UseUploadFileOptions {
  /**
   * If provided, will be called after the form is imported,
   * @optional
   * @param newFormId - The id of the newly created form.
   */
  onUploadComplete?: (newFormId: string) => void;
}
export const useUploadFile = (
  /**
   * The options for the upload file hook.
   * @default {}
   * @param options: UseUploadFileOptions - The options for the upload file hook.
   */
  options: UseUploadFileOptions = {},
): {
  uploadQuestionnaire: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
  uploadRef: React.RefObject<HTMLInputElement>;
  error: string | null;
} => {
  const { onUploadComplete } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const uploadRef = useRef<HTMLInputElement>(null);
  const { dispatch } = useContext(TreeContext);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);
      setIsLoading(true);
      try {
        const raw = await file.text();
        const payload = JSON.parse(raw);
        const importedState = { ...mapToTreeState(payload), isEdited: true };
        dispatch(resetQuestionnaireAction(importedState));

        await saveQuestionnaire(importedState);
        const newId = importedState.qMetadata.id;
        if (onUploadComplete && newId) {
          onUploadComplete(newId);
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("Failed to import questionnaire:", err);
        setError(
          "Failed to import questionnaire. Please check the file format.",
        );
      } finally {
        // always reset loading + clear input
        setIsLoading(false);
        if (uploadRef.current) uploadRef.current.value = "";
      }
    },
    [dispatch, onUploadComplete],
  );

  const uploadQuestionnaire = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };
  return { uploadQuestionnaire, isLoading, uploadRef, error };
};
