import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";

export async function getTodayAttendancesView(sb: SupabaseClient<Database>) {
  const result = await sb.from('today_attendances_view').select("*")
  return result.data ?? []
}
