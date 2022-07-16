<script>
  import { session } from '$app/stores';

  import { SiteMenu, MenuBtn } from '$components';

  // The list of links in the navigation bar
  const navLinks = [
    { text: 'About', link: '/about'},
    { text: 'Available Addons', link: '/addons'},
    {
      text: $session.user !== undefined ? 'Logout' : 'Login',
      link: $session.user !== undefined ? '/logout' : '/login',
    }
  ];

  export let isMenuHidden = true;
</script>

<nav class="bg-gray-200 dark:bg-gray-800 shadow">
  <div class="container px-6 py-4 mx-auto">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold text-gray-700">
          <a class="text-2xl font-bold text-gray-800 transition-colors duration-200 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300" href="/">Ruinous Addons</a>
        </div>

        <MenuBtn bind:isMenuHidden={isMenuHidden}/>
      </div>

      <SiteMenu {isMenuHidden}>
        <span slot="links">
          {#each navLinks as nav}
            <a href="{nav.link}" class="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">{nav.text}</a>
          {/each}
        </span>
      </SiteMenu>
    </div>
  </div>
</nav>
