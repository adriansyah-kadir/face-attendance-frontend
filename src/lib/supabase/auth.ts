import { supabase } from "./client";

export function googleSignIn(basePath = "/") {
  supabase().auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: basePath,
    },
  });
}

