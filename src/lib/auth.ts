import { supabase } from "./supabase/client";

export function signin() {
  location.assign("/signin");
}

export function signout() {
  supabase().auth.signOut()
}