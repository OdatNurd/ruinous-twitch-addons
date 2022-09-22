<script>
  import MarkdownBox from '../MarkdownBox.svelte';

  export let config;
  export let value = false;
</script>


<label class="label cursor-pointer">
  <input type="checkbox" class="toggle" bind:checked={value} />
  <span class="label-text w-full px-2">{config.labels[value ? 1 : 0]}</span>
</label>
