<script lang="ts">
  import type { Call } from "@twilio/voice-sdk";

  let input;
  let output;
  export let call: Call;

  $: if (call) {
    call.on("volume", (inputVolume, outputVolume) => {
      input = inputVolume;
      output = outputVolume;
    });
  }
</script>

{#if call}
  <div id="volume-indicators" class="par">
    <p>Mic Volume</p>
    <div id="input-volume">{Math.round(input * 100)}</div>
    <br /><br />
    <p>Speaker Volume</p>
    <div id="output-volume">
      {Math.round(output * 100)}
    </div>
  </div>
{/if}

<style>
  .par {
    border: 1px solid black;
    margin: 1rem;
    padding: 1rem;
  }
</style>
