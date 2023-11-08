<script lang="ts">
  export let icon: string;
  export let label: string;
  export let onClick: (event: Event) => void;
  export let isActive: boolean = false;

  $: activeClass = isActive ? "border-2 border-[#3f9488]" : "";
</script>

<div class="text-center text-xs font-medium">
  <button
    class={`relative w-14 h-14 rounded-full outline-0 flex justify-center items-center bg-[#dcdcdc] mb-2 ml-[auto] mr-[auto] hover:bg-[#cfdddb] active:bg-[#bfddd9] ${activeClass}`}
    on:click={onClick}
  >
    {#if isActive}
      <div
        class="absolute bg-[#3f9488] rounded-full pt-[2px] pb-[2px] pl-[8px] pr-[8px] top-[-9px] right-[-4px] text-white"
      >
        ON
      </div>
    {/if}
    <img src={icon} alt="" class="w-5 h-5" />
  </button>
  <span class={isActive ? "text-[#3f9488]" : ""}>{label}</span>
</div>
