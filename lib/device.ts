/**
 * Device capability helpers. MedVoice runs multi-GB AI models on-device, so
 * model choices must respect how much RAM the phone actually has.
 */
import { Platform } from "react-native";
import * as Device from "expo-device";
import { Paths } from "expo-file-system";

// Below this much total RAM, the 4B analysis model (~2.5 GB of weights) risks
// being killed by the Android OOM-killer mid-analysis. Stay on 1.7B.
const MIN_RAM_FOR_4B_GB = 6;

export function getTotalRamGB(): number | null {
  const bytes = Device.totalMemory;
  if (!bytes) return null;
  return bytes / 1024 ** 3;
}

// True when this phone should stay on the smaller 1.7B analysis model.
// Unknown RAM is treated as low-end — safer to recommend the small model.
export function isLowRamDevice(): boolean {
  const gb = getTotalRamGB();
  return gb === null || gb < MIN_RAM_FOR_4B_GB;
}

// Below this much total RAM, holding TWO llama.cpp models resident at once
// (analysis ~1.1 GB + embedding ~330 MB) risks an OOM kill. On such devices the
// chat keeps only the analysis model and uses keyword search instead.
const MIN_RAM_FOR_TWO_MODELS_GB = 6;

// True when the phone can keep the analysis AND embedding models resident
// together — so "Ask MedVoice" can use semantic (embedding) search without
// evicting the pinned analysis model. Requires llama.cpp support and enough RAM;
// unknown RAM is treated as low-end (safer → keyword search, no second model).
export function canHoldTwoModels(): boolean {
  if (!supportsLlamaCppModels()) return false;
  const gb = getTotalRamGB();
  return gb !== null && gb >= MIN_RAM_FOR_TWO_MODELS_GB;
}

// QVAC's llama.cpp engine (analysis + embedding models) needs Android 12+
// (API 31). On older devices (e.g. Galaxy S9+ on Android 10) it CRASHES
// NATIVELY at init — JS cannot catch that — so those models must never even
// be attempted there. Voice (Parakeet) and TTS use different engines and work.
export function supportsLlamaCppModels(): boolean {
  if (Platform.OS !== "android") return true;
  return typeof Platform.Version === "number" ? Platform.Version >= 31 : true;
}

// Free disk space in GB, or null if the platform can't report it. Used to warn
// before multi-GB model downloads on storage-starved phones.
export function getFreeDiskGB(): number | null {
  try {
    const bytes = Paths.availableDiskSpace;
    return typeof bytes === "number" ? bytes / 1024 ** 3 : null;
  } catch {
    return null;
  }
}
