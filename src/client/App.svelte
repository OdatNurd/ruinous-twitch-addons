<script>
  import { NavBar, Toaster, Content, Footer, Icon } from '$components';
  import { Router, Route } from "svelte-navigator";
  import { user } from "$stores";

  import Index from "./routes/index.svelte";
  import About from "./routes/about.svelte";
  import Addons from "./routes/addons.svelte";
  import Profile from "./routes/profile.svelte";

  // Get information on the currently logged in user, and put it into our
  // user store for other things to know about.
  fetch('/api/v1/user').then(res => res.json()).then(res => $user = res);
</script>


<div class="flex flex-col h-screen">
  <Toaster />
  <NavBar />

  <div class="flex flex-1 w-full overflow-auto p-0 m-0">
    <Content>
      <Router primary={false}>
          <Route path="/"       component={Index} />
          <Route path="about"   component={About} />
          <Route path="addons"  component={Addons} />
          <Route path="profile" component={Profile} />
      </Router>
    </Content>
  </div>

  <Footer />
</div>
