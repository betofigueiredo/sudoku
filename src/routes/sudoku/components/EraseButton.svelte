<script lang="ts">
  import store, { updatePuzzle } from "../store";
  import type { PuzzleItem } from "../types";
  import iconEraser from "$lib/images/icon-eraser.svg";
  import ControlButton from "./ControlButton.svelte";

  let selectedItem: PuzzleItem = { notes: {} };

  store.subscribe((store) => {
    selectedItem = store.selectedItem;
  });

  function onClick(event: Event) {
    const isLocked = selectedItem?.initialValue !== "";
    if (isLocked) return;
    updatePuzzle("", true);
  }
</script>

<ControlButton icon={iconEraser} label="Apagar" {onClick} />
