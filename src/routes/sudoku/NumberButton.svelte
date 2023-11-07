<script lang="ts">
  import store, { updateAreNotesActive } from "./store";

  let areNotesActive: boolean | undefined = false;
  export let key: number;

  store.subscribe((store) => {
    areNotesActive = store.settings.areNotesActive;
  });

  function onClick(event: Event) {
    // TODO:
  }
</script>

<button
  class="w-[110px] h-[110px] text-5xl font-light flex justify-center items-center bg-[#dcdcdc] rounded-md"
  on:click={onClick}
>
  {key}
</button>
