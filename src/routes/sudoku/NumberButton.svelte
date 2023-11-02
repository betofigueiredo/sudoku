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
    let border = " border-l";
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
    let background = "";
    if (isLocationSelected) background += " bg-gray-100";
    if (isItemSelected) background += " bg-gray-400";
    if (isSameSelectedValue) background += " bg-gray-400";
    return background;
  }

  function getColor() {
    const isWrongNumber = item.value !== "" && item.value !== item.solution;
    const hasError = isWrongNumber && settings.highlightErrors;
    return hasError ? " text-red-600" : "";
  }

  function onClick() {
    updateLocation({ row, column, block, idx, item });
  }

  const border = getBorder();
  $: background = item && location ? getBackground() : "";
  $: color = item ? getColor() : "";
</script>

<button class={`w-14 h-14 text-3xl ${border} ${background} ${color}`} on:click={onClick}>
  {item.value}
</button>
