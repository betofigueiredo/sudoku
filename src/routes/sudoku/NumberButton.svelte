<script lang="ts">
  import store, { updateLocation } from "./store";
  import type { Location, PuzzleItem, Settings } from "./types";
  import { calcRowColumnBlock } from "./helpers";
  import Note from "./Note.svelte";

  let settings: Settings = {};
  let location: Location = {};

  store.subscribe((store) => {
    settings = store.settings;
    location = store.location;
  });

  export let item: PuzzleItem;
  export let idx: number;

  const { row, column, block } = calcRowColumnBlock(idx);

  function getBorder() {
    let border = " border-l border-gray-300";
    if ((idx + 0) % 3 === 0) border += " border-l-2 border-l-black";
    if ((idx + 1) % 9 === 0) border += " border-r-2 border-r-black";
    if (idx % 9 === 0) border += " border-l-2 border-l-black";
    if (idx < 9) border += " border-t-2 border-t-black";
    if (idx > 71) {
      border += " border-b-2 border-b-black";
    } else if (idx >= 18 && idx <= 26) {
      border += " border-b-2 border-b-black";
    } else if (idx >= 45 && idx <= 53) {
      border += " border-b-2 border-b-black";
    } else {
      border += " border-b";
    }
    return border;
  }

  function getBackground() {
    const isLocationSelected =
      row === location.row || column === location.column || block === location.block;
    const isItemSelected =
      row === location.row && column === location.column && block === location.block;
    const isSameSelectedValue = item.value === location?.item?.value && item.value !== "";
    let background = " bg-white";
    if (isLocationSelected) background = " bg-[#f3f3f4]";
    if (isSameSelectedValue) background = " bg-[#cfdddb]";
    if (isItemSelected) background = " bg-[#bfddd9]";
    return background;
  }

  function getColor() {
    const isWrongNumber = item.value !== "" && item.value !== item.solution;
    const hasError = isWrongNumber && settings.highlightErrors;
    const isInitialValue = item.initialValue !== "";
    const normalColor = isInitialValue ? " text-gray-900" : " text-blue-800";
    return hasError ? " text-red-600" : normalColor;
  }

  function onClick() {
    updateLocation({ row, column, block, idx, item });
  }

  const border = getBorder();
  $: background = item && location ? getBackground() : "";
  $: color = item ? getColor() : "";

  $: notes = Object.keys(item?.notes).filter((key) => item?.notes[key] === true);
</script>

<button
  class={`relative w-14 h-14 outline-0 font-light text-4xl ${border} ${background} ${color}`}
  on:click={onClick}
>
  {#if item.value}
    {item.value}
  {:else}
    {#each notes as note}
      <Note {note} />
    {/each}
  {/if}
</button>
