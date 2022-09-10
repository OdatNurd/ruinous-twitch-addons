<script>
    export let name;
    export let size;

    $: [icon, base = "solid"] = (name || "").split(":");
</script>


<font-awesome-icon style="font-size: {size};" class="fa-{base} fa-{icon}" />