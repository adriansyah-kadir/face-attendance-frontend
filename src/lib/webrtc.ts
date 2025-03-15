import { useCallback, useEffect, useState } from "react";

export function useWebRTC(
  config?: RTCPeerConnection | RTCConfiguration | null,
) {
  const [pc, setPC] = useState<RTCPeerConnection>();
  const [iceGatheringState, setIceGatheringState] = useState<
    RTCIceGatheringState | undefined
  >(pc?.iceGatheringState);
  const [iceConnectionState, setIceConnectionState] = useState<
    RTCIceConnectionState | undefined
  >(pc?.iceConnectionState);
  const [iceCandidates, setIceCandidates] = useState<RTCIceCandidate[]>([]);
  const [iceCandidateErrors, setIceCandidateErrors] = useState<
    RTCPeerConnectionIceErrorEvent[]
  >([]);
  const [tracks, setTracks] = useState<RTCTrackEvent[]>([]);
  const [channels, setChannels] = useState<RTCDataChannel[]>([]);
  const [negotiationNeeded, setNegotationNeeded] = useState(false);
  const [signalingState, setSignalingState] = useState<
    RTCSignalingState | undefined
  >(pc?.signalingState);
  const [connectionState, setConnectionState] = useState<
    RTCPeerConnectionState | undefined
  >(pc?.connectionState);

  const addStream = useCallback(
    function (stream?: MediaStream | null) {
      if (stream) stream.getTracks().forEach((t) => pc?.addTrack(t, stream));
    },
    [pc],
  );

  function onIceGatheringStateChange(this: RTCPeerConnection) {
    console.debug("iceGatheringState", this.iceGatheringState);
    setIceGatheringState(this.iceGatheringState);
  }

  function onIceConnectionStateChange(this: RTCPeerConnection) {
    console.debug("iceConnectionState", this.iceConnectionState);
    setIceConnectionState(this.iceConnectionState);
  }

  function onIceCandidate(ev: RTCPeerConnectionIceEvent) {
    const candidate = ev.candidate;
    if (candidate) {
      console.debug("iceCandidate", candidate);
      setIceCandidates((prev) => [...prev, candidate]);
    }
  }

  function onIceCandidateError(ev: RTCPeerConnectionIceErrorEvent) {
    console.debug("iceCandidateError", ev);
    setIceCandidateErrors((prev) => [...prev, ev]);
  }

  function onTrack(ev: RTCTrackEvent) {
    console.debug("track", ev);
    setTracks((prev) => [...prev, ev]);
  }

  function onDataChannel(ev: RTCDataChannelEvent) {
    console.debug("dataChannel", ev.channel);
    setChannels((prev) => [...prev, ev.channel]);
  }

  function onNegotationNeeded() {
    console.debug("negotiationNeeded");
    setNegotationNeeded(true);
  }

  function onSignalingStateChange(this: RTCPeerConnection) {
    console.debug("signalingState", this.signalingState);
    setSignalingState(this.signalingState);
  }

  function onConnectionStateChange(this: RTCPeerConnection) {
    console.debug("connectionState", this.connectionState);
    setConnectionState(this.connectionState);
  }

  useEffect(() => {
    const localPeer =
      config instanceof RTCPeerConnection
        ? config
        : new RTCPeerConnection(config ?? undefined);
    localPeer.addEventListener(
      "icegatheringstatechange",
      onIceGatheringStateChange,
    );
    localPeer.addEventListener(
      "iceconnectionstatechange",
      onIceConnectionStateChange,
    );
    localPeer.onicecandidate = onIceCandidate
    // localPeer.addEventListener("icecandidate", onIceCandidate);
    localPeer.addEventListener("icecandidateerror", onIceCandidateError);
    localPeer.addEventListener("track", onTrack);
    localPeer.addEventListener("datachannel", onDataChannel);
    localPeer.addEventListener("negotiationneeded", onNegotationNeeded);
    localPeer.addEventListener("signalingstatechange", onSignalingStateChange);
    localPeer.addEventListener(
      "connectionstatechange",
      onConnectionStateChange,
    );
    setPC(localPeer);

    return () => {
      localPeer.removeEventListener(
        "icegatheringstatechange",
        onIceGatheringStateChange,
      );
      localPeer.removeEventListener(
        "iceconnectionstatechange",
        onIceConnectionStateChange,
      );
      localPeer.removeEventListener("icecandidate", onIceCandidate);
      localPeer.removeEventListener("icecandidateerror", onIceCandidateError);
      localPeer.removeEventListener("track", onTrack);
      localPeer.removeEventListener("datachannel", onDataChannel);
      localPeer.removeEventListener("negotiationneeded", onNegotationNeeded);
      localPeer.removeEventListener(
        "signalingstatechange",
        onSignalingStateChange,
      );
      localPeer.removeEventListener(
        "connectionstatechange",
        onConnectionStateChange,
      );
      localPeer.close();
      setPC(undefined);
    };
  }, []);

  return {
    pc,
    iceGatheringState,
    iceConnectionState,
    iceCandidates,
    iceCandidateErrors,
    tracks,
    channels,
    negotiationNeeded,
    signalingState,
    connectionState,
    addStream,
  };
}
