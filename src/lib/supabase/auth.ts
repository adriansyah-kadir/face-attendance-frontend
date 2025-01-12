import { supabase } from "./client";

export function googleSignIn() {
    supabase().auth.signInWithOAuth({
        provider: "google",
    })
}