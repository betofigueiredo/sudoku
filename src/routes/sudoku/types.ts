export type PuzzleItem = {
  idx?: number;
  row?: number;
  column?: number;
  block?: number;
  initialValue?: string;
  value?: string;
  solution?: string;
  notes: { [k: string]: boolean };
};

export type Puzzle = PuzzleItem[];

export type Settings = {
  timer?: boolean;
  areNotesActive?: boolean;
  highlightErrors?: boolean;
  highlightErrorsOnNotes?: boolean;
  highlightEqualNumbers?: boolean;
  highlightNotes?: boolean;
  highlightRegion?: boolean;
  errorLimit?: boolean;
};
