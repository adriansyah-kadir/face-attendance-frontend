import { useProfiles } from "@/lib/states/profiles";
import { useRealtimeAttendances } from "@/lib/supabase/realtime/attendances";
import { getPublicURLFormFullPath } from "@/lib/supabase/storage";
import { Tables } from "@/lib/supabase/types";
import { getany } from "@/lib/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  ScrollShadow,
} from "@nextui-org/react";
import { AnimatePresence, motion } from "framer-motion";
import { MoreVertical } from "lucide-react";
import { DateTime } from "luxon";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function AbsenLiveData() {
  const [attendance, setAttendance] = useState<Tables<"attendances">>()
  const profiles = useProfiles()
  const attendances = useRealtimeAttendances({
    onAttend(attendance) {
      setAttendance(attendance)
      setTimeout(() => setAttendance(undefined), 3000)
      // toast.success("Sukses", { description: `${attendance.profile_id}: ${attendance.created_at}` })
    }
  });
  const today_attendances = useMemo(() => {
    return attendances.filter((attendance) => {
      const attendance_timestamp = DateTime.fromISO(
        attendance.created_at,
      ).setZone("Asia/Makassar");
      const now = DateTime.now().setZone("Asia/Makassar");
      return now.toISODate() === attendance_timestamp.toISODate();
    });
  }, [attendances]);

  return (
    <>
      <div className="fixed bottom-5 right-5 sm:hidden">
        {attendance && (
          <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}>
            <div className="h-20  rounded-lg overflow-hidden flex bg-white">
              <img className="h-full" src={getPublicURLFormFullPath(getany(attendance.data, ["image"]))} />
              <div className="h-full p-2 text-sm overflow-ellipsis text-nowrap whitespace-nowrap max-w-[50vw]">
                <p>
                  {getany(profiles, [attendance.profile_id, "name"], "...")}
                </p>
                <p>
                  {new Date(attendance.created_at!).toLocaleString("id")}
                </p>
                <p>
                  {(getany(attendance.data, ["similarity"], 0)! * 100).toFixed(2)}%
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      <ScrollShadow className="px-5 pb-5 bg-white min-w-80 hidden sm:block">
        <h3 className="text-xl mb-5">Live data</h3>
        <div className="flex flex-col gap-2 z-[-1]">
          <AnimatePresence mode="popLayout">
            {today_attendances.map((data) => (
              <motion.div
                key={data.id}
                layout
                initial={{ opacity: 0, x: -400, scale: 0.5 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 200, scale: 1.2 }}
                transition={{ duration: 0.6, type: "spring" }}
              >
                <Card className="flex flex-row w-fit overflow-visible max-w-none">
                  <CardHeader className="w-fit">
                    <img
                      src={getPublicURLFormFullPath(
                        data.data instanceof Object && "image" in data.data
                          ? data.data["image"]?.toString()
                          : "",
                      )}
                      width={50}
                    ></img>
                  </CardHeader>
                  <CardBody className="flex-shrink-0 w-fit">
                    <h4>{getany(profiles, [data.profile_id, "name"], "...")}</h4>
                    <p>{new Date(data.created_at!).toLocaleString("id")}</p>
                    <p>{(getany(data.data, ["similarity"], 0)! * 100).toFixed(2)}%</p>
                    <p>{getany(data.data, ["absen_type"], "in")!}</p>
                  </CardBody>
                  <CardFooter className="items-start">
                    <Button variant="light" size="sm" isIconOnly>
                      <MoreVertical size={18} />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollShadow>
    </>
  );
}
