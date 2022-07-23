<script>
  import { MarkdownBox } from '$components';

  export let config;
</script>

<div class="prose border my-4 p-4">
  <h3>{config.name}</h3>
  <MarkdownBox source={config.description} />
  <input type="checkbox" class="toggle" bind:checked={config.default} />
</div>