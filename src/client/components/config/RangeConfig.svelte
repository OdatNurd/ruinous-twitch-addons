<script>
  import MarkdownBox from "../MarkdownBox.svelte";

  export let config;
  export let value = 0;
</script>


<label class="label cursor-pointer">
  <input type="range" min={config.minValue} max={config.maxValue} step={config.stepValue} bind:value={value} class="range" />
  <input type="text" placeholder={config.placeholder}
         class="input ml-2 input-xs input-bordered w-16"
         bind:value={value} />
</label>
