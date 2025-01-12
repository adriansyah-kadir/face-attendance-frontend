import { useEffect, useState } from "react";

type Config = {
  url: string,
  protocols?: string[],
  onMessageHandler?: (ev: WebSocketEventMap["message"]) => void
  onOpenHandler?: (ev: WebSocketEventMap["open"]) => void
  onCloseHandler?: (ev: WebSocketEventMap["close"]) => void
  onErrorHandler?: (ev: WebSocketEventMap["error"]) => void
}

export function useWS({ url, protocols, onMessageHandler, onOpenHandler, onCloseHandler, onErrorHandler }: Config) {
  const [ws, setWS] = useState<WebSocket>()
  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const [close, setClose] = useState<CloseEvent>()

  async function onOpen(ev: WebSocketEventMap["open"]) {
    console.debug("ws open")
    onOpenHandler?.call(undefined, ev)
    setOpen(true)
  }

  async function onClose(ev: WebSocketEventMap["close"]) {
    console.debug("ws close", ev)
    onCloseHandler?.call(undefined, ev)
    setClose(ev)
  }

  async function onError(ev: WebSocketEventMap["error"]) {
    console.debug("ws error")
    onErrorHandler?.call(undefined, ev)
    setError(true)
  }

  async function onMessage(ev: WebSocketEventMap["message"]) {
    console.debug("ws message", ev)
    onMessageHandler?.call(undefined, ev)
  }

  useEffect(() => {
    ws?.addEventListener("open", onOpen)
    ws?.addEventListener("close", onClose)
    ws?.addEventListener("error", onError)
    ws?.addEventListener("message", onMessage)
    return () => {
      ws?.removeEventListener("open", onOpen)
      ws?.removeEventListener("close", onClose)
      ws?.removeEventListener("error", onError)
      ws?.removeEventListener("message", onMessage)
      ws?.close()
    }
  }, [ws])

  useEffect(() => {
    setWS(new WebSocket(url, protocols))
  }, [])

  return { ws, open, error, close }
}
