// Safe loader for expo-camera.
// Top-level require() inside try-catch prevents the native module error from
// crashing the JS module and causing "missing default export" in Expo Router.
// When the dev build is rebuilt with expo-camera compiled in, camera auto-activates.

let _CameraView: any = null;
let _cameraAvailable = false;

try {
  const m = require('expo-camera');
  _CameraView = m.CameraView;
  _cameraAvailable = true;
} catch {
  // ExpoCamera native module not in this build — camera shows placeholder
}

export const CameraView = _CameraView;
export const cameraAvailable = _cameraAvailable;
