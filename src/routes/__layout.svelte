<script>
  import "../app.css";
  import { NavBar, Content, Footer } from '$components';
</script>

<NavBar />
<Content>
  <slot />
</Content>
<Footer />
