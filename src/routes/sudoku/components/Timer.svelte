<script lang="ts">
  import store, { updateSettings } from "../store";
  import iconPlay from "$lib/images/circle-play.svg";
  import iconPause from "$lib/images/circle-pause.svg";

  let timer: boolean | undefined = false;

  store.subscribe((store) => {
    timer = store.settings.timer;
  });

  let seconds = 0;
  let interval: ReturnType<typeof setInterval>;

  function startTimer() {
    interval = setInterval(() => {
      seconds++;
    }, 1000);
    updateSettings("timer", true);
  }

  function pauseTimer() {
    clearInterval(interval);
    updateSettings("timer", false);
  }

  function formatTime(sec: number) {
    let date = new Date(0);
    date.setSeconds(sec);
    const timeString = date.toISOString().substring(11, 19);
    return timeString;
  }

  startTimer();

  // TODO: reset timer when new board is created
  // TODO: block board when timer is stopped

  $: timerView = formatTime(seconds);
</script>

<div class="flex justify-center items-center gap-2">
  <div class="pt-1">{timerView}</div>
  {#if timer}
    <button on:click={pauseTimer}>
      <img
        src={iconPause}
        alt="pause"
        class="w-5 h-5"
        style="filter: invert(100%) sepia(0%) saturate(7449%) hue-rotate(166deg) brightness(118%) contrast(61%)"
      />
    </button>
  {:else}
    <button on:click={startTimer}>
      <img
        src={iconPlay}
        alt="play"
        class="w-5 h-5"
        style="filter: invert(100%) sepia(0%) saturate(7449%) hue-rotate(166deg) brightness(118%) contrast(61%)"
      />
    </button>
  {/if}
</div>
