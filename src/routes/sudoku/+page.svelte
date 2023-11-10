<script lang="ts">
  import { browser } from "$app/environment";
  import store, { updatePuzzle, updateSelectedItem, initPuzzle } from "./store";
  import type { PuzzleItem } from "./types";
  import PuzzleNumber from "./components/PuzzleNumber.svelte";
  import Settings from "./components/Settings.svelte";
  import NumberButton from "./components/NumberButton.svelte";
  import UndoButton from "./components/UndoButton.svelte";
  import EraseButton from "./components/EraseButton.svelte";
  import ActiveNotesButton from "./components/ActiveNotesButton.svelte";
  import ActiveAdvancedNotesButton from "./components/ActiveAdvancedNotesButton.svelte";
  import NewBoardButton from "./components/NewBoardButton.svelte";

  let isCreatingPuzzle: boolean = true;
  let puzzle: PuzzleItem[] = [];
  let selectedItem: PuzzleItem = { notes: {} };
  let areNotesActive: boolean | undefined = false;
  let isFinished: boolean | undefined = false;

  store.subscribe((store) => {
    isCreatingPuzzle = store.isCreatingPuzzle;
    puzzle = store.puzzle;
    selectedItem = store.selectedItem;
    areNotesActive = store.settings.areNotesActive;
    isFinished = store.isFinished;
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

  function updateValues(eventKey: string) {
    const isLocked = selectedItem?.initialValue !== "";
    if (isLocked) return;
    const toDelete = eventKey === "Delete" || eventKey === "Backspace";
    const newValue = eventKey;
    updatePuzzle(newValue, toDelete, areNotesActive);
  }

  function keydown(event: KeyboardEvent) {
    const arrowKeys = ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"];
    const validKeys = ["Delete", "Backspace", ...arrowKeys];
    const isValidKey = isNumber(event.key) || validKeys.includes(event.key);
    const noSelectedItem = selectedItem.idx === -1;

    if (!isValidKey || noSelectedItem) return;

    return arrowKeys.includes(event.key)
      ? moveWithArrows(event.key)
      : updateValues(event.key);
  }

  if (browser) {
    initPuzzle("easy");
  }

  const puzzleKeys = Object.keys(puzzle).map(Number);
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
  <title>Sudoku</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="container">
  <div class="grid grid-cols-2 gap-20 mb-4">
    <div>
      Difficulty:&nbsp;&nbsp;
      <NewBoardButton label="Easy" />
      <NewBoardButton label="Medium" />
      <NewBoardButton label="Hard" />
      <NewBoardButton label="Expert" />
      <NewBoardButton label="Master" />
    </div>
    <Settings />
  </div>
  <div class="grid grid-cols-2 gap-20">
    <div class="grid grid-cols-9 w-[504px]">
      {#if !isCreatingPuzzle && !isFinished}
        {#each puzzleKeys as key}
          <PuzzleNumber item={puzzle[key]} idx={key} />
        {/each}
      {/if}
      {#if isFinished}
        <div
          class="w-[504px] h-[504px] bg-[#cfdddb] rounded-md flex justify-center items-center"
        >
          <h2 class="text-2xl">Congratulations!!!</h2>
        </div>
      {/if}
    </div>
    <div>
      <div class="grid grid-cols-4 gap-4 w-[358px] tracking-wide mb-5">
        <UndoButton />
        <EraseButton />
        <ActiveNotesButton />
        <ActiveAdvancedNotesButton />
      </div>
      <div class="grid grid-cols-3 gap-3 w-[356px]">
        {#each ["1", "2", "3", "4", "5", "6", "7", "8", "9"] as key}
          <NumberButton {key} />
        {/each}
      </div>
    </div>
  </div>
</div>
