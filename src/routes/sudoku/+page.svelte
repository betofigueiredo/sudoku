<script lang="ts">
  import NumberButton from "./NumberButton.svelte";
  import type { Location } from "./types";

  let initialData =
    "2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3";
  let solution =
    "284375196739816254651942378476128539312594687598637412143769825965283741827451963";
  let puzzle: string[] = initialData.split("");
  let location: Location = { row: -1, column: -1, block: -1, idx: -1, value: "" };

  function isNumber(char: string): boolean {
    return /^[0-9]+$/.test(char);
  }

  function keydown(event: KeyboardEvent) {
    const isLocked = initialData[location.idx] !== ".";
    const noLocationSelected = location.idx === -1;
    if (!isNumber(event.key) || noLocationSelected || isLocked) {
      return;
    }
    puzzle[location.idx] = event.key;
  }

  function updateLocation({ row, column, block, idx, value }: Location) {
    location = { row, column, block, idx, value };
  }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
  <title>About</title>
  <meta name="description" content="About this app" />
</svelte:head>

<div class="container">
  <div class="grid grid-cols-9 w-[396px]">
    {#each puzzle as item, idx}
      {#key location}
        <NumberButton {item} {idx} {updateLocation} {location} />
      {/key}
    {/each}
  </div>
</div>
