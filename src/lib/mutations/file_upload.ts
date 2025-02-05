import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { supabase } from "../supabase/client";
import { useContext } from "react";
import { SessionContext } from "../providers/session";

type Result = { id: string, path: string, fullPath: string }

export function useMediaUpload(folder?: string, options?: UseMutationOptions<Result, Error, File>) {
  const session = useContext(SessionContext)
  const mutation = useMutation<Result, Error, File>({
    ...options,
    mutationFn: async file => {
      const file_id = crypto.randomUUID()
      const file_path = `/${session?.user.id}/${folder ?? 'anon'}/${file_id}`
      const result = await supabase().storage.from('media').upload(file_path, file)
      if (result.error) throw result.error;
      return result.data
    }
  })

  return mutation
}
