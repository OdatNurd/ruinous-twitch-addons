<script>
  import "../app.css";
  import { NavBar, Footer } from '$components';
</script>


<div class="p-8 max-w-8xl mx-auto">
  <NavBar />
  <slot></slot>
  <Footer />
</div>


<!-- <div class="flex flex-col p-4 max-w-8xl mx-auto h-screen justify-between">
  <NavBar />
  <div class="mb-auto"><slot></slot></div>
  <Footer />
</div> -->