<script>
  const toggleDarkMode = () => {
    if (localStorage.theme === undefined) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = (localStorage.theme === 'dark' ? 'light' : 'dark')
    }

    document.documentElement.setAttribute('data-theme', localStorage.theme);
  }
</script>

<button on:click={toggleDarkMode} class="btn btn-circle">
  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
</button>
