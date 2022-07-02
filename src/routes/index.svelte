<script context="module">
  export async function load({ params, fetch, session, stuff }) {
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
  import AddonCard from "../components/addonCard.svelte";

  export let addons;
</script>

<svelte:head>
  <title>Svelte Kit TestBed</title>
</svelte:head>

{#each addons as addon}
  <AddonCard {addon} />
{/each}
