<script context="module">
  export async function load({ params, fetch, session }) {
    const res = await fetch('/api/v1/addons');

    return {
      status: res.status,
      props: {
        addons: res.ok && (await res.json())
      }
    };
  }
</script>

<script>
  import { AddonCard } from "$components";

  export let addons;
</script>

<svelte:head>
  <title>Ruinous Twitch Addon List</title>
</svelte:head>

{#each addons as addon}
  <AddonCard {addon} detailed={false} />
{/each}
