import { useEffect, useState } from "react";
import { Tables } from "../types";
import { supabase } from "../client";

export function useRealtimeAttendances() {
  const [attendances, setAttendances] = useState<Tables<"attendances">[]>([]);

  async function refresh() {
    const {data} = await supabase().from("attendances").select()
    setAttendances(data ?? [])
  }

  function setup() {
    return supabase()
      .channel("attendances")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "attendances",
        },
        async (ev) => {
          setAttendances((prev) => [...prev, ev.new as Tables<"attendances">]);
        },
      );
  }

  useEffect(() => {
    refresh()
    const channel = setup().subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return attendances;
}
