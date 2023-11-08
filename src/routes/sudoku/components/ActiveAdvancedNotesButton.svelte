<script lang="ts">
  import store, { updateAreNotesActive } from "../store";
  import iconPenRuler from "$lib/images/icon-pen-ruler.svg";
  import ControlButton from "./ControlButton.svelte";

  let areNotesActive: boolean | undefined = false;

  store.subscribe((store) => {
    areNotesActive = store.settings.areNotesActive;
  });

  function onClick(event: Event) {
    // updateAreNotesActive(!areNotesActive);
  }
</script>

<ControlButton icon={iconPenRuler} label="Notas avançadas" {onClick} />
