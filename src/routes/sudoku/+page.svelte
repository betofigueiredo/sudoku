<script lang="ts">
  import NumberButton from "./NumberButton.svelte";

  let puzzle = "2.............62....1....7...6..8...3...9...7...6..4...4....8....52.............3";
  let solution =
    "284375196739816254651942378476128539312594687598637412143769825965283741827451963";

  function isNumber(char: string): boolean {
    return /^[0-9]+$/.test(char);
  }

  function keydown(event: KeyboardEvent) {
    // if (event.metaKey) return;
    if (!isNumber(event.key)) return;

    console.log(event.key);

    // if (event.key === "Enter") return;

    // document
    //   .querySelector(`[data-key="${event.key}" i]`)
    //   ?.dispatchEvent(new MouseEvent("click", { cancelable: true }));
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
      <NumberButton {item} {idx} />
    {/each}
  </div>
</div>
