<script>
  import { NavBar, Toaster, Content, Footer, Icon } from '$components';
  import { Router, Route } from "svelte-navigator";

  import Index from "./routes/index.svelte";
  import About from "./routes/about.svelte";
  import Addons from "./routes/addons.svelte";
</script>


<div class="flex flex-col h-screen">
  <Toaster />
  <NavBar />

  <div class="flex flex-1 w-full overflow-auto p-0 m-0">
    <Content>
      <Router primary={false}>
          <Route path="/"      component={Index} />
          <Route path="about"  component={About} />
          <Route path="addons" component={Addons} />
      </Router>
    </Content>
  </div>

  <Footer />
</div>
