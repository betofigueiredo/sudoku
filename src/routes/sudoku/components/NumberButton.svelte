<script lang="ts">
  import store, { updatePuzzle } from "../store";
  import type { PuzzleItem } from "../types";

  let areNotesActive: boolean | undefined = false;
  let selectedItem: PuzzleItem = { notes: {} };
  export let key: string;

  store.subscribe((store) => {
    selectedItem = store.selectedItem;
    areNotesActive = store.settings.areNotesActive;
  });

  function onClick(event: Event) {
    const isLocked = selectedItem?.initialValue !== "";
    if (isLocked) return;
    updatePuzzle(key, false, areNotesActive);
  }
</script>

<button
  class="w-[110px] h-[110px] text-5xl font-light flex justify-center items-center bg-[#dcdcdc] rounded-md hover:bg-[#cfdddb] active:bg-[#bfddd9]"
  on:click={onClick}
>
  {key}
</button>
