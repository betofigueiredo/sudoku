<script lang="ts">
  import store from "./store";
  import type { Location, Settings } from "./types";

  let settings: Settings = {};
  let location: Location = {};

  store.subscribe((store) => {
    settings = store.settings;
    location = store.location;
  });

  export let note: string;

  function getBackground() {
    return location.item?.value === note ? " bg-[#458b81]" : "";
  }

  function getColor() {
    return location.item?.value === note ? " text-white" : " text-[#717b7a]";
  }

  $: background = location ? getBackground() : "";
  $: color = location ? getColor() : "";
</script>

<span class={`note note-${note} ${background} ${color}`}>{note}</span>

<style>
  :root {
    --left-align: 5px;
    --center-align: 19px;
    --right-align: 6px;
  }
  .note {
    position: absolute;
    padding: 1px 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: normal;
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
