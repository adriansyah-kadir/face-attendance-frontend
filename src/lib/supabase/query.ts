import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { DateTime } from "luxon";

export async function getTodayAttendancesView(sb: SupabaseClient<Database>) {
  const result = await sb.from("today_attendances_view").select("*");
  return result.data ?? [];
}

export async function getAttendancesOnRange(
  supabase: SupabaseClient<Database>,
  startDate: Date,
  endDate: Date,
) {
  const result = supabase
    .from("attendances")
    .select("*, profiles(*, user:users!profiles_id_fkey(*))")
    .gte("created_at", startDate.toISOString())
    .lt("created_at", endDate.toISOString());

  return result;
}

export async function getAttendancesToday(
  supabase: SupabaseClient<Database>,
  timeZone: string,
) {
  const startDate = DateTime.now().setZone(timeZone).startOf("day").toJSDate();
  const endDate = DateTime.now().setZone(timeZone).endOf("day").toJSDate();
  return getAttendancesOnRange(supabase, startDate, endDate)
}
