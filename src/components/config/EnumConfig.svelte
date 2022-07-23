<script>
  import { MarkdownBox } from '$components';

  export let config;
</script>

<div class="prose border my-4 p-4">
  <h3>{config.name}</h3>
  <MarkdownBox source={config.description} />
  <select bind:value={config.default} class="select select-bordered w-full max-w-xs">
    {#each config.values as value}
      <option>{value}</option>
    {/each}
  </select>
</div>