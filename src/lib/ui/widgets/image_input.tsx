import { useMediaUpload } from "@/lib/mutations/file_upload";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { pickFiles } from "@/lib/utils";
import { Avatar, AvatarProps, Button, cn } from "@nextui-org/react";
import { CameraIcon } from "lucide-react";
import { useEffect, useMemo } from "react"

type Props = {
  name?: string,
  baseClassName?: string,
  uploadFile?: File,
  onUploaded?: (url: { id: string, path: string, fullPath: string }) => void,
  onPublicUrl?: (url: string) => void,
  onPick?: () => void,
  path?: string,
  folder?: string,
} & AvatarProps

export default function ImageInput(props: Props) {
  const { name, baseClassName, uploadFile, onUploaded, onPick, path, folder, ...avatarProps } = props
  const uploadMutation = useMediaUpload(folder)
  const avatarColor = useMemo(() => {
    if (uploadMutation.isSuccess) return "success";
    if (uploadMutation.isError) return "danger";
    return "default"
  }, [uploadMutation])
  const publicURL = useMemo(() => {
    if (!uploadMutation.data) return path ? getPublicURLFormFullPath(path) : getPublicURLFormFullPath(props.src);
    return getPublicURLFormFullPath(uploadMutation.data.fullPath)
  }, [uploadMutation.data])

  async function handleClick() {
    onPick?.call(undefined)
    uploadMutation.reset()
    const [image] = await pickFiles({ accept: "image/*" })
    uploadMutation.mutate(image)
  }

  useEffect(() => {
    if (uploadMutation.data && props.onUploaded) {
      props.onUploaded(uploadMutation.data)
    }
  }, [uploadMutation.data])

  useEffect(() => {
    if (uploadFile) {
      uploadMutation.reset()
      uploadMutation.mutate(uploadFile)
    }
  }, [])

  return (
    <div className={cn("w-fit h-fit", baseClassName, "relative")}>
      <input name={name} hidden value={uploadMutation.data?.fullPath ?? path} readOnly />
      <Avatar {...avatarProps} color={avatarColor} isBordered isFocusable src={publicURL} />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
      >
        <Button
          onPress={handleClick}
          radius="full"
          isLoading={uploadMutation.isPending}
          variant="solid"
          size="sm"
          isIconOnly
        >
          <CameraIcon size={18} />
        </Button>
        {uploadMutation.error && (
          <p className="text-center">{uploadMutation.error.message}</p>
        )}
      </div>
    </div>
  )
}
