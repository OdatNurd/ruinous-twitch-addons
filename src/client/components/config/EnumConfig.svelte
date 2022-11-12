<script>
  import MarkdownBox from '../MarkdownBox.svelte';

  export let config;
  export let value = '';
</script>


<select bind:value={value} class="select select-bordered w-full">
  <option value="" disabled>{config.placeholder}</option>
  {#each config.values as option (value)}
    <option value={option.value}>{option.label}</option>
  {/each}
</select>
