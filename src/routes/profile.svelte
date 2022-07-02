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
    const res = await fetch(`/api/v1/addons?${new URLSearchParams({ userId: session.user.userId })}`);
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

  import AddonCard from "../components/addonCard.svelte";

  export let addons;
</script>

<svelte:head>
  <title>Svelte Kit TestBed User Profile</title>
</svelte:head>

<h1 class="text-4xl text-center my-8 uppercase">Profile: {$session.user.displayName}</h1>

{#if $session.user !== undefined}
  <div class="dark:text-white">
    Welcome, {$session.user.displayName}
    (<a class="text-sm underline" href="/login?force=true">Not you?</a>)
    (<a class="underline" href="/logout">Log out</a>)
  </div>

{#each addons as addon}
  <AddonCard {addon} />
{/each}

{/if}
