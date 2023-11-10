<script lang="ts">
  import store, { updatePuzzle } from "../store";
  import type { PuzzleItem } from "../types";

  let puzzle: PuzzleItem[] = [];
  let areNotesActive: boolean | undefined = false;
  let selectedItem: PuzzleItem = { notes: {} };
  export let key: string;

  store.subscribe((store) => {
    puzzle = store.puzzle;
    selectedItem = store.selectedItem;
    areNotesActive = store.settings.areNotesActive;
  });

  function onClick(event: Event) {
    const isLocked = selectedItem?.initialValue !== "";
    if (isLocked) return;
    updatePuzzle(key, false, areNotesActive);
  }

  function checkDisabled() {
    const result = [];
    for (let i = 0; i < puzzle.length; i++) {
      if (puzzle[i].value === key) {
        result.push(puzzle[i]);
      }
    }
    return result.length >= 9;
  }

  $: disabled = puzzle ? checkDisabled() : false;
</script>

<button
  class="w-[110px] h-[110px] text-5xl font-light flex justify-center items-center bg-[#dcdcdc] rounded-md hover:bg-[#cfdddb] active:bg-[#bfddd9] disabled:opacity-40"
  on:click={onClick}
  {disabled}
>
  {key}
</button>
