<script context="module">
  export async function load({ params, fetch, session }) {
    const res = await fetch(`/api/v1/addons/${params.slug}`);

    return {
      status: res.status,
      props: {
        addon: res.ok && (await res.json())
      }
    };
  }
</script>

<script>
 import AddonCard from "../../components/addonCard.svelte";

 export let addon;
</script>

<svelte:head>
  <title>Svelte Kit TestBed</title>
</svelte:head>

{#if addon.name !== undefined}
  <AddonCard {addon} />
{:else}
  Invalid addon
{/if}
