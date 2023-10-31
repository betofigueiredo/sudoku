<script lang="ts">
  export let item: string;
  export let idx: number;

  const row = Math.floor(idx / 9) + 1;
  const column = (idx % 9) + 1;
  const block = (Math.floor(idx / 3) % 3) + Math.floor((row - 1) / 3) * 3 + 1;

  function getBorder() {
    let border = "w-11 h-11 border-l";
    if ((idx + 0) % 3 === 0) border += " border-l-2 border-l-black";
    if ((idx + 1) % 9 === 0) border += " border-r-2 border-r-black";
    if (idx % 9 === 0) border += " border-l-2 border-l-black";
    if (idx < 9) border += " border-t-2 border-t-black";
    if (idx > 71) {
      border += " border-b-2 border-b-black";
    } else if (idx >= 18 && idx <= 26) {
      border += " border-b-2 border-b-black";
    } else if (idx >= 45 && idx <= 53) {
      border += " border-b-2 border-b-black";
    } else {
      border += " border-b";
    }
    return border;
  }
</script>

<button class={getBorder()}>
  {item}
</button>
