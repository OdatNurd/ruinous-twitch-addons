<script>
  import { ProfileBtn, ThemeBtn } from '$components';

  export let isMenuHidden = true;
</script>

<!-- Mobile Menu open: "block", Menu closed: "hidden" -->
<div class="{isMenuHidden ? 'hidden' : 'block'} flex-1 md:flex md:items-center md:justify-between">
  <div class="flex flex-col -mx-4 md:flex-row md:items-center md:mx-8">
    <slot name="links"></slot>
  </div>

  <div class="flex items-center mt-4 md:mt-0">
    <ThemeBtn />
    <ProfileBtn />
  </div>
</div>