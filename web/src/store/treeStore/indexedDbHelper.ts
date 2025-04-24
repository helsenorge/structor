import { IDBPDatabase, openDB, DBSchema } from "idb";

import { TreeState } from "./treeStore";

const DATABASE_NAME = "structor-db";
const STORE_NAME = "questionnaire-store";

interface StructorDB extends DBSchema {
  "questionnaire-store": {
    key: string;
    value: TreeState & { lastModified: Date };
  };
}

let dbPromise: Promise<IDBPDatabase<StructorDB>> | null = null;
const getDatabase = (): Promise<IDBPDatabase<StructorDB>> => {
  if (!dbPromise) {
    dbPromise = openDB<StructorDB>(DATABASE_NAME, 3, {
      upgrade(db) {
        if (db.objectStoreNames.contains(STORE_NAME)) {
          db.deleteObjectStore(STORE_NAME);
        }
        db.createObjectStore(STORE_NAME, { keyPath: "qMetadata.id" });
      },
    }).catch((err) => {
      dbPromise = null;
      throw err;
    });
  }
  return dbPromise;
};

const initializeDb = async (): Promise<IDBPDatabase<StructorDB>> => {
  try {
    return await getDatabase();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[IndexedDB] Initialization error:", error);
    throw new Error("Unable to initialize IndexedDB");
  }
};

/**
 * Saves a questionnaire (TreeState) to the DB using the id in qMetadata.
 * If the state already exists, it will update the record.
 * Returns the GUID used as the key.
 */
export const saveQuestionnaire = async (state: TreeState): Promise<string> => {
  try {
    const database = await initializeDb();
    if (!state.qMetadata.id) {
      throw new Error("State does not have a valid id in qMetadata.id");
    }
    await database.put(STORE_NAME, { ...state, lastModified: new Date() });

    return state.qMetadata.id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[IndexedDB] Save error:", error);
    throw new Error("Failed to save questionnaire to IndexedDB");
  }
};

/**
 * Retrieves a questionnaire by its GUID.
 */
export const getQuestionnaire = async (
  id?: string,
): Promise<TreeState | undefined> => {
  if (!id) {
    return;
  }
  try {
    const database = await initializeDb();
    return await database.get(STORE_NAME, id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[IndexedDB] Retrieval error:", error);
    return undefined;
  }
};

/**
 * Retrieves all questionnaires stored in the DB.
 */
export const getAllQuestionnaires = async (
  pruneNew: boolean = false,
): Promise<TreeState[]> => {
  try {
    const database = await initializeDb();
    const results = await database.getAll(STORE_NAME);
    if (pruneNew) {
      const notEdited = results.filter((r) => !r.isEdited && r.qMetadata.id);
      const toBeDeleted = notEdited.map((item) =>
        deleteQuestionnaire(item.qMetadata.id!),
      );
      await Promise.all(toBeDeleted);
      return results.filter((r) => r.isEdited);
    }
    return results;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[IndexedDB] Retrieval error:", error);
    return [];
  }
};

/**
 * Deletes a questionnaire from the DB by its GUID.
 */
export const deleteQuestionnaire = async (id: string): Promise<void> => {
  try {
    const database = await initializeDb();
    await database.delete(STORE_NAME, id);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("[IndexedDB] Deletion error:", error);
    throw new Error("Failed to delete questionnaire from IndexedDB");
  }
};
