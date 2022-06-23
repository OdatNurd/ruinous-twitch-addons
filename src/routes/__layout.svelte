<script>
  import "../app.css";
  import Navigation from '../components/navigation.svelte';
</script>

<div class="p-8 max-w-6xl mx-auto">
  <Navigation />
  <slot></slot>
</div>
