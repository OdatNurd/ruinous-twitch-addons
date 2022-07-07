<script>
  export let addon;
  export let link=true;
</script>


<div class="overflow-hidden bg-indigo-700 rounded-lg shadow-md dark:bg-indigo-900 text-neutral-100 m-2 p-4">
  <div class="flex items-center px-2 py-3">
    <img class="object-cover w-10 h-10 rounded-full" alt="Addon Icon" src="{addon.iconPic}">

    <div class="mx-3">
        {#if link}
          <a href="/addons/{addon.slug}" class="text-neutral-100">{addon.name}</a>
        {:else}
          <p class="text-neutral-100">{addon.name}</p>
        {/if}
    </div>
  </div>
</div>
