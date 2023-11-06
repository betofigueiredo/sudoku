<script lang="ts">
  import store, { updatePuzzle, updateSelectedItem } from "./store";
  import type { PuzzleItem } from "./types";
  import NumberButton from "./NumberButton.svelte";
  import Settings from "./Settings.svelte";

  let puzzle: PuzzleItem[] = [];
  let selectedItem: PuzzleItem = { notes: {} };
  let areNotesActive: boolean | undefined = false;

  store.subscribe((store) => {
    puzzle = store.puzzle;
    selectedItem = store.selectedItem;
    areNotesActive = store.settings.areNotesActive;
  });

  function isNumber(char: string): boolean {
    return /^[0-9]+$/.test(char);
  }

  function moveWithArrows(eventKey: string) {
    const selectedItemIdx = selectedItem?.idx || 0;
    let newIdx = selectedItemIdx;
    switch (eventKey) {
      case "ArrowUp":
        newIdx = selectedItemIdx - 9 < 0 ? selectedItemIdx : selectedItemIdx - 9;
        break;
      case "ArrowRight":
        newIdx = selectedItemIdx + 1 > 80 ? selectedItemIdx : selectedItemIdx + 1;
        break;
      case "ArrowDown":
        newIdx = selectedItemIdx + 9 > 80 ? selectedItemIdx : selectedItemIdx + 9;
        break;
      case "ArrowLeft":
        newIdx = selectedItemIdx - 1 < 0 ? selectedItemIdx : selectedItemIdx - 1;
      default:
    }
    updateSelectedItem(puzzle[newIdx]);
  }

  function updateValues(eventKey: string, item: PuzzleItem) {
    const isLocked = item?.initialValue !== "";
    if (isLocked) return;
    const toDelete = eventKey === "Delete" || eventKey === "Backspace";
    const newValue = eventKey;
    updatePuzzle(newValue, toDelete, areNotesActive);
  }

  function keydown(event: KeyboardEvent) {
    const item = puzzle[selectedItem?.idx || 0];
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    const validKeys = ["Delete", "Backspace", ...arrowKeys];
    const isValidKey = isNumber(event.key) || validKeys.includes(event.key);
    const noSelectedItem = selectedItem.idx === -1;

    if (!isValidKey || noSelectedItem) return;

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
