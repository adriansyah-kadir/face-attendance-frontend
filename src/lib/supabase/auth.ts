import { supabase } from "./client";

export function googleSignIn(redirectTo = "/") {
  supabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo,
    },
  });
}

