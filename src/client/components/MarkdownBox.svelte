<script>
  import { marked } from 'marked';

  export let source;
  export let extraClasses='';
</script>

<div class="{extraClasses} prose md:prose-lg lg:prose-xl max-w-none">
  {@html marked.parse(source)}
</div>
