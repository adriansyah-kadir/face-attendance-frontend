import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase/client";

export function useProfilesQuery() {
  const query = useQuery({
    queryKey: ["profiles-list"],
    queryFn: async () => {
      const data = await supabase().from("profiles").select()
      if (data.error) throw data.error;
      return data.data
    }
  })

  return query
}
