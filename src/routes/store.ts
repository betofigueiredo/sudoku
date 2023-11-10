import { writable } from "svelte/store";
import type { Settings, PuzzleItem } from "./types";
import { calcRowColumnBlock } from "./helpers";
import Sudoku from "$lib/sudoku/sudoku";

function setPuzzleData(difficulty: string): PuzzleItem[] {
  const sudoku = new Sudoku();
  sudoku.initialize();
  const board = sudoku.generate(difficulty, true);
  const initialPuzzle = board;
  const solution = sudoku.solve(board, false);
  const result = [];
  for (let idx = 0; idx < initialPuzzle.length; idx++) {
    const hasEmptyValue = initialPuzzle[idx] === "." || initialPuzzle[idx] === "0";
    const initialValue = !hasEmptyValue ? initialPuzzle[idx] : "";
    const { row, column, block } = calcRowColumnBlock(idx);
    result.push({
      idx,
      row,
      column,
      block,
      initialValue,
      value: initialValue,
      solution: solution[idx],
      notes: {},
    });
  }
  return result;
}

function checkFinish() {
  store.update((store) => {
    let isFinished = true;
    for (let idx = 0; idx < store.puzzle.length; idx++) {
      if (store.puzzle[idx].value === "") {
        isFinished = false;
        break;
      }
      if (store.puzzle[idx].value !== store.puzzle[idx].solution) {
        isFinished = false;
        break;
      }
    }
    store.isFinished = isFinished;
    store.settings.timer = !isFinished;
    return store;
  });
}

const settings: Settings = {
  difficulty: "easy",
  timer: true,
  areNotesActive: false,
  highlightErrors: true,
  highlightErrorsOnNotes: true,
  highlightEqualNumbers: true,
  highlightNotes: true,
  highlightRegion: true,
  errorLimit: false,
};

const puzzle: PuzzleItem[] = [];
const selectedItem: PuzzleItem = { notes: {} };
const undoItems: PuzzleItem[] = [];
const isFinished: boolean = false;

const store = writable({
  isCreatingPuzzle: true,
  puzzle,
  settings,
  selectedItem,
  undoItems,
  isFinished,
});

function deleteValuesAndNotes() {
  store.update((store) => {
    const idx = store.selectedItem?.idx || 0;
    store.puzzle[idx].value = "";
    store.puzzle[idx].notes = {};
    store.selectedItem = store.puzzle[idx];
    return store;
  });
}

function clearNotesOnSameLocation(value: string) {
  store.update((store) => {
    const idx = store.selectedItem?.idx || 0;
    for (let i = 0; i < store.puzzle.length; i++) {
      const isSameLocation =
        store.puzzle[i].row === store.puzzle[idx].row ||
        store.puzzle[i].column === store.puzzle[idx].column ||
        store.puzzle[i].block === store.puzzle[idx].block;
      if (store.puzzle[i].notes[value] && isSameLocation) {
        store.puzzle[i].notes[value] = false;
      }
    }
    return store;
  });
}

function updateValues(value: string) {
  store.update((store) => {
    const idx = store.selectedItem?.idx || 0;
    const currentValue = store.puzzle[idx].value;
    const isSameValue = currentValue === value;
    const newValue = isSameValue ? "" : value;
    store.undoItems.push({
      ...store.selectedItem,
      notes: { ...store.selectedItem.notes },
    });
    store.puzzle[idx].value = newValue;
    // store.puzzle[idx].notes = {};
    store.selectedItem = store.puzzle[idx];
    return store;
  });
  clearNotesOnSameLocation(value);
}

function updateNotes(value: string) {
  store.update((store) => {
    const idx = store.selectedItem?.idx || 0;
    const isSameNote = store.puzzle[idx]?.notes[value];
    const newNote = !isSameNote;
    store.undoItems.push({
      ...store.selectedItem,
      notes: { ...store.selectedItem.notes },
    });
    store.puzzle[idx].notes[value] = newNote;
    store.selectedItem = store.puzzle[idx];
    return store;
  });
}

export function updatePuzzle(
  value: string,
  toDelete: boolean = false,
  areNotesActive: boolean = false,
) {
  if (toDelete) {
    return deleteValuesAndNotes();
  }
  if (areNotesActive) {
    return updateNotes(value);
  }
  updateValues(value);
  checkFinish();
}

export function updateSelectedItem(newItem: PuzzleItem) {
  store.update((store) => {
    store.selectedItem = newItem;
    return store;
  });
}
export function updateAreNotesActive(value: boolean) {
  store.update((store) => {
    store.settings.areNotesActive = value;
    return store;
  });
}

export function updateSettings(key: keyof Settings, value: string | boolean) {
  store.update((store) => {
    store.settings[key] = value as never;
    return store;
  });
}

export function clearPuzzle() {
  store.update((store) => {
    store.puzzle = [];
    store.selectedItem = { notes: {} };
    store.isCreatingPuzzle = true;
    return store;
  });
}

export function initPuzzle(difficulty: string) {
  const puzzle = setPuzzleData(difficulty);
  store.update((store) => {
    store.puzzle = puzzle;
    store.selectedItem = puzzle[0];
    store.isCreatingPuzzle = false;
    store.isFinished = false;
    store.settings.difficulty = difficulty;
    return store;
  });
}

export function undoLastAction() {
  store.update((store) => {
    if (!store.undoItems.length) return store;
    const lastItem = store.undoItems.pop();
    const idx = lastItem?.idx || 0;
    store.puzzle[idx].value = lastItem?.value;
    store.puzzle[idx].notes = lastItem?.notes || {};
    store.selectedItem = store.puzzle[idx];
    return store;
  });
}

export default store;
