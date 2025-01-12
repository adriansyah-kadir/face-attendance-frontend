import { SupabaseClient, createClient } from "jsr:@supabase/supabase-js";
import type { Database } from "../../../src/lib/supabase/types.d.ts";
import { DateTime } from "@frytg/dates";
import { z } from "npm:zod";

export async function member_has_already_attended_today(
  profile_id: string,
  supabase: SupabaseClient<Database>
) {
  const start = DateTime.now().setZone("Asia/Makassar").startOf("day").toISO();
  const end = DateTime.now().setZone("Asia/Makassar").endOf("day").toISO();
  const attend = await supabase
    .from("attendances")
    .select()
    .eq("profile_id", profile_id)
    .gte("created_at", start)
    .lt("created_at", end)
    .single();
  return attend.data;
}

export function getSupabaseClient(Authorization: string) {
  return createClient<Database>(
    "https://alyijvsqnohukelkwhgu.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFseWlqdnNxbm9odWtlbGt3aGd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ1ODYwNzYsImV4cCI6MjA1MDE2MjA3Nn0.FESZqJzs4FnNdxhoWrNXNczU-rjHLtwPfm8P9qZhNpU",
    {
      global: {
        headers: { Authorization },
      },
    }
  );
}

const FormDataSchema = z.object({
  file: z.instanceof(File),
  similarity: z.coerce.number(),
  label: z.string(),
});

export function parseFormData(formData: FormData | object) {
  return FormDataSchema.safeParse(Object.fromEntries(Object.entries(formData)));
}
