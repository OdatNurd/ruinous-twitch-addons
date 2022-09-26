<script>
  import { user } from '$stores';
  import { link } from 'svelte-navigator';

  import { toast } from '$lib/toast.js';

  import MarkdownBox from './MarkdownBox.svelte';
  import Icon from './Icon.svelte';

  export let addon;
  export let detailed = false;

  // A tooltip for the button for copying the URL to the clipboard.
  let tooltip = '';
  $: tooltip = (addon.installed == false
                     ? 'Overlay not available'
                     : 'Copy Overlay URL');

  // Copy the overlay URL to the clipboard when the button is clicked.
  const copyUrl = () => {
    navigator.clipboard.writeText(addon.overlayUrl);
    toast.success("Overlay URL copied to the clipboard!");
  };

  // Handle a click on the button that either adds or removes the addon from
  // the user's channel.
  const handleAddRemove = async (event) => {
    // Disable the button while we're handling the click.
    event.srcElement.disabled = true;

    // Depending on the installation state, either add or remove the record.
    const res = await fetch(`/api/v1/user/addons/${addon.addonId}`, {
      method: addon.installed === true ? 'DELETE' : 'POST'
    });

    // Handle a successful return.
    if (res.ok === true) {
      addon.installed = !addon.installed;

      // If the addon is no longer installed, remove the local install data;
      // otherwise, we need to update it.
      if (addon.installed === false) {
        delete addon.overlayUrl;
        delete addon.config;
      } else {
        // The body of an addition will give us information about the overlay
        // URL and what the configuration is.
        const body = await res.json();

        addon.overlayUrl = body.overlayUrl;
        addon.config = body.configJSON;
      }
    }

    // Success or fail, re-enable the button.
    event.srcElement.disabled = false;
  }
</script>

<div class="card lg:card-side bg-base-100 shadow-2xl shadow-neutral text-base-content mb-8">
  <figure><img class="w-28 h-28 mx-4" src={addon.iconPic} alt="Addon Icon"></figure>
  <div class="card-body">
    <h2 class="card-title"><a href="/addons/{addon.slug}" use:link>{addon.name}</a>
      {#if addon.requiresChat}
        <span class="badge">Chat</span>
      {/if}
      {#if addon.requiresOverlay}
        <span class="badge">Overlay</span>
      {/if}
    </h2>
    <MarkdownBox source={detailed ? addon.description : addon.blurb} />
    {#if $user.userId !== undefined}
      <div class="card-actions justify-end">
        <button on:click={handleAddRemove} class="btn btn-primary">{addon.installed ? 'Remove from channel' : 'Add to Channel'}</button>
          <div class="tooltip tooltip-bottom tooltip-left" data-tip="{tooltip}">
            <button on:click={copyUrl} class="btn btn-circle btn-ghost" disabled={addon.installed == false || addon.requiresOverlay == false}>
              <Icon name="chain" size="1.5rem" />
            </button>
          </div>
      </div>
    {/if}
  </div>
</div>
