<script lang="ts">
	import Icon from "@iconify/svelte";
	import { Button } from "../ui/button";

    export let formAction = "?/login";
</script>

<form method="post" aria-labelledby="signin-form" class="flex flex-col gap-4 items-center justify-center mt-16">
    <label id="signin-form" for="" class="text-sm md:text-base">Continue With</label>

    <Button type="submit" formaction={`${formAction}&provider=google`} 
            class="font-semibold flex gap-2 font-quicksand w-40 md:w-48 md:text-lg md:py-3 md:h-auto" aria-label="Continue with Google">
        <Icon class="text-2xl" icon="flat-color-icons:google" />
        <span>Google</span>
    </Button>

    <Button type="submit" formaction={`${formAction}&provider=facebook`} 
            class="font-semibold flex gap-2 font-quicksand w-40 md:w-48 md:text-lg md:py-3 md:h-auto" aria-label="Continue with Facebook">
        <Icon class="text-2xl" icon="logos:facebook" />
        <span>Facebook</span>
    </Button>
</form>
