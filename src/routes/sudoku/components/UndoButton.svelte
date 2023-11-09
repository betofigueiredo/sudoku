<script lang="ts">
  import { undoLastAction } from "../store";
  import iconRotateLeft from "$lib/images/icon-rotate-left.svg";
  import ControlButton from "./ControlButton.svelte";

  function onClick() {
    undoLastAction();
  }
</script>

<ControlButton icon={iconRotateLeft} label="Desfazer" {onClick} />
