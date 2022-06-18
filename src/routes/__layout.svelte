<script>
  import Navigation from '../components/navigation.svelte';
</script>

<div class="p-8 max-w-6xl mx-auto">
  <Navigation />
  <slot></slot>
</div>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>