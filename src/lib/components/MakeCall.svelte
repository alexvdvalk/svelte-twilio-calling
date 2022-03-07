<script>
  import ColumnHeader from "./ColumnHeader.svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let numbertoDial;

  const makeCall = () => {
    dispatch("dial", numbertoDial);
  };
</script>

<div>
  <ColumnHeader>Make a Call</ColumnHeader>
  <form on:submit|preventDefault={makeCall}>
    <label for="dial">Enter a phone number or client name</label>
    <input id="dial" bind:value={numbertoDial} placeholder="+447982923206" />
    <button type="submit">Call</button>
  </form>
</div>

<style>
  input {
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>
