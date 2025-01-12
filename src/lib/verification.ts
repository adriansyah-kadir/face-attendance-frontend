import { useEffect, useMemo, useState } from "react";

export type Verifications = Record<
  number,
  {
    similarity: number;
    label: string;
    extra: Record<string, any>;
  }
>;

export function useVerificationsDataChannel() {
  const [verifications, setVerifications] = useState<Verifications>({});
  const [dataChannel, setDataChannel] = useState<RTCDataChannel>();
  const textDecoder = useMemo(() => new TextDecoder("utf-8"), []);

  async function onMessage(ev: RTCDataChannelEventMap["message"]) {
    let json: any = {};

    if (ev.data instanceof ArrayBuffer) {
      json = JSON.parse(textDecoder.decode(ev.data));
    } else if (typeof ev.data === "string") {
      json = JSON.parse(ev.data);
    }

    setVerifications(json);
  }

  useEffect(() => {
    dataChannel?.addEventListener("message", onMessage);
    return () => {
      dataChannel?.removeEventListener("message", onMessage);
    };
  }, [dataChannel]);

  return { verifications, dataChannel, setDataChannel };
}
