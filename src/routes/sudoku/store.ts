import { writable } from "svelte/store";
import type { Settings, PuzzleItem } from "./types";
import { calcRowColumnBlock } from "./helpers";

const initialData =
  "351002804409831520000049100108396405006100080003284910600005000000760200704000000";
const solutionData =
  "351672894469831527287549163128396475946157382573284916692415738815763249734928651";

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
  highlightEqualNumber: true,
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
  toDelete: boolean,
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

export default store;
