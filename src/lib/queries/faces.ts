import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase/client";

export function useFacesQuery(profile_id: string, status = ['accepted', 'pending']) {
  const facesQuery = useQuery({
    initialData: [],
    queryKey: ['faces-list'],
    queryFn: async () => {
      const result = await supabase().from('faces').select("*").eq("profile_id", profile_id).in('status', status)
      if (result.error) throw result.error;
      return result.data;
    }
  })

  return facesQuery
}

export function useFacesPending(profile_id: string) {
  const facesQuery = useQuery({
    initialData: [],
    queryKey: ['faces-list'],
    queryFn: async () => {
      const result = await supabase().from('face_requests').select("*").eq("profile_id", profile_id)
      if (result.error) throw result.error;
      return result.data;
    }
  })

  return facesQuery
}

export function useFacesAccepted(profile_id: string) {
  const facesQuery = useQuery({
    initialData: [],
    queryKey: ['faces-list'],
    queryFn: async () => {
      const result = await supabase().from('face_embeddings').select("*").eq("profile_id", profile_id)
      if (result.error) throw result.error;
      return result.data;
    }
  })

  return facesQuery
}
