<script>
  import ColumnHeader from "./ColumnHeader.svelte";
  import { createEventDispatcher } from "svelte";
  import Button, { Label } from "@smui/button";

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
    <input id="dial" bind:value={numbertoDial} placeholder="+441234567890" />
    <Button variant="raised" type="submit"><Label>Call</Label></Button>
  </form>
</div>

<style>
  input {
    width: 100%;
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
</style>
