<script context="module">
  export async function load({ session, fetch }) {
    // If the session doesn't have any information on the current user, send
    // them to the login page; you can't view your profile if we don't know
    // who you are.
    if (!session.user) {
      return {
          status: 302,
          redirect: "/login"
      };
    }

    // There is a user, so fetch down the list of addons that they have
    // attached to their account.
    const res = await fetch('/api/v1/user/addons');
    return {
      status: res.status,
      props: {
        addons: res.ok && (await res.json())
      }
    }
  }
</script>

<script>
  import { session } from '$app/stores'

  import { AddonCard } from "$components";

  export let addons;
</script>

<svelte:head>
  <title>Ruinous Profile: {$session.user.displayName}</title>
</svelte:head>


{#if $session.user !== undefined}
  <div class="alert shadow-lg mb-4">
    <div class="w-full">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <div class="flex w-full justify-between ">
        <span>Welcome, {$session.user.displayName}! (<a class="text-sm underline" href="/login?force=true">Not you?</a>)</span>
        <span><a class="underline" href="/logout">Log out</a></span>
      </div>
    </div>
  </div>

  {#each addons as addon}
    <AddonCard {addon} />
  {/each}
{/if}
