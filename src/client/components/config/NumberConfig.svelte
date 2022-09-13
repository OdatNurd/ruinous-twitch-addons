<script>
  import { MarkdownBox } from '$components';

  export let config;
  export let value = 0;
</script>


<input type="text" placeholder={config.placeholder}
       class="input input-bordered w-full"
       bind:value={value} />
