<script>
  import { MarkdownBox } from '$components';

  export let config;
</script>

<div class="prose border my-4 p-4">
  <h3>{config.name}</h3>
  <MarkdownBox source={config.description} />
  {#if config.range === true}
    <input type="range" min={config.minValue} max={config.maxValue} value={config.defaultValue} class="range" />
  {:else}
    <input type="text" placeholder={config.placeholder}
           class="input input-bordered w-full max-w-xs"
           value={config.default} />
  {/if}
</div>