import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zip } from "./utils";

export class Detection {
  constructor(
    readonly topx: number,
    readonly topy: number,
    readonly botx: number,
    readonly boty: number,
    readonly score: number,
    readonly id?: number,
  ) {}

  static fromArray(array: number[]) {
    return new Detection(
      array[0],
      array[1],
      array[2],
      array[3],
      array[5],
      array[4],
    );
  }
}

export function useDetectionsDataChannel() {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [dataChannel, setDataChannel] = useState<RTCDataChannel>();
  const detectionsSchema = z.object({
    boxes: z.array(z.array(z.number()).min(4)),
    scores: z.array(z.number()),
  });
  const textDecoder = useMemo(() => new TextDecoder("utf-8"), []);

  async function onMessage(ev: RTCDataChannelEventMap["message"]) {
    let json: any = {};


    if (ev.data instanceof ArrayBuffer) {
      json = JSON.parse(textDecoder.decode(ev.data));
    } else if (typeof ev.data === "string") {
      json = JSON.parse(ev.data);
    }

    const detectionsParse = detectionsSchema.safeParse(json);

    if (detectionsParse.success) {
      setDetections(() => {
        return zip(detectionsParse.data.boxes, detectionsParse.data.scores).map(
          ([bbox, score]) => {
            const [topx, topy, botx, boty] = bbox;
            return new Detection(topx, topy, botx, boty, score, bbox[4]);
          },
        );
      });
    }
  }

  useEffect(() => {
    dataChannel?.addEventListener("message", onMessage);
    return () => {
      dataChannel?.removeEventListener("message", onMessage);
    };
  }, [dataChannel]);

  return { detections, dataChannel, setDataChannel };
}
