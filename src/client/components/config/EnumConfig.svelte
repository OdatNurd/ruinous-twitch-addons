<script>
  import MarkdownBox from "../MarkdownBox.svelte";

  export let config;
  export let value = '';
</script>


<select bind:value={value} class="select select-bordered w-full">
  {#each config.values as option}
    <option>{option}</option>
  {/each}
</select>
