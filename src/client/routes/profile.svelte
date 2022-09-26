<script>
  import { user } from '$stores';
  import { link } from 'svelte-navigator';

  import { loadJSON } from '$lib/loader.js'

  import { AddonCard } from '$components';
  import { HexagonSpinner } from 'svelte-doric'

  let addons = undefined;
  if ($user.userId === undefined) {
    window.location.href = '/login/profile';
  } else {
    addons = loadJSON('/api/v1/user/addons');
  }

</script>

<svelte:head>
  <title>Ruinous Profile: {$user.displayName}</title>
</svelte:head>


{#if $user.userId !== undefined}
  <div class="alert shadow-lg mb-4">
    <div class="w-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div class="flex w-full justify-between ">
        <span>Welcome, {$user.displayName}! (<a class="text-sm underline" href="/login/profile?force=true">Not you?</a>)</span>
        <span><a class="underline" href="/logout">Log out</a></span>
      </div>
    </div>
  </div>

  {#await addons}
    <div class="grid h-screen place-items-center">
      <HexagonSpinner size={125} />
    </div>
  {:then addons}
    {#each addons as addon (addon.addonId)}
      <AddonCard {addon} />
    {:else}
      <div class="prose md:prose-lg lg:prose-xl max-w-none">
        <p>
          You don't have any addons installed yet! You should
          <a href="/addons" use:link>add your first one now!</a>
        </p>
      </div>
    {/each}
  {/await}
{/if}