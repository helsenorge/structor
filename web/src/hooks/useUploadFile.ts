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
  uploadFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  uploadFiles: (event: React.ChangeEvent<HTMLInputElement>) => void;
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
        setError(
          "Failed to import questionnaire. Please check the file format.",
        );
      } finally {
        setIsLoading(false);
        if (uploadRef.current) uploadRef.current.value = "";
      }
    },
    [dispatch, onUploadComplete],
  );

  const uploadMultipleFiles = async (files: FileList | null): Promise<void> => {
    if (files && files.length > 0) {
      try {
        const filePromises = Array.from(files).map((file) => {
          const reader = new FileReader();
          return new Promise((resolve) => {
            reader.onload = (): void => resolve(reader.result);
            reader.onerror = (): void => {
              setError("Could not read uploaded file");
            };

            reader.readAsText(file);
          });
        });
        await Promise.all(filePromises);
      } catch (err) {
        setError("Failed to read files. Please check the file format.");
      } finally {
        setIsLoading(false);
        if (uploadRef.current) uploadRef.current.value = "";
      }
    }
  };
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
  };
  const uploadFiles = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const files = e.target.files;
    if (!files || files.length === 0) return Promise.resolve();
    setIsLoading(true);
    setError(null);
    return uploadMultipleFiles(files);
  };
  return { uploadFile, uploadFiles, isLoading, uploadRef, error };
};
