<script>
  import { session } from '$app/stores';

  export let menuHidden = true;
  const toggleMenu = () => menuHidden = !menuHidden;

  const toggleDarkMode = () => {
    if (localStorage.theme === undefined) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = (localStorage.theme === 'dark' ? 'light' : 'dark')
    }

    // Set the dark class any time the theme is specifically dark, or when it is
    // not set to a specific value but the user's OS says that they prefer dark.
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
</script>

<nav class="bg-gray-200 shadow dark:bg-gray-800">
  <div class="container px-6 py-4 mx-auto">
    <div class="md:flex md:items-center md:justify-between">
      <div class="flex items-center justify-between">
        <div class="text-xl font-semibold text-gray-700">
          <a class="text-2xl font-bold text-gray-800 transition-colors duration-200 transform dark:text-white lg:text-3xl hover:text-gray-700 dark:hover:text-gray-300" href="/">Ruinous Pile of Crap</a>
        </div>

        <!-- Mobile menu button -->
        <div class="flex md:hidden">
          <button on:click={toggleMenu} type="button" class="text-gray-500 dark:text-gray-200 hover:text-gray-600 dark:hover:text-gray-400 focus:outline-none focus:text-gray-600 dark:focus:text-gray-400" aria-label="toggle menu">
            <svg viewBox="0 0 24 24" class="w-6 h-6 fill-current">
              <path fill-rule="evenodd" d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Menu open: "block", Menu closed: "hidden" -->
      <div class="{menuHidden ? 'hidden' : 'block'} flex-1 md:flex md:items-center md:justify-between">
        <div class="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
          <a href="/about" class="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">About</a>

          {#if $session.user === undefined}
            <a href="/login" class="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Login</a>
          {:else}
            <a href="/profile" class="px-2 py-1 mx-2 mt-2 text-sm font-medium text-gray-700 transition-colors duration-200 transform rounded-md md:mt-0 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-700">Profile</a>
          {/if}
        </div>

        <div class="flex items-center mt-4 md:mt-0">
          <button on:click={toggleDarkMode} class="mx-4 text-gray-600 transition-colors duration-200 transform dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none" aria-label="toggle dark mode">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
          </button>

          <button type="button" class="flex items-center focus:outline-none" aria-label="toggle profile dropdown">
            <div class="w-8 h-8 overflow-hidden border-2 border-gray-400 rounded-full text-gray-600 dark:text-gray-200">
            {#if $session.user !== undefined}
              <img src="{$session.user.profile}" class="object-cover w-full h-full" alt="avatar">
            {:else}
              <svg class="w-full h-full fill-current" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8C17 10.7614 14.7614 13 12 13C9.23858 13 7 10.7614 7 8ZM12 11C13.6569 11 15 9.65685 15 8C15 6.34315 13.6569 5 12 5C10.3431 5 9 6.34315 9 8C9 9.65685 10.3431 11 12 11Z"></path>
                <path d="M6.34315 16.3431C4.84285 17.8434 4 19.8783 4 22H6C6 20.4087 6.63214 18.8826 7.75736 17.7574C8.88258 16.6321 10.4087 16 12 16C13.5913 16 15.1174 16.6321 16.2426 17.7574C17.3679 18.8826 18 20.4087 18 22H20C20 19.8783 19.1571 17.8434 17.6569 16.3431C16.1566 14.8429 14.1217 14 12 14C9.87827 14 7.84344 14.8429 6.34315 16.3431Z"></path>
              </svg>
            {/if}
            </div>

            {#if $session.user !== undefined}
              <h3 class="mx-2 text-sm font-medium text-gray-700 dark:text-gray-200 md:hidden">{$session.user.name}</h3>
            {/if}
          </button>
        </div>
      </div>
    </div>
  </div>
</nav>
