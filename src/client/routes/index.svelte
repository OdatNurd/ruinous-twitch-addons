<script>
  import { Counter } from '$components';

  const project = fetch(`/api/v1/project`).then(res => res.json());
</script>

<div class="m-4 p-4 w-full">
  <div class="alert alert-info shadow-lg mb-4">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current flex-shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      <span>If this looks like an info alert, this crap actually works.</span>
    </div>
  </div>

  {#await project}
    I'm doing a load...
  {:then {name}}
    <div class="card w-96 bg-neutral text-neutral-content mx-auto">
      <div class="card-body">
        <h2 class="card-title">{name}</h2>
        <p>If a dog chews shoes whose shoes does he choose?</p>
        <div class="card-actions justify-end">
          <Counter />
        </div>
      </div>
    </div>
  {/await}
</div>
