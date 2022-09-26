<script>
  import { AddonCard } from '$components';

  import { HexagonSpinner } from 'svelte-doric'

  import { loadJSON } from '$lib/loader.js'

  const addons = loadJSON('/api/v1/addons');
</script>

<svelte:head>
  <title>Ruinous Twitch Addon List</title>
</svelte:head>

{#await addons}
  <div class="grid h-screen place-items-center">
    <HexagonSpinner size={125} />
  </div>
{:then addons}
  {#each addons as addon (addon.addonId)}
    <AddonCard {addon} detailed={false} />
  {/each}
{/await}
