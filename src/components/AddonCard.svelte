<script>
  import { marked } from 'marked';

  export let addon;
  export let link=true;
</script>

<div class="px-8 py-4 mx-auto my-2 bg-white rounded-lg shadow-md dark:bg-slate-800">
  <div class="flex items-center justify-end">
    <a class="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-200 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500">Add to Channel</a>
  </div>

  <div class="mt-2">
    <a href="#" class="text-2xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline">{addon.title}</a>
    <div class="prose md:prose-lg lg:prose-xl max-w-none mt-2 text-gray-600 dark:text-gray-300">{@html marked.parse(addon.description)}</div>
  </div>

  <div class="flex items-end justify-between mt-4">
    {#if link}
      <a class="text-blue-600 dark:text-blue-400 hover:underline" href="/addons/{addon.slug}">View Details</a>
    {/if}

    <div class="flex items-center">
      <img class="object-cover w-28 h-28 mx-4" src="{addon.iconPic}" alt="Addon Icon">
    </div>
  </div>
</div>
