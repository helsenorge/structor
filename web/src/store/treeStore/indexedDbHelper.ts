import { IDBPDatabase, openDB } from 'idb';
import { TreeState } from './treeStore';

const DATABASE_NAME = 'structor-db';
const STORE_NAME = 'questionnaire-store';
const QUESTIONNAIRE_STORE_ID = 1;

const initializeDb = async (): Promise<IDBPDatabase> => {
    try {
        return await openDB(DATABASE_NAME, 1, {
            upgrade(db: IDBPDatabase) {
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME, { autoIncrement: false });
                }
            },
        });
    } catch (error) {
        console.error(error);
        return Promise.reject('Unable to initialize IndexedDB');
    }
};

export const saveStateToDb = async (state: TreeState): Promise<IDBValidKey> => {
    const database = await initializeDb();
    if (database) {
        const transaction = database.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);
        const result = await objectStore.put(state, QUESTIONNAIRE_STORE_ID);
        await transaction.done;
        database.close();
        return result;
    }
    return Promise.reject('Not storing to IndexedDB because database is not initialized');
};

export const getStateFromDb = async (): Promise<TreeState> => {
    const database = await initializeDb();
    if (database) {
        const transaction = database.transaction(STORE_NAME, 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);
        const result = await objectStore.get(QUESTIONNAIRE_STORE_ID);
        await transaction.done;
        database.close();
        return result;
    }
    return Promise.reject('No questionnaire found in IndexedDB');
};
