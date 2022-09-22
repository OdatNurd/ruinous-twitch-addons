<script>
  import MarkdownBox from '../MarkdownBox.svelte';

  export let config;
  export let value = '';
</script>


<input type="text" placeholder={config.placeholder}
       class="input input-bordered w-full"
       bind:value={value} />
