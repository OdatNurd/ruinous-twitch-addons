<script>
  export let isMenuHidden = true;
</script>

<!-- Mobile menu button -->
<div class="flex md:hidden">
  <button on:click={() => isMenuHidden = !isMenuHidden} type="button" class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 323.99 265.84" class="w-6 h-6 fill-current">
    <path d="M327,174.91c0-19.47-9.44-36.08-26.79-42.33-.78-28-15.32-52.87-41.16-72.2-25.27-18.9-58.62-26.31-93.93-26.31S96.45,41.48,71.19,60.38C45.37,79.69,30.82,104.58,30,132.5c-17.47,6.18-27,22.86-27,42.41s9.54,36.25,27,42.45v12.55c0,35.84,44.16,70,80,70H220c35.84,0,80-34.16,80-70V217.36C317.45,211.16,327,194.48,327,174.91Zm-41.76,15-.24,0H45l-.23,0c-8.16-.13-11.76-6.81-11.76-15s3.72-15,12-15H285c8.27,0,12,6.71,12,15S293.39,189.8,285.23,189.93ZM88.16,83.4c20.11-15,48.08-21.33,77-21.33s56.85,6.29,77,21.33c17.16,12.85,26.29,29.21,27.93,46.54H60.22C61.86,112.61,71,96.25,88.16,83.4ZM220,269.91H110c-19.29,0-50-20.7-50-40v-10H270v10C270,249.21,239.29,269.91,220,269.91Z" transform="translate(-3 -34.07)"/>
   </svg>
  </button>
</div>