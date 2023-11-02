<script lang="ts">
  import store, { updatePuzzle } from "./store";
  import type { Location, Puzzle } from "./types";
  import NumberButton from "./NumberButton.svelte";

  let puzzle: Puzzle = {};
  let location: Location = {};

  store.subscribe((store) => {
    puzzle = store.puzzle;
    location = store.location;
  });

  let undo = []; // TODO
  let time = []; // TODO
  let areNotesActive = false;

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

    const newValue =
      event.key === "Delete" || event.key === "Backspace" ? "." : event.key;
    updatePuzzle(newValue);
  }

  const puzzleKeys = Object.keys(puzzle).map(Number);
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="container">
  <div class="grid grid-cols-9 w-[504px]">
    {#each puzzleKeys as key}
      <NumberButton item={puzzle[key]} idx={key} />
    {/each}
  </div>
</div>
