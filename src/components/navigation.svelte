<script>
  import { session } from '$app/stores'
</script>

<nav class="flex justify-center w-full">
  <a class="mx-4 text-lg" href="/">Home</a>
  <a class="mx-4 text-lg" href="/about">About</a>

  {#if $session.user === undefined}
    <a class="mx-4 text-lg" href="/login">Login</a>
  {:else}
    <a class="ml-4 mr-2 text-lg" href="/profile">{$session.user.name}</a>
    (<a class="text-sm underline" href="/login?force=true">Not you?</a>)
    <img class="ml-2 w-7 h-7" src="{$session.user.profile}" alt="Twitch Avatar" />
  {/if}
</nav>
