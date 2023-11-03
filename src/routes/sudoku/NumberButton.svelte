<script lang="ts">
  import store, { updateLocation } from "./store";
  import type { Location, PuzzleItem, Settings } from "./types";

  let settings: Settings = {};
  let location: Location = {};

  store.subscribe((store) => {
    settings = store.settings;
    location = store.location;
  });

  export let item: PuzzleItem;
  export let idx: number;

  const row = Math.floor(idx / 9) + 1;
  const column = (idx % 9) + 1;
  const block = (Math.floor(idx / 3) % 3) + Math.floor((row - 1) / 3) * 3 + 1;

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
</script>

<button
  class={`relative w-14 h-14 text-3xl ${border} ${background} ${color}`}
  on:click={onClick}
>
  {#if item.value}
    {item.value}
  {:else}
    {#each Object.keys(item?.notes) as note}
      <span class={`note note-${note}`}>{note}</span>
    {/each}
  {/if}
</button>

<style>
  :root {
    --left-align: 7px;
    --center-align: 24px;
    --right-align: 7px;
  }
  .note {
    position: absolute;
    font-size: 12px;
    line-height: normal;
    color: #717b7a;
  }
  .note-1 {
    top: 4px;
    left: var(--left-align);
  }
  .note-2 {
    top: 4px;
    left: var(--center-align);
  }
  .note-3 {
    top: 4px;
    right: var(--right-align);
  }
  .note-4 {
    top: 20px;
    left: var(--left-align);
  }
  .note-5 {
    top: 20px;
    left: var(--center-align);
  }
  .note-6 {
    top: 20px;
    right: var(--right-align);
  }
  .note-7 {
    top: 36px;
    left: var(--left-align);
  }
  .note-8 {
    top: 36px;
    left: var(--center-align);
  }
  .note-9 {
    top: 36px;
    right: var(--right-align);
  }
</style>
