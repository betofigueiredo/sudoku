<script lang="ts">
  import store, { updateAreNotesActive } from "../store";
  import iconPencil from "$lib/images/icon-pencil.svg";
  import ControlButton from "./ControlButton.svelte";

  let areNotesActive: boolean | undefined = false;

  store.subscribe((store) => {
    areNotesActive = store.settings.areNotesActive;
  });

  function onClick(event: Event) {
    updateAreNotesActive(!areNotesActive);
  }
</script>

<ControlButton icon={iconPencil} label="Notes" {onClick} isActive={areNotesActive} />
