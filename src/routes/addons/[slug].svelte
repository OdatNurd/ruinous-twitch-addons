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
 import { AddonCard, StringConfig, BooleanConfig, NumberConfig, EnumConfig } from "$components";

 // Map between the type of a configuration element and the component that
 // implements the settings for that type.
 const configMap = {
  "string": StringConfig,
  "boolean": BooleanConfig,
  "number": NumberConfig,
  "enum": EnumConfig,
 }

 export let addon;
</script>

<svelte:head>
  <title>Ruinous Add-on: {addon.name || 'Unknown'}</title>
</svelte:head>

{#if addon.name !== undefined}
  <AddonCard {addon} detailed={true} />
{:else}
  <div class="bg-gray-300 shadow dark:bg-slate-500 my-8">
    <div class="container px-6 py-4 mx-auto">
      No such addon found
    </div>
  </div>
{/if}

{#each addon.configSchema as config }
  <svelte:component this={configMap[config.type]} {config} />
{/each}
