<script>
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

<button on:click={toggleDarkMode} class="mx-4 text-gray-600 transition-colors duration-200 transform dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 focus:text-gray-700 dark:focus:text-gray-400 focus:outline-none" aria-label="toggle dark mode">
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
</button>