import { Detection } from "./detection";

export function elementFit(ref?: HTMLElement | null) {
  if (!ref) return;
  const w = ref.clientWidth;
  const h = ref.clientHeight;

  function reSize(child: HTMLElement) {
    if (w < h) {
      child.style.width = "100%";
      child.style.height = "unset";
    }

    if (h < w) {
      child.style.height = "100%";
      child.style.width = "unset";
    }

    if (h === w) {
      child.style.height = "100%";
      child.style.width = "100%";
    }
  }

  function update() {
    if (!ref) return;
    for (const child of ref.children) {
      reSize(child as HTMLElement);
    }
  }

  function onfullscreenchange() {
    update();
  }

  update();
  document.addEventListener("fullscreenchange", onfullscreenchange);
  ref.addEventListener("resize", update);

  return () => {
    document.removeEventListener("fullscreenchange", onfullscreenchange);
    ref.removeEventListener("resize", update);
  };
}

export function elementDetection(
  detection: Detection,
  el?: HTMLVideoElement | null,
) {
  return (ref?: HTMLElement | null) => {
    el?.addEventListener("loadedmetadata", place);
    place();

    function place() {
      if (!el || !ref) return;
      let aspectRatio = el.videoWidth / el.videoHeight;
      const dRect = el.getBoundingClientRect();

      let widthR: number = dRect.height * aspectRatio;
      let heightR: number = dRect.width / aspectRatio;

      if (widthR > dRect.width) {
        widthR = dRect.width;
      }

      if (heightR > dRect.height) {
        heightR = dRect.height;
      }

      const wof = dRect.width - widthR;
      const hof = dRect.height - heightR;

      const tx = dRect.x + wof / 2;
      const ty = dRect.y + hof / 2;

      const topx = detection.topx * widthR + tx;
      const topy = detection.topy * heightR + ty;
      const botx = detection.botx * widthR + tx;
      const boty = detection.boty * heightR + ty;

      ref.style.top = topy + "px";
      ref.style.left = topx + "px";
      ref.style.width = botx - topx + "px";
      ref.style.height = boty - topy + "px";
    }
  };
}

export async function pickFiles(opts?: {
  multiple?: boolean;
  accept?: string;
}) {
  const result = Promise.withResolvers<File[]>();
  const input = document.createElement("input");
  input.multiple = opts?.multiple ?? false;
  input.accept = opts?.accept ?? "*";
  input.type = "file";
  input.oncancel = result.reject;
  input.onchange = () => {
    const files = Array.from(input.files ?? []);
    result.resolve(files);
  };
  input.click();

  return result.promise;
}

export function zip(a: any[], b: any[]) {
  return a.map(function (e, i) {
    return [e, b[i]];
  });
}

export function getany<T>(
  obj: any,
  keys: any[],
  defaultValue?: T,
): T | undefined {
  let value = obj;

  for (const key of keys) {
    if (value && key in value) {
      value = value[key];
    } else {
      return defaultValue;
    }
  }

  return value ?? defaultValue;
}
