<script>
  import { Icon } from '$components';
  import { onMount } from 'svelte';

  // The name of the icon to use on the theme button, and a simple lambda for
  // setting the appropriat value based on the theme.
  let name = "";
  const setBtnName = () => name = localStorage.theme === "dark" ? "moon" : "sun";

  // When the component is mounted, set up the appropriate button name.
  onMount(() => {
    setBtnName();
  });

  const toggleDarkMode = () => {
    if (localStorage.theme === undefined) {
      localStorage.theme = 'dark';
    } else {
      localStorage.theme = (localStorage.theme === 'dark' ? 'light' : 'dark')
    }

    setBtnName();
    document.documentElement.setAttribute('data-theme', localStorage.theme);
  }
</script>


<div class="tooltip tooltip-bottom" data-tip="Toggle Theme">
  <button on:click={toggleDarkMode} class="btn btn-circle">
    <Icon {name} size="1.5rem" />
  </button>
</div>
