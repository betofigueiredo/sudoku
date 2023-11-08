import { writable } from "svelte/store";
import type { Settings, PuzzleItem } from "./types";
import { calcRowColumnBlock } from "./helpers";
import Sudoku from "$lib/sudoku/sudoku";

const sudoku = new Sudoku();
const board = sudoku.generate("hard", true);

const initialData = board;
const solutionData = sudoku.solve(board, false);

// const initialData =
//   "351002804409831520000049100108396405006100080003284910600005000000760200704000000";
// const solutionData =
//   "351672894469831527287549163128396475946157382573284916692415738815763249734928651";

function setPuzzleData(initialPuzzle: string, solution: string) {
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

const puzzle: PuzzleItem[] = setPuzzleData(initialData, solutionData);

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

const selectedItem: PuzzleItem = puzzle[0];

const store = writable({
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
    for (let i = 0; i < puzzle.length; i++) {
      const isSameLocation =
        puzzle[i].row === store.puzzle[idx].row ||
        puzzle[i].column === store.puzzle[idx].column ||
        puzzle[i].block === store.puzzle[idx].block;
      if (puzzle[i].notes[value] && isSameLocation) {
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

export default store;
