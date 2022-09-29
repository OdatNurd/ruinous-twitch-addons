<script>
  export let details;
</script>

<h1>{details.addon.name}</h1>

<p>
  {details.addon.description}
</p>

<p>
  This overlay instance is owned by <img src={details.owner.profilePic} alt="cool dude"/> {details.owner.displayName}
</p>

<style>
  img {
    width: 32px;
    height: 32px;
  }
</style>