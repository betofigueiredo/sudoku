<script lang="ts">
  import { Toggle } from "flowbite-svelte";
  import store, { updateAreNotesActive } from "./store";

  let areNotesActive: boolean | undefined = false;

  store.subscribe((store) => {
    areNotesActive = store.settings.areNotesActive;
  });

  function onChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    updateAreNotesActive(checkbox.checked);
  }
</script>

<div class="container">
  <Toggle color="teal" checked={areNotesActive} on:change={onChange}>
    areNotesActive
  </Toggle>
</div>
