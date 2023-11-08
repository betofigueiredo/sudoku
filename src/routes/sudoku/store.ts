import { writable } from "svelte/store";
import type { Settings, PuzzleItem } from "./types";
import { calcRowColumnBlock } from "./helpers";
import Sudoku from "$lib/sudoku/sudoku";

// const initialData =
//   "351002804409831520000049100108396405006100080003284910600005000000760200704000000";
// const solutionData =
//   "351672894469831527287549163128396475946157382573284916692415738815763249734928651";

function setPuzzleData(): PuzzleItem[] {
  const sudoku = new Sudoku();
  sudoku.initialize();
  const board = sudoku.generate("medium", true);
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

const puzzle: PuzzleItem[] = [];

const settings: Settings = {
  timer: false,
  areNotesActive: false,
  highlightErrors: true,
  highlightErrorsOnNotes: true,
  highlightEqualNumbers: true,
  highlightNotes: true,
  highlightRegion: true,
  errorLimit: false,
};

const selectedItem: PuzzleItem = { notes: {} };

const store = writable({
  isCreatingPuzzle: true,
  puzzle,
  settings,
  selectedItem,
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

export function updateSettings(key: keyof Settings, value: boolean) {
  store.update((store) => {
    store.settings[key] = value;
    return store;
  });
}

export function initPuzzle() {
  const puzzle = setPuzzleData();
  store.update((store) => {
    store.puzzle = puzzle;
    store.selectedItem = puzzle[0];
    store.isCreatingPuzzle = false;
    return store;
  });
}

export default store;
