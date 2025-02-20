import { toast } from "sonner";
import { Detection } from "./detection";
import ExcelJS from "exceljs"

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

export function downloadJSON(data: object, filename = "data.json") {
  // Convert object to JSON string
  const jsonString = JSON.stringify(data, null, 2); // Pretty format with 2 spaces

  // Create a Blob with MIME type application/json
  const blob = new Blob([jsonString], { type: "application/json" });

  // Create a temporary anchor element
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;

  // Append to body, trigger click, then remove it
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export async function saveToExcel<T extends object>(data: Array<T>, filename = 'output.xlsx') {
  if (!Array.isArray(data) || data.length === 0) {
    toast.error('Data tidak boleh kosong')
  }

  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Sheet1');

  // Extract column names dynamically from the first object
  const columns = Object.keys(data[0]).map(key => ({ header: key, key }));
  worksheet.columns = columns;

  // Add rows
  data.forEach(item => {
    worksheet.addRow(item);
  });

  // Save file
  let buffer = await workbook.xlsx.writeBuffer();
  let blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  let link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}
