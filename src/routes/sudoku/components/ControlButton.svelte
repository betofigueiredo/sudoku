<script lang="ts">
  export let icon: string;
  export let label: string;
  export let onClick: (event: Event) => void;
  export let isActive: boolean = false;

  $: activeClass = isActive ? "border-2 border-[#3f9488]" : "";
</script>

<div class="text-center text-xs font-medium">
  <button
    class={`w-14 h-14 rounded-full flex justify-center items-center bg-[#dcdcdc] mb-2 ml-[auto] mr-[auto] hover:bg-[#cfdddb] active:bg-[#bfddd9] ${activeClass}`}
    on:click={onClick}
  >
    <img src={icon} alt="" class="w-5 h-5" />
  </button>
  {label}
</div>
