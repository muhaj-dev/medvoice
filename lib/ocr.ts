/**
 * On-device OCR — extracts text from a scanned document photo.
 *
 * Uses Google ML Kit text recognition (@react-native-ml-kit/text-recognition),
 * which runs ENTIRELY on the device. The image and the recognized text never
 * leave the phone — same privacy promise as every other MedVoice AI feature.
 *
 * Safe-loader pattern (mirrors lib/cameraModule.ts): the native module only
 * exists in a dev build that was rebuilt with this dependency compiled in. The
 * top-level require() is wrapped so a missing native module degrades to
 * "OCR unavailable" instead of crashing the JS bundle (Expo Go / web).
 */

import { Directory, File, Paths } from "expo-file-system";

type RecognizeResult = { text: string };
type RecognizeFn = (uri: string) => Promise<RecognizeResult>;

let _recognize: RecognizeFn | null = null;
let _ocrAvailable = false;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const m = require("@react-native-ml-kit/text-recognition");
  const TextRecognition = m?.default ?? m;
  if (TextRecognition && typeof TextRecognition.recognize === "function") {
    _recognize = (uri: string) => TextRecognition.recognize(uri);
    _ocrAvailable = true;
  }
} catch {
  // ML Kit native module not in this build — OCR shows an "unavailable" state.
}

export const ocrAvailable = _ocrAvailable;

/**
 * Recognize text in a captured photo.
 *
 * @param imageUri - A local file:// URI from expo-camera's takePictureAsync.
 * @returns The recognized text, trimmed. Empty string when nothing is found or
 *          the native module is missing — callers fall back gracefully.
 */
export async function extractTextFromImage(imageUri: string): Promise<string> {
  if (!_recognize) return "";
  const result = await _recognize(imageUri);
  return (result?.text ?? "").trim();
}

/**
 * Move a captured scan photo out of the temporary camera cache into a permanent
 * app folder so it survives after the scan flow closes and the cache is cleared.
 * Returns the new persistent file:// URI; falls back to the original URI if the
 * copy fails so saving an entry never breaks over a missing image.
 *
 * @param imageUri - The cache file:// URI from expo-camera's takePictureAsync.
 * @param id       - The HealthEntry id, used to name the file deterministically.
 */
export function persistScanImage(imageUri: string, id: string): string {
  try {
    const dir = new Directory(Paths.document, "scans");
    if (!dir.exists) dir.create({ intermediates: true });
    const ext = imageUri.split(".").pop()?.split("?")[0] || "jpg";
    const dest = new File(dir, `${id}.${ext}`);
    if (dest.exists) dest.delete();
    new File(imageUri).copy(dest);
    return dest.uri;
  } catch {
    return imageUri;
  }
}
