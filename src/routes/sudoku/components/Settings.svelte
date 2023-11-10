<script lang="ts">
  import { Toggle, Modal } from "flowbite-svelte";
  import store, { updateSettings } from "../store";
  import type { Settings } from "../types";
  import Timer from "./Timer.svelte";

  let settings: Settings = {};
  let defaultModal = false;

  store.subscribe((store) => {
    settings = store.settings;
  });

  function onChange(event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const attributes: { [k: string]: any } = checkbox.attributes;
    const key = attributes["data-key"]?.value;
    updateSettings(key, checkbox.checked);
  }
</script>

<div class="w-[358px] text-right mb-1">
  <div class="grid grid-cols-2 gap-20">
    <Timer />
    <button on:click={() => (defaultModal = true)}>More settings</button>
  </div>

  <Modal
    title="Settings"
    size="xs"
    bind:open={defaultModal}
    autoclose
    placement="top-center"
  >
    <Toggle
      color="teal"
      data-key="highlightErrors"
      checked={settings.highlightErrors}
      on:change={onChange}
    >
      Highlight errors
    </Toggle>
    <!-- <Toggle
      color="teal"
      data-key="highlightErrorsOnNotes"
      checked={settings.highlightErrorsOnNotes}
      on:change={onChange}
    >
      Highlight errors on notes
    </Toggle> -->
    <Toggle
      color="teal"
      data-key="highlightEqualNumbers"
      checked={settings.highlightEqualNumbers}
      on:change={onChange}
    >
      Highlight equal numbers
    </Toggle>
    <Toggle
      color="teal"
      data-key="highlightNotes"
      checked={settings.highlightNotes}
      on:change={onChange}
    >
      Highlight notes
    </Toggle>
    <Toggle
      color="teal"
      data-key="highlightRegion"
      checked={settings.highlightRegion}
      on:change={onChange}
    >
      Highlight region
    </Toggle>
  </Modal>
</div>
