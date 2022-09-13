<script>
  import { AddonCard, MarkdownBox, StringConfig, BooleanConfig, NumberConfig, RangeConfig, EnumConfig } from "$components";

  // Map between the type of a configuration element and the component that
  // implements the settings for that type.
  const configMap = {
   "string": StringConfig,
   "boolean": BooleanConfig,
   "number": NumberConfig,
   "range": RangeConfig,
   "enum": EnumConfig,
  }

  export let slug = 'unknown';
  const addon = fetch(`/api/v1/addons/${slug}`).then(res => res.json());
</script>

<svelte:head>
  {#await addon then {name}}
    <title>Ruinous Add-on: {name}</title>
  {/await}
</svelte:head>

{#await addon}
    Loading addon info...
{:then addon}

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
    <div class="prose border my-4 p-4">
      <h3>{config.name}</h3>
      <MarkdownBox extraClasses="border-b-[1px] mb-2"  source={config.description} />
      <svelte:component this={configMap[config.type]} {config} value={config.default}/>
    </div>
  {/each}
{/await}
