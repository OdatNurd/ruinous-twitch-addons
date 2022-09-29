import Overlay from '../Overlay.svelte';


// =============================================================================


/* Create and launch an Overlay component that wraps the addon represented by
 * the provided component, and which is uniquely identified by the provided
 * addonId.
 *
 * The created Overlay component is returned back. */
export function createOverlay(addon, addonId) {
  return new Overlay({
    target: document.body,
    props: {
      addon,
      addonId
    }
  });
}


// =============================================================================
