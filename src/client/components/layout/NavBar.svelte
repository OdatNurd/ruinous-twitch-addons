<script>
  import { user } from '$stores';

  import { link } from 'svelte-navigator';

  import Icon from '../Icon.svelte';
  import ThemeBtn from './nav/ThemeBtn.svelte';
  import ProfileBtn from './nav/ProfileBtn.svelte';

  // The list of links in the navigation bar
  const links = [
    { text: 'About', link: '/about'},
    { text: 'Available Addons', link: '/addons'},
  ];

  let accessText = '';
  let accessLink = '';
  $: {
    accessText = $user.userId !== undefined ? 'Logout' : 'Login';
    accessLink = $user.userId !== undefined ? '/logout' : '/login/profile';
  }


</script>


<div class="flex navbar bg-neutral text-neutral-content">
  <div class="navbar-start">

    <!-- The mobile menu; not visible on larger screen layouts. -->
    <div class="dropdown">
      <div tabindex="0" class="btn btn-ghost lg:hidden">
        <Icon name="burger" size="1.5rem" />
      </div>
      <ul tabindex="0" class="menu menu-compact dropdown-content mt-3 p-2 shadow ring bg-base-100 rounded-box w-52">
        {#each links as nav}
          <li><a href={nav.link} use:link>{nav.text}</a></li>
        {/each}
        <li><a href={accessLink}>{accessText}</a></li>
      </ul>
    </div>

    <a class="btn btn-ghost normal-case text-xl" href="/" use:link>Ruinous Addons</a>
  </div>

  <div class="navbar-center hidden lg:flex">
    <!-- Normal menu; only available on larger screens. -->
    <ul class="menu menu-horizontal p-0">
      {#each links as nav}
        <li><a href={nav.link} use:link>{nav.text}</a></li>
      {/each}
      <li><a href={accessLink}>{accessText}</a></li>
    </ul>
  </div>

  <div class="navbar-end">
    <ThemeBtn />
    <ProfileBtn />
  </div>
</div>