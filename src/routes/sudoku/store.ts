import { writable } from "svelte/store";
import type { Puzzle, Settings, Location } from "./types";

const initialData =
  "351002804409831520000049100108396405006100080003284910600005000000760200704000000";
const solutionData =
  "351672894469831527287549163128396475946157382573284916692415738815763249734928651";

function setPuzzleData(initialPuzzle: string, solution: string) {
  const hash: Puzzle = {};
  for (let idx = 0; idx < initialPuzzle.length; idx++) {
    const hasEmptyValue = initialPuzzle[idx] === "." || initialPuzzle[idx] === "0";
    const initialValue = !hasEmptyValue ? initialPuzzle[idx] : "";
    hash[idx] = {
      initialValue,
      value: initialValue,
      solution: solution[idx],
      notes: {},
    };
  }
  return hash;
}

const puzzle: Puzzle = setPuzzleData(initialData, solutionData);

const settings: Settings = {
  timer: false,
  highlightErrors: true,
  highlightErrorsOnNotes: true,
  highlightEqualNumber: true,
  highlightNotes: true, // background on notes when number is selected
  highlightRegion: true,
  errorLimit: false,
};

const location: Location = {
  row: 1,
  column: 1,
  block: 1,
  idx: 0,
  item: puzzle[0],
};

const store = writable({
  puzzle,
  settings,
  location,
  areNotesActive: false,
});

export function updateLocation(newLocation: Location) {
  store.update((store) => ({ ...store, location: newLocation }));
}

export function updatePuzzle(value: string, areNotesActive: boolean = false) {
  store.update((store) => {
    const idx = store.location?.idx || 0;
    const updatedItem = areNotesActive
      ? { ...store.puzzle[idx], notes: { ...store.puzzle[idx].notes, [value]: true } }
      : { ...store.puzzle[idx], notes: {}, value };
    return {
      ...store,
      location: {
        ...store.location,
        item: updatedItem,
      },
      puzzle: {
        ...store.puzzle,
        [idx]: updatedItem,
      },
    };
  });
}

export function updateAreNotesActive(value: boolean) {
  store.update((store) => ({ ...store, areNotesActive: value }));
}

export default store;
