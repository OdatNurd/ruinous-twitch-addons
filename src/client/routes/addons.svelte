<script>
  import { AddonCard } from "$components";

  const addons = fetch('/api/v1/addons').then(res => res.json());
</script>

<svelte:head>
  <title>Ruinous Twitch Addon List</title>
</svelte:head>

{#await addons}
    Loading addons list...
{:then addons}
  {#each addons as addon (addon.addonId)}
    <AddonCard {addon} detailed={false} />
  {/each}
{/await}
