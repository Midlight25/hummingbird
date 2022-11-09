import {GPSLocaleDMS} from "./types";


export function exifGPStoDecimalDegrees(heading: GPSLocaleDMS): number {
  const degrees = heading[0][0] / heading[0][1];
  const minutes = heading[1][0] / heading[1][1];
  const seconds = heading[2][0] / heading[2][1];

  return degrees + (minutes / 60) + (seconds / 3600);
}
