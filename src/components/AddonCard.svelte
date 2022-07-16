<script>
  import { MarkdownBox } from '$components';

  export let addon;
</script>

<div class="card lg:card-side bg-base-100 shadow-2xl shadow-neutral text-base-content mb-8">
  <figure><img class="w-28 h-28 mx-4" src={addon.iconPic} alt="Addon Icon"></figure>
  <div class="card-body">
    <h2 class="card-title"><a href="/addons/{addon.slug}">{addon.name}</a>
      {#if addon.requiresChat}
        <span class="badge">Chat</span>
      {/if}
      {#if addon.requiresOverlay}
        <span class="badge">Overlay</span>
      {/if}
    </h2>
    <MarkdownBox source={addon.description} />
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Add to Channel</button>
    </div>
  </div>
</div>