<script context="module">
  export async function load({session}) {
    if (!session.user) {
      return {
          status: 302,
          redirect: "/login"
      };
    }

    return {
      status: 200
    }
  }
</script>

<script>
  import { session } from '$app/stores'
</script>

<svelte:head>
  <title>Svelte Kit TestBed User Profile</title>
</svelte:head>

<h1 class="text-4xl text-center my-8 uppercase">Profile: {$session.user.name}</h1>

{#if $session.user !== undefined}
  Welcome, {$session.user.name} (<a class="underline" href="/logout">Log out</a>)
<img class="w-15 h-15 p-8" src="{$session.user.profile}" alt="Twitch Avatar" />
{/if}