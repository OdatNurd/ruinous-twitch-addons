<script>
  import { AddonCard, MarkdownBox, StringConfig, BooleanConfig, NumberConfig, RangeConfig, EnumConfig } from '$components';

  import { HexagonSpinner } from 'svelte-doric'

  import { navigate } from 'svelte-navigator';

  import { loadJSON } from '$lib/loader.js'

  // Map between the type of a configuration element and the component that
  // implements the settings for that type.
  const configMap = {
   "string": StringConfig,
   "bool": BooleanConfig,
   "enum": EnumConfig,
   // These should be represented by different classes, since they are, you
   // know, distinct and stuff.
   "int": NumberConfig,
   "float": NumberConfig,
   // These should be represented by different classes, since they are, you
   // know, distinct and stuff.
   "int-slider": RangeConfig,
   "float-slider": RangeConfig,
  }

  export let slug = 'unknown';
  const addon = loadJSON(`/api/v1/addons/${slug}`);
</script>

<svelte:head>
  {#await addon then {name}}
    <title>Ruinous Add-on: {name}</title>
  {/await}
</svelte:head>

{#await addon}
  <div class="grid h-screen place-items-center">
    <HexagonSpinner size={125} />
  </div>
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
    {#if configMap[config.type] !== undefined}
      <div class="prose border my-4 p-4">
        <h3>{config.name}</h3>
        <MarkdownBox extraClasses="border-b-[1px] mb-2"  source={config.description} />
        <svelte:component this={configMap[config.type]} {config} value={config.default}/>
      </div>
    {:else}
      <div>Unknown configuration item type for {config.name}: {config.type}</div>
    {/if}
  {/each}
{:catch}
  {navigate('/error')}
{/await}
