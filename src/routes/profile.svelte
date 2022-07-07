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

  import AddonCard from "$component/addonCard.svelte";

  export let addons;
</script>

<svelte:head>
  <title>Ruinous Profile: {$session.user.displayName}</title>
</svelte:head>


{#if $session.user !== undefined}
<div class="bg-gray-300 shadow dark:bg-slate-500 my-8">
  <div class="container px-6 py-4 mx-auto">
    Welcome, {$session.user.displayName}
    (<a class="text-sm underline" href="/login?force=true">Not you?</a>)
    (<a class="underline" href="/logout">Log out</a>)
  </div>
</div>

{#each addons as addon}
  <AddonCard {addon} />
{/each}

{/if}
