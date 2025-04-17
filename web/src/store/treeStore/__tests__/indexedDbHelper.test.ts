// src/store/treeStore/indexedDbHelper.spec.ts
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import * as idb from "idb";
import {
  saveQuestionnaire,
  getQuestionnaire,
  getAllQuestionnaires,
  deleteQuestionnaire,
} from "../indexedDbHelper";
import { TreeState } from "../treeStore";

// ——— mock openDB from idb ———
vi.mock("idb");
const openDBMock = idb.openDB as unknown as Mock;

// a fake “IDBPDatabase” that we can spy on
const fakeDb: Partial<idb.IDBPDatabase<any>> = {
  put: vi.fn(),
  get: vi.fn(),
  getAll: vi.fn(),
  delete: vi.fn(),
};

beforeEach(() => {
  // reset the module‐level cache inside indexedDbHelper
  // so that dbPromise starts null
  vi.resetModules();

  // each test, openDB resolves to our fakeDb
  openDBMock.mockResolvedValue(fakeDb);

  // clear our spies
  (fakeDb.put as Mock).mockReset();
  (fakeDb.get as Mock).mockReset();
  (fakeDb.getAll as Mock).mockReset();
  (fakeDb.delete as Mock).mockReset();
});

describe("saveQuestionnaire", () => {
  it("writes and returns the id on success", async () => {
    const state = { qMetadata: { id: "abc" } } as TreeState;
    await expect(saveQuestionnaire(state)).resolves.toBe("abc");
    expect(fakeDb.put).toHaveBeenCalledWith("questionnaire-store", {
      ...state,
      lastModified: expect.any(Date),
    });
  });

  it("throws if id is falsy", async () => {
    await expect(
      saveQuestionnaire({ qMetadata: { id: "" } } as TreeState),
    ).rejects.toThrow("Failed to save questionnaire to IndexedDB");
    expect(fakeDb.put).not.toHaveBeenCalled();
  });

  it("catches underlying put() errors", async () => {
    (fakeDb.put as Mock).mockRejectedValueOnce(new Error("oops"));
    await expect(
      saveQuestionnaire({ qMetadata: { id: "xyz" } } as TreeState),
    ).rejects.toThrow("Failed to save questionnaire to IndexedDB");
    expect(fakeDb.put).toHaveBeenCalled();
  });
});

describe("getQuestionnaire", () => {
  it("returns undefined if no id provided", async () => {
    await expect(getQuestionnaire()).resolves.toBeUndefined();
  });

  it("retrieves the stored value", async () => {
    const stored = {
      qMetadata: { id: "foo" },
      foo: "bar",
    } as Partial<TreeState>;
    (fakeDb.get as Mock).mockResolvedValueOnce(stored);

    await expect(getQuestionnaire("foo")).resolves.toEqual(stored);
    expect(fakeDb.get).toHaveBeenCalledWith("questionnaire-store", "foo");
  });

  it("returns undefined on get() failure", async () => {
    (fakeDb.get as Mock).mockRejectedValueOnce(new Error("err"));
    await expect(getQuestionnaire("nope")).resolves.toBeUndefined();
  });
});

describe("getAllQuestionnaires", () => {
  const items = [
    { qMetadata: { id: "1" }, isEdited: false },
    { qMetadata: { id: "2" }, isEdited: true },
    { qMetadata: { id: undefined }, isEdited: false },
  ] as TreeState[];

  it("returns all when pruneNew is false", async () => {
    (fakeDb.getAll as Mock).mockResolvedValueOnce(items);
    await expect(getAllQuestionnaires(false)).resolves.toEqual(items);
    expect(fakeDb.getAll).toHaveBeenCalledWith("questionnaire-store");
  });

  it("prunes unedited and deletes them when pruneNew is true", async () => {
    (fakeDb.getAll as Mock).mockResolvedValueOnce(items);
    await expect(getAllQuestionnaires(true)).resolves.toEqual([
      { qMetadata: { id: "2" }, isEdited: true },
    ]);
    // should only delete id==='1'
    expect(fakeDb.delete).toHaveBeenCalledTimes(1);
    expect(fakeDb.delete).toHaveBeenCalledWith("questionnaire-store", "1");
  });

  it("returns empty array if getAll() throws", async () => {
    (fakeDb.getAll as Mock).mockRejectedValueOnce(new Error("fail"));
    await expect(getAllQuestionnaires()).resolves.toEqual([]);
  });
});

describe("deleteQuestionnaire", () => {
  it("deletes and resolves", async () => {
    await expect(deleteQuestionnaire("z")).resolves.toBeUndefined();
    expect(fakeDb.delete).toHaveBeenCalledWith("questionnaire-store", "z");
  });

  it("wraps delete() errors", async () => {
    (fakeDb.delete as Mock).mockRejectedValueOnce(new Error("bad"));
    await expect(deleteQuestionnaire("x")).rejects.toThrow(
      "Failed to delete questionnaire from IndexedDB",
    );
  });
});
