// Screen-space pan for the isometric view.
// rightAmount moves the focus along the camera's ground-right.
// forwardAmount moves it toward the horizon.

export const GARDEN_VIEW_LIMIT = 18.5;

export function offsetFocus(focus, azimuth, rightAmount, forwardAmount, limit = GARDEN_VIEW_LIMIT) {
  const rightX = -Math.cos(azimuth);
  const rightZ = Math.sin(azimuth);
  const forwardX = -Math.sin(azimuth);
  const forwardZ = -Math.cos(azimuth);
  return {
    x: clamp(focus.x + rightX * rightAmount + forwardX * forwardAmount, -limit, limit),
    z: clamp(focus.z + rightZ * rightAmount + forwardZ * forwardAmount, -limit, limit),
  };
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
