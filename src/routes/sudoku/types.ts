export type PuzzleItem = {
  initialValue: string;
  value: string;
  solution: string;
  notes: { [k: string]: boolean };
};

export type Puzzle = {
  [k: number]: PuzzleItem;
};

export type Settings = {
  timer?: boolean;
  highlightErrors?: boolean;
  highlightErrorsOnNotes?: boolean;
  highlightEqualNumber?: boolean;
  highlightNotes?: boolean;
  highlightRegion?: boolean;
  errorLimit?: boolean;
};

export type Location = {
  row?: number;
  column?: number;
  block?: number;
  idx?: number;
  item?: PuzzleItem;
};
