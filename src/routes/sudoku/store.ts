import { writable } from "svelte/store";
import type { Puzzle, Settings, Location } from "./types";

const initialData =
  "2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3";
const solutionData =
  "284375196739816254651942378476128539312594687598637412143769825965283741827451963";

function setPuzzleData(initialPuzzle: string, solution: string) {
  const hash: Puzzle = {};
  for (let idx = 0; idx < initialPuzzle.length; idx++) {
    const initialValue = initialPuzzle[idx] !== "." ? initialPuzzle[idx] : "";
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
  row: -1,
  column: -1,
  block: -1,
  idx: -1,
  item: undefined,
};

const store = writable({
  puzzle,
  settings,
  location,
});

export function updateLocation(newLocation: Location) {
  store.update((store) => ({
    ...store,
    location: newLocation,
  }));
}

export function updatePuzzle(value: string) {
  store.update((store) => {
    const idx = store.location?.idx || 0;
    return {
      ...store,
      puzzle: {
        ...store.puzzle,
        [idx]: { ...store.puzzle[idx], value },
      },
    };
  });
}

export default store;
