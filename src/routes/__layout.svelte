<script>
  import "$lib/app.scss";
  import { onMount } from "svelte";

  onMount(() => {
    import("bootstrap");
  });
</script>

<div class="container">
  <slot />
</div>

<style>
  div {
    height: 100%;
  }
</style>
