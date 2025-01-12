import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

let sb: SupabaseClient<Database> | null = null;

export function supabase() {
    sb = sb ?? new SupabaseClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
    return sb
}