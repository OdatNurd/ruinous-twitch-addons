<script>
  import { MarkdownBox } from '$components';

  export let addon;
</script>

<div class="card lg:card-side bg-base-100 shadow-2xl shadow-neutral text-base-content mb-8">
  <figure><img class="w-28 h-28 mx-4" src={addon.iconPic} alt="Addon Icon"></figure>
  <div class="card-body">
    <a href="/addons/{addon.slug}"><h2 class="card-title">{addon.title}</h2></a>
    <MarkdownBox source={addon.description} />
    <div class="card-actions justify-end">
      <button class="btn btn-primary">Add to Channel</button>
    </div>
  </div>
</div>