import { useQuery } from "@tanstack/react-query";
import { getAttendancesToday } from "../supabase/query";
import { supabase } from "../supabase/client";

export function useAttendancesQuery(today?: boolean) {
  const attendancesQuery = useQuery({
    initialData: [],
    queryKey: ["attendance-list", today],
    queryFn: async () => {
      if (today) {
        const result = await getAttendancesToday(supabase(), "Asia/Makassar");
        if (result.error) throw result.error;
        return result.data;
      }

      const result = await supabase()
        .from("attendances")
        .select("*, profiles(*, user:users!profiles_id_fkey(*))");
      if (result.error) throw result.error;
      return result.data;
    },
  });

  return attendancesQuery
}

