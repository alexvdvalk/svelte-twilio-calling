<script lang="ts">
  import type { Call } from "@twilio/voice-sdk";

  export let incomingCall: Call;
  export let log: Function;

  $: if (incomingCall) {
    incomingCall.on("cancel", () => clearCall("cancel"));
    incomingCall.on("disconnect", () => clearCall("disconnect"));
    incomingCall.on("reject", () => clearCall("reject"));
  }

  const clearCall = (e) => {
    if (e) {
      log("Call ended");
      console.log("call event", e);
      incomingCall = null;
    }
  };
</script>

{#if incomingCall && incomingCall.direction === "INCOMING"}
  <div class="call">
    <h2>Incoming Call Controls</h2>
    <p>
      Incoming Call from {incomingCall.parameters.From}
    </p>
    <button
      on:click={() => {
        incomingCall.accept();
      }}>Accept</button
    >
    <button
      on:click={() => {
        incomingCall.reject();
      }}>Reject</button
    >
    <button
      on:click={() => {
        incomingCall.disconnect();
      }}>Hangup</button
    >
  </div>

  <style>
    .call {
      border: 1px solid black;
      margin: 1rem;
      padding: 1rem;
    }
  </style>
{/if}
