<script lang="ts">
  import store, { clearPuzzle, initPuzzle } from "../store";

  const difficulties: { [k: string]: string } = {
    Easy: "easy",
    Medium: "medium",
    Hard: "hard",
    Expert: "very-hard",
    Master: "insane",
  };
  export let label: string;
  let difficulty: string | undefined = difficulties["Easy"];

  store.subscribe((store) => {
    difficulty = store.settings.difficulty;
  });

  function createNewBoard() {
    clearPuzzle();
    setTimeout(() => {
      initPuzzle(difficulties[label]);
    }, 600);
  }

  $: isActive = difficulty === difficulties[label];
</script>

<button
  type="button"
  on:click={createNewBoard}
  class={`pl-2 pr-2 ${isActive ? "text-[#3f9488]" : ""}`}
>
  {label}
</button>
