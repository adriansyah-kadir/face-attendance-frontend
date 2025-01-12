"use client";

import { Card, CardHeader, CardBody } from "@nextui-org/card";
import MediaDevicesSelect from "../widgets/devices_select";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Expand, Shrink } from "lucide-react";
import AbsenLiveData from "../widgets/absen_live_data";
import AbsenRTCCam from "../widgets/absen_rtc_cam";
import { cn } from "@nextui-org/react";

export default function AbsenForm() {
  const [cam, setCam] = useState<MediaDeviceInfo | undefined>(undefined);

  if (cam) return <AbsenCard cam={cam} />;

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>Absen</CardHeader>
      <CardBody className="gap-2">
        <MediaDevicesSelect label="Cam" placeholder="-" onSelection={setCam} />
      </CardBody>
    </Card>
  );
}

function AbsenCard(props: { cam?: MediaDeviceInfo }) {
  const container = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    if (container.current) {
      if (expand) {
        container.current.requestFullscreen();
      } else if (document.fullscreenElement === container.current) {
        document.exitFullscreen();
      }
    }
  }, [expand, container]);

  return (
    <div
      className="w-full h-full flex relative overflow-hidden"
      ref={container}
    >
      <AbsenRTCCam deviceId={props.cam?.deviceId} />
      <div
        className={cn(
          "w-96 h-full transition-all bg-white",
          expand ? "max-w-96" : "max-w-0",
        )}
      >
        <AbsenLiveData />
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 hover:-translate-y-0 scale-80 hover:scale-100 transition-all">
        <div className="flex items-center gap-3 p-3 bg-black ring rounded-full mb-3">
          <Button color="warning" onPress={() => location.reload()}>
            Stop
          </Button>
          <Button isIconOnly onPress={() => setExpand((prev) => !prev)}>
            {!expand ? <Expand size={18} /> : <Shrink size={18} />}
          </Button>
        </div>
      </div>
    </div>
  );
}
