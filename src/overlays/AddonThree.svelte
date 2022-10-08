<script>
  export let overlayInfo;
  export const socket = undefined;
</script>

<h1>{overlayInfo.addon.name}</h1>

<p>
  {overlayInfo.addon.description}
</p>

<p>
  This overlay instance is owned by <img src={overlayInfo.owner.profilePic} alt="cool dude"/> {overlayInfo.owner.displayName}
</p>

<style>
  img {
    width: 32px;
    height: 32px;
  }
</style>