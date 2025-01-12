import { useEffect, useState } from "react";
import { Tables } from "../types";
import { supabase } from "../client";

export function useRealtimeSettings() {
  const [settings, setSettings] = useState<Record<string, Tables<"settings">>>(
    {},
  );

  async function refresh() {
    const {data} = await supabase().from("settings").select();
    setSettings(() => {
        const values = data?.reduce((prev, curr) => {
          return { ...prev, [curr.key]: curr };
        }, settings) ?? settings
        return values
    });
  }

  function setupChannel() {
    return supabase()
      .channel("settings")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        ev => {
          if (ev.eventType === "UPDATE") {
            setSettings(prev => ({...prev, [ev.new.key]: ev.new}))
          }
        }
      );
  }

  useEffect(() => {
    refresh();
    const channel = setupChannel().subscribe();
    return () => {
      channel.unsubscribe();
    };
  }, []);

  return settings;
}
