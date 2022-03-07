<script lang="ts">
  import ColumnHeader from "./ColumnHeader.svelte";
  export let logText = "";
  let el: HTMLTextAreaElement;

  $: {
    logText;
    if (el) el.scrollTop = el.scrollHeight;
  }
</script>

<div>
  <ColumnHeader>Event Log</ColumnHeader>
  <textarea rows="5" readonly bind:this={el}> {logText} </textarea>
</div>

<style>
  textarea {
    width: 100%;
  }
</style>
