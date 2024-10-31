import type { Provider, SupabaseClient } from "@supabase/supabase-js";

export const handleSignInWith0Auth = async (url: URL, supabase: SupabaseClient<any, "public", any>) => {
    const provider = url.searchParams.get("provider") as Provider;

    if (provider) {
        const res = await supabase.auth.signInWithOAuth({
            provider,
            options: {
                queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                }
            }
        });
        return res;
    } else {
        return null;
    }
}