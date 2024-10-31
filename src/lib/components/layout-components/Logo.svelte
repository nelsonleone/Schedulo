<script lang="ts">
    import logoWht from "../../assets/logo-wht.png";
    import logoBlk from "../../assets/logo-blk.png";

    export let styles : string | undefined = undefined;
    export let logoType : "blk" | "wht" = "wht";

</script>

<a class="block" href="/">
    <img src={logoType === "blk" ? logoBlk : logoWht} class={styles} alt="logo" />
</a>