import { useEffect, useState } from "react";

export function useMediaDevices(constrains: MediaStreamConstraints) {
  const [devices, setDevices] = useState<MediaDeviceInfo[] | undefined>(
    undefined
  );

  async function initialize() {
    const media = await navigator.mediaDevices.getUserMedia(constrains);
    media.getTracks()[0].stop()
    const devices = await navigator.mediaDevices.enumerateDevices();
    setDevices(devices);
  }

  useEffect(() => {
    initialize().catch((err) => {
      console.error(err);
      alert("gagal mendapatkan informasi media devices");
    });
  }, []);

  return devices;
}
