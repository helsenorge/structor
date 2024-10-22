import { IDBPDatabase, openDB, DBSchema } from "idb";

import { TreeState } from "./treeStore";

const DATABASE_NAME = "structor-db";
const STORE_NAME = "questionnaire-store";

interface StructorDB extends DBSchema {
  "questionnaire-store": {
    key: number;
    value: TreeState;
  };
}

const initializeDb = async (): Promise<IDBPDatabase<StructorDB>> => {
  try {
    return await openDB<StructorDB>(DATABASE_NAME, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_NAME);
      },
    });
  } catch (error) {
    return Promise.reject("Unable to initialize IndexedDB");
  }
};

export const saveStateToDb = async (state: TreeState): Promise<void> => {
  try {
    const database = await initializeDb();
    await database.put(STORE_NAME, state, 1);
  } catch (error) {
    return Promise.reject("Failed to save state to IndexedDB");
  }
};

export const getStateFromDb = async (): Promise<TreeState | undefined> => {
  try {
    const database = await initializeDb();
    const result = await database.get(STORE_NAME, 1);
    return result; // Will be undefined if not found
  } catch (error) {
    console.error("Failed to retrieve state from IndexedDB:", error);
    return undefined;
  }
};
