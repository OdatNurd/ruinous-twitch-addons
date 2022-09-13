<script>
  import { user } from "$stores";
  import { AddonCard } from "$components";

  // TODO: This doesn't detect the case where there's no user and do a page
  // redirect to the login code.
  //
  // See also the addons.svelte page, which uses a svelte level promise to show
  // a loading bar, though I think for our purposes we may want to do a few
  // backfill requests at once or similar.
  let addons = [];
  fetch('/api/v1/user/addons').then(res => res.json()).then(res => { addons = res; console.log(addons) });

</script>

<svelte:head>
  <title>Ruinous Profile: {$user.displayName}</title>
</svelte:head>


{#if $user.userId !== undefined}
  <div class="alert shadow-lg mb-4">
    <div class="w-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div class="flex w-full justify-between ">
        <span>Welcome, {$user.displayName}! (<a class="text-sm underline" href="/login?force=true">Not you?</a>)</span>
        <span><a class="underline" href="http://localhost:4000/logout">Log out</a></span>
      </div>
    </div>
  </div>

  {#each addons as addon}
    <AddonCard {addon} />
  {:else}
    <div class="prose md:prose-lg lg:prose-xl max-w-none">
      <p>
        You don't have any addons installed yet!
      </p>
    </div>
  {/each}
{/if}
