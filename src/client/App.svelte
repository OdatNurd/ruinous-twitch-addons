<script>
  import { NavBar, Toaster, Content, Footer, Icon } from '$components';
  import { CircleSpinner } from 'svelte-doric'

  import { Router, Route } from 'svelte-navigator';
  import { user } from '$stores';

  import { loadJSON } from '$lib/loader.js'

  import Index from './routes/index.svelte';
  import About from './routes/about.svelte';
  import AddonsList from './routes/addons.svelte';
  import AddonsSlug from './routes/addons_slug.svelte';
  import Profile from './routes/profile.svelte';

  // Gather the user information for the currently logged in user; this could
  // be no user, in which case the result will end up being an empty object.
  //
  // The full page load is deferred until the request returns.
  loadJSON('/api/v1/user').then(data => user.set(data));
</script>


{#if $user !== null}
  <div class="flex flex-col h-screen">
    <Toaster />
    <NavBar />

    <div class="flex flex-1 w-full overflow-auto p-0 m-0">
      <Content>
        <Router primary={false}>
            <Route path="/"            component={Index} />
            <Route path="about"        component={About} />
            <Route path="addons"       component={AddonsList} />
            <Route path="addons/:slug" component={AddonsSlug} />
            <Route path="profile"      component={Profile} />
        </Router>
      </Content>
    </div>

    <Footer />
  </div>
{:else}
  <div class="grid h-screen place-items-center">
    <CircleSpinner size={250} />
  </div>
{/if}

<style>
  :global(body) {
    --primary: #00aaff;
    --primary-light: #79c0f7;
  }
</style>