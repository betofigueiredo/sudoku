<script lang="ts">
  import store, { updatePuzzle, updateLocation } from "./store";
  import type { Location, Puzzle, PuzzleItem } from "./types";
  import { calcRowColumnBlock } from "./helpers";
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

  function moveWithArrows(eventKey: string) {
    const locationIdx = location?.idx || 0;
    let newIdx = locationIdx;
    switch (eventKey) {
      case "ArrowUp":
        newIdx = locationIdx - 9 < 0 ? locationIdx : locationIdx - 9;
        break;
      case "ArrowDown":
        newIdx = locationIdx + 9 > 80 ? locationIdx : locationIdx + 9;
        break;
      case "ArrowRight":
        newIdx = locationIdx + 1 > 80 ? locationIdx : locationIdx + 1;
        break;
      case "ArrowLeft":
        newIdx = locationIdx - 1 < 0 ? locationIdx : locationIdx - 1;
      default:
    }
    const { row, column, block } = calcRowColumnBlock(newIdx);
    updateLocation({ row, column, block, idx: newIdx, item: puzzle[newIdx] });
  }

  function updateValues(eventKey: string, item: PuzzleItem) {
    // TODO delete notes
    const isLocked = item?.initialValue !== "" || item?.solution === item?.value;
    if (isLocked) return;
    const newValue = eventKey === "Delete" || eventKey === "Backspace" ? "" : eventKey;
    updatePuzzle(newValue, areNotesActive);
  }

  function keydown(event: KeyboardEvent) {
    const item = puzzle[location?.idx || 0];
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    const validKeys = ["Delete", "Backspace", ...arrowKeys];
    const isValidKey = isNumber(event.key) || validKeys.includes(event.key);
    const noLocationSelected = location.idx === -1;

    if (!isValidKey || noLocationSelected) return;

    return arrowKeys.includes(event.key)
      ? moveWithArrows(event.key)
      : updateValues(event.key, item);
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
