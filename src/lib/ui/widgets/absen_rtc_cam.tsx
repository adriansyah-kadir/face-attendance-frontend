import { Detection, useDetectionsDataChannel } from "@/lib/detection";
import { useProfiles } from "@/lib/states/profiles";
import { useRealtimeSettings } from "@/lib/supabase/realtime/settings";
import { elementDetection, isIPv4 } from "@/lib/utils";
import { useVerificationsDataChannel, Verifications } from "@/lib/verification";
import { useWebRTC } from "@/lib/webrtc";
import { Alert, Button, Spinner } from "@nextui-org/react";
import ky from "ky";
import { CheckCircle, InfoIcon, TimerIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

export default function AbsenRTCCam(props: { deviceId?: string, absenType?: "in" | "out", iceTransportPolicy?: RTCIceTransportPolicy }) {
  const rtc = useWebRTC({
    iceTransportPolicy: props.iceTransportPolicy,
    iceServers: [
      { urls: ["stun:stun1.l.google.com:19302", "stun:stun2.l.google.com:19305", "stun:stun.l.google.com:19302"] },
      {
        urls: "turn:relay1.expressturn.com:3478",
        username: "efA4AMH187ZJE3FVTE",
        credential: "lgKcjVX4TLWEWbyx"
      }
    ],
  });
  const settings = useRealtimeSettings();
  const detections = useDetectionsDataChannel();
  const verifications = useVerificationsDataChannel();
  const webcam = useRef<Webcam | null>(null);
  const profiles = useProfiles();
  const [info, setInfo] = useState<{ description?: string, title: string, isError?: boolean, isLoading?: boolean, isSuccess?: boolean }>()

  function getConnectionColor(
    connectionState: typeof rtc.connectionState,
  ): "default" | "success" | "danger" | "primary" {
    switch (connectionState) {
      case "connected":
        return "success";
      case "connecting":
        return "primary";
      case "closed":
        return "danger";
      case "failed":
        return "danger";
      default:
        return "default";
    }
  }

  async function connect() {
    console.log(rtc.pc?.localDescription)
    const answer = await ky.post(`${settings["BACKEND_SERVER"].value}/offer`, {
      json: {
        absen_type: props.absenType,
        sdp: rtc.pc?.localDescription?.sdp,
        type: rtc.pc?.localDescription?.type
      },
    }).json<RTCSessionDescription>()
    rtc.pc?.setRemoteDescription(answer);
  }

  useEffect(() => {
    if (rtc.iceGatheringState == "complete") return;
    // toast.info("Ice Gathering", { description: rtc.iceGatheringState });
    setInfo({ title: "Ice Gathering", description: rtc.iceGatheringState, isLoading: rtc.iceGatheringState === "gathering" })
    // if (rtc.iceGatheringState === "complete" && "BACKEND_SERVER" in settings) {
    //   connect().catch(err => setInfo({ title: "Error", description: String(err), isError: true }))
    // }
  }, [rtc.iceGatheringState, settings]);

  useEffect(() => {
    for (const candidate of rtc.iceCandidates) {
      if (rtc.signalingState != "stable" && candidate.relatedAddress && isIPv4(candidate.relatedAddress) && candidate.type === "relay" || candidate.type === "srflx" || candidate.type === "prflx" && "BACKEND_SERVER" in settings) {
        rtc.pc!.onicecandidate = null
        connect().catch(err => setInfo({ title: "Error", description: String(err), isError: true }))
        break;
      }
    }
  }, [rtc.iceCandidates, settings])

  useEffect(() => {
    // setInfo({title: rtc.connectionState})
    if (rtc.connectionState) {
      setInfo({
        title: rtc.connectionState,
        description: "server: " + settings["BACKEND_SERVER"].value,
        isLoading: rtc.connectionState === "connecting",
        isError: ["failed", "closed", "disconnected"].includes(rtc.connectionState),
        isSuccess: rtc.connectionState === "connected"
      })
    }
  }, [rtc.connectionState])

  useEffect(() => {
    if (rtc.negotiationNeeded) {
      detections.setDataChannel(rtc.pc?.createDataChannel("detections"));
      verifications.setDataChannel(rtc.pc?.createDataChannel("verifications"));
      rtc.pc?.createOffer().then((offer) => rtc.pc?.setLocalDescription(offer));
    }
  }, [rtc.negotiationNeeded]);

  return (
    <>
      <div className="h-full w-full flex items-center justify-center bg-black relative">
        {info && (
          <Alert
            radius="lg"
            classNames={{ base: "absolute top-5 left-5 w-fit items-center gap-5 z-[999]" }}
            hideIconWrapper
            color={getConnectionColor(info.isError ? "failed" : info.isLoading ? "connecting" : info.isSuccess ? "connected" : undefined)}
            icon={info.isLoading ? <Spinner size="sm" /> : undefined}
            title={info.title}
            description={info.description}
            endContent={info.isError ? <Button size="sm" onPress={() => {
              location.reload()
            }}>Reconnect</Button> : undefined}
          />
        )}
        <Webcam
          className="w-full h-full"
          ref={webcam}
          onUserMedia={rtc.addStream}
          videoConstraints={{ deviceId: props.deviceId }}
        />
        {detections.detections.map((d) => (
          <DetectionBox
            key={d.id}
            detection={d}
            verifications={verifications.verifications}
            videoEl={webcam.current?.video}
            profiles={profiles}
          />
        ))}
      </div>
      {/* <video */}
      {/*   autoPlay */}
      {/*   className="w-full h-full" */}
      {/*   ref={(video) => { */}
      {/*     if (video) video.srcObject = rtc.tracks.at(0)?.streams.at(0) ?? null; */}
      {/*   }} */}
      {/* /> */}
    </>
  );
}

function DetectionBox({
  detection,
  verifications,
  videoEl,
  profiles,
}: {
  detection: Detection;
  verifications: Verifications;
  videoEl: HTMLVideoElement | null | undefined;
  profiles: ReturnType<typeof useProfiles>;
}) {
  const data = detection.id ? verifications[detection.id] : undefined;
  const percentage = (data?.similarity ?? 0) * 100;
  const profile = data ? profiles[data.label] : undefined;
  const label = profile?.name ?? data?.label ?? "Unknown";
  const status: string = data?.extra["status"] ?? "idle";
  const loadingStart = useState<number>()
  const loadingEnd = useState<number>()

  let bgColor = "red";
  if (status === "loading") bgColor = "blue";
  if (status === "success") bgColor = "green";

  useEffect(() => {
    if (status === "loading") loadingStart[1](Date.now());
    else if (status === "success") loadingEnd[1](Date.now());
    else {
      loadingStart[1](undefined)
      loadingEnd[1](undefined)
    }
  }, [status])

  return (
    <div
      key={detection.id}
      className="fixed ring"
      ref={elementDetection(detection, videoEl)}
    >
      <div className="absolute bottom-full left-0 grid grid-rows-auto">
        {loadingStart[0] && (
          <span className="inline-flex items-center gap-2 p-1" style={{ backgroundColor: "yellow" }}>
            <TimerIcon />
            {
              (((loadingEnd[0] ?? Date.now()) - loadingStart[0]) / 1000) + "s"
            }
          </span>
        )}
        <span
          className="whitespace-nowrap text-nowrap inline-flex items-center gap-2 p-1"
          style={{
            backgroundColor: bgColor,
          }}
        >
          {status === "loading" && <Spinner size="sm" />}
          {percentage >= 50 ? (
            <>
              {status === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <InfoIcon size={18} />
              )}
              {`${label ?? "..."} ${percentage.toFixed(2)}%`}
            </>
          ) : (
            <>
              <InfoIcon size={18} />
              Unknown
            </>
          )}
        </span>
      </div>
    </div>
  );
}
