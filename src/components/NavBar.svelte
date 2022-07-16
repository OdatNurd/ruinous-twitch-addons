<script>
  import { session } from '$app/stores';
  import { Menu, MobileMenu, ThemeBtn, ProfileBtn } from '$components';

  // The list of links in the navigation bar
  const links = [
    { text: 'About', link: '/about'},
    { text: 'Available Addons', link: '/addons'},
    {
      text: $session.user !== undefined ? 'Logout' : 'Login',
      link: $session.user !== undefined ? '/logout' : '/login',
    }
  ];
</script>

<div class="navbar bg-neutral text-neutral-content">
  <div class="navbar-start">
    <MobileMenu {links} />
    <a class="btn btn-ghost normal-case text-xl" href="/">Ruinous Addons</a>
  </div>

  <div class="navbar-center hidden lg:flex">
    <Menu {links} />
  </div>

  <div class="navbar-end">
    <ThemeBtn />
    <ProfileBtn />
  </div>
</div>