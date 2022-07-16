<script>
  import { marked } from 'marked';

  export let source;
</script>

<div class="prose md:prose-lg lg:prose-xl max-w-none">
  {@html marked.parse(source)}
</div>
