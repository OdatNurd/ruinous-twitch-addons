<script>
  import "../app.css";
  import Navigation from '../components/navigation.svelte';
  import Footer from '../components/footer.svelte';
</script>


<div class="p-8 max-w-8xl mx-auto">
  <Navigation />
  <slot></slot>
  <Footer />
</div>


<!-- <div class="flex flex-col p-4 max-w-8xl mx-auto h-screen justify-between">
  <Navigation />
  <div class="mb-auto"><slot></slot></div>
  <Footer />
</div> -->