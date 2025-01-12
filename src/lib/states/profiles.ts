import { useEffect, useState } from "react";
import { Tables } from "../supabase/types";
import { supabase } from "../supabase/client";

export function useProfiles() {
  const [profiles, setProfiles] = useState<Record<string, Tables<"profiles">>>(
    {},
  );

  useEffect(() => {
    supabase()
      .from("profiles")
      .select("*")
      .then((data) => {
        setProfiles(() => {
          return (
            data.data?.reduce<Record<string, Tables<"profiles">>>(
              (prev, curr) => {
                return { ...prev, [curr.id]: curr };
              },
              {},
            ) ?? {}
          );
        });
      });
  }, []);

  return profiles;
}
