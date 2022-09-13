<script>
  import { user } from "$stores";

  import { navigate } from "svelte-navigator";
  import { Icon } from '$components';

  $: {
    tooltip = ($user.userId === undefined ? 'Login with Twitch' : 'View Profile');
  }
  let tooltip = ($user.userId === undefined ? 'Login with Twitch' : 'View Profile')
  const openProfile = () => navigate($user.userId === undefined ? '/login' : '/profile');
</script>

<div class="tooltip tooltip-bottom tooltip-left" data-tip={tooltip}>
  <button class="btn btn-circle btn-ghost" on:click={openProfile}>
    <div class="avatar">
      <div class="w-8 rounded-full">
        {#if $user.userId !== undefined}
          <img src="{$user.profilePic}" class="object-cover w-full h-full" alt="avatar">
        {:else}
          <Icon name="user" size="2rem" />
        {/if}
      </div>
    </div>
  </button>
</div>