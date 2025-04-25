"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import MediaDevicesSelect from "../widgets/devices_select";
import { useEffect, useRef, useState } from "react";
import { Button } from "@nextui-org/button";
import { Expand, Shrink } from "lucide-react";
import AbsenLiveData from "../widgets/absen_live_data";
import AbsenRTCCam from "../widgets/absen_rtc_cam";
import { Select, SelectItem } from "@nextui-org/react";

export default function AbsenForm() {
  const [cam, setCam] = useState<MediaDeviceInfo | undefined>(undefined);
  const [absen, setAbsen] = useState<"in" | "out">("in")
  const [ice, setIce] = useState<"all" | "relay">("all")

  if (cam) return <AbsenCard cam={cam} absen={absen} iceType={ice} />;

  return (
    <Card className="max-w-sm w-full">
      <CardHeader>Live Absen</CardHeader>
      <CardBody className="gap-2">
        <MediaDevicesSelect label="Pilih Kamera" placeholder="-" onSelection={setCam} />
        <Select items={[{ k: "in", v: "Masuk" }, { k: "out", v: "Pulang" }]} label="Absen" selectedKeys={[absen]} onSelectionChange={v => {
          const a = (v.currentKey ?? "in") as "in" | "out"
          setAbsen(a)
        }}>
          {({ k, v }) => (
            <SelectItem key={k}>{v}</SelectItem>
          )}
        </Select>
        <Select label="Ice Transport Policy" selectedKeys={[ice]} onSelectionChange={v => setIce((v.currentKey as any) ?? "all")}>
          <SelectItem key={"all"}>All</SelectItem>
          <SelectItem key={"relay"}>Relay</SelectItem>
        </Select>
      </CardBody>
      <CardFooter>
        <small>Daftarkan wajah anda pada Page <a className="text-blue-400" href="/profile">Profile</a> anda</small>
      </CardFooter>
    </Card>
  );
}

function AbsenCard(props: { cam?: MediaDeviceInfo, absen?: "in" | "out", iceType?: "all" | "relay" }) {
  const container = useRef<HTMLDivElement>(null);
  const [expand, setExpand] = useState(true);

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
      <AbsenRTCCam iceTransportPolicy={props.iceType} deviceId={props.cam?.deviceId} absenType={props.absen} />
      <AbsenLiveData />
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
