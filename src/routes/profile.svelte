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

<h1 class="text-4xl text-center my-8 uppercase">Profile: {$session.user.displayName}</h1>

{#if $session.user !== undefined}
  <div class="dark:text-white">
    Welcome, {$session.user.displayName}
    (<a class="text-sm underline" href="/login?force=true">Not you?</a>)
    (<a class="underline" href="/logout">Log out</a>)
  </div>
<img class="w-15 h-15 p-8" src="{$session.user.profilePic}" alt="Twitch Avatar" />
{/if}
