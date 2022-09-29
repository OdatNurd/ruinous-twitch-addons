<script>
  import Error from './Error.svelte';

  import { launch } from './lib/common.js';

  export let addon;
  export let addonId;

  const addonData = launch(addonId);
</script>

<div>
  <slot>
    {#await addonData}
      Getting addon data
    {:then details}
      <svelte:component this={addon} {details}/>
    {:catch message}
      <Error {message} />
    {/await}
  </slot>
</div>

<style>
  :global(body) {
    background: black;
    color: white;
    overflow: hidden;
    margin: 0;
    padding: 0;
  }

  div {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
</style>