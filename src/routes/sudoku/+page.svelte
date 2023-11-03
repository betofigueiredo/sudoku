<script lang="ts">
  import store, { updatePuzzle } from "./store";
  import type { Location, Puzzle } from "./types";
  import NumberButton from "./NumberButton.svelte";
  import Settings from "./Settings.svelte";

  let puzzle: Puzzle = {};
  let location: Location = {};
  let areNotesActive: boolean = false;

  store.subscribe((store) => {
    puzzle = store.puzzle;
    location = store.location;
    areNotesActive = store.areNotesActive;
  });

  let undo = []; // TODO
  let time = []; // TODO

  function isNumber(char: string): boolean {
    return /^[0-9]+$/.test(char);
  }

  function keydown(event: KeyboardEvent) {
    const item = puzzle[location?.idx || 0];
    const isValidKey =
      isNumber(event.key) || event.key === "Delete" || event.key === "Backspace";
    const isLocked = item?.initialValue !== "" || item?.solution === item?.value;
    const noLocationSelected = location.idx === -1;

    if (!isValidKey || noLocationSelected || isLocked) {
      return;
    }

    // TODO delete notes
    const newValue = event.key === "Delete" || event.key === "Backspace" ? "" : event.key;
    updatePuzzle(newValue, areNotesActive);
  }

  const puzzleKeys = Object.keys(puzzle).map(Number);
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
  <title>Sudoku</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="container">
  <div class="grid grid-cols-9 w-[504px]">
    {#each puzzleKeys as key}
      <NumberButton item={puzzle[key]} idx={key} />
    {/each}
  </div>
  <div class="grid grid-cols-9">
    <Settings />
  </div>
</div>
