<script context="module">
  export async function load({ params, fetch, session, stuff }) {
    const res = await fetch('/api/v1/users');

    return {
      status: res.status,
      props: {
        users: res.ok && (await res.json())
      }
    };
  }
</script>

<script>
  import UserCard from "../components/userCard.svelte";

  export let users;
</script>

<svelte:head>
  <title>Svelte Kit TestBed</title>
</svelte:head>

<h1 class="text-4xl text-center my-8 uppercase">Svelte Kit TestBed</h1>

{#each users as user}
  <UserCard {user} />
{/each}
