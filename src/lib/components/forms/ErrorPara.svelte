<script lang="ts">
    export let styles : string | undefined = undefined;
</script>

<p role="alert" class="text-sm text-red-500 font-quicksand mt-3 {styles}">
    <slot />
</p>