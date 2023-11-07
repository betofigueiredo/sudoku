<script lang="ts">
  import ControlButton from "./ControlButton.svelte";
  import iconRotateLeft from "$lib/images/icon-rotate-left.svg";

  function onClick(event: Event) {}
</script>

<ControlButton icon={iconRotateLeft} label="Desfazer" {onClick} />
