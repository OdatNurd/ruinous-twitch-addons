<script>
  export let user;
</script>


<div class="overflow-hidden bg-indigo-700 rounded-lg shadow-md dark:bg-indigo-900 text-neutral-100 m-2 p-4">
  <div class="flex items-center px-2 py-3">
    <img class="object-cover w-10 h-10 rounded-full" alt="User avatar" src="{user.profilePic}">

    <div class="mx-3">
        <p class="text-neutral-100">{user.displayName}</p>
    </div>
  </div>
</div>
