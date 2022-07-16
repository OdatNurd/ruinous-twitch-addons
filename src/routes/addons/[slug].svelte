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
 import { AddonCard } from "$components";

 export let addon;
</script>

<svelte:head>
  <title>Ruinous Add-on: {addon.title || 'Unknown'}</title>
</svelte:head>

{#if addon.name !== undefined}
  <AddonCard {addon} link={false} />
{:else}
  <div class="bg-gray-300 shadow dark:bg-slate-500 my-8">
    <div class="container px-6 py-4 mx-auto">
      No such addon found
    </div>
  </div>
{/if}
