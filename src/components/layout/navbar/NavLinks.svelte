<script>
  export let links;
</script>

{#each links as nav}
  <li><a href={nav.link}>{nav.text}</a></li>
{/each}