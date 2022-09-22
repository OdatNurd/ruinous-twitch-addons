<script>
  import Icon from './Icon.svelte';

  export let type;
  export let message;

  const style = {
    "message": ["",              "circle-check:solid"],
    "error":   ["alert-error",   "circle-xmark:regular"],
    "warning": ["alert-warning", "triangle-exclamation:solid"],
    "info":    ["alert-info",    "circle-info:solid"],
    "success": ["alert-success", "circle-check:regular"],
  }
</script>

<div class="alert {style[type][0]} shadow-lg">
  <div>
    <Icon name={style[type][1]} size="1rem" />
    <span>{message}</span>
  </div>
</div>
