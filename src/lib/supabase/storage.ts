import { supabase } from "./client"

export function getPublicURLFormFullPath(fullpath?: string | null) {
  if (!fullpath) return undefined;
  if (fullpath.startsWith("http")) return fullpath;
  const [bucket, ...nodes] = fullpath.split("/")
  return supabase().storage.from(bucket).getPublicUrl(nodes.join('/')).data.publicUrl
}

export async function tryRemove(...paths: (string | undefined | null)[]) {
  const filtered = paths.filter(e => e !== null && e !== undefined)
  const values = filtered.map(e => {
    if (e.startsWith("http")) return;

    const [bucket, ...nodes] = e.split('/')
    if (!bucket.length || !nodes.length) return;

    return {
      bucket,
      nodes
    }
  }).filter(e => e !== undefined)

  for (const v of values) {
    try {
      await supabase().storage.from(v.bucket).remove([v.nodes.join('/')])
    } catch (error) {
      console.error(error)
    }
  }
}
