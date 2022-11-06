import * as proj4 from "proj4";
import {GPSLocaleDMS, gpsPosition, pixelPosition} from "./types";

export function exifGPStoDecimalDegrees(heading: GPSLocaleDMS): number {
  const degrees = heading[0][0] / heading[0][1];
  const minutes = heading[1][0] / heading[1][1];
  const seconds = heading[2][0] / heading[2][1];

  return degrees + (minutes / 60) + (seconds / 3600);
}
/**
 * Get UTM-Zone from Longitude Degrees
 */
function utmZoneFromLon(longDeg: number): number {
  return (((longDeg + 180) / 6) % 60) + 1;
}

/**
 * Get UTM projection definition from longitude to use with proj4
 */
function proj4SetDef(longDeg: number): string {
  const utmZone = utmZoneFromLon(longDeg);
  const zDef = `+proj=utm +zone=${utmZone} + datum=WGS84 +units=m +no_defs`;

  return zDef;
}

/**
 * Find Ground Sample Distance as px/cm
 */
function findGSD(pixelSize: number, relativeAltitude: number,
    focalLength:number): number {
  const gsd = (pixelSize * relativeAltitude / focalLength) * 100;

  return gsd;
}

/**
 * Calculate pythagorean distance between two pixel positions
 */
function calcPixelDistance(boxCenter: pixelPosition,
    imageCenter: pixelPosition): number {
  const distance = Math.hypot(boxCenter[0] - imageCenter[0],
      boxCenter[1] - imageCenter[1]);
  return distance;
}

/**
 * Calculate the GPS position of a panel based of image metadata
 * @return {gpsPosition} Lat/Long of off-center object in image
 */
export function calculateGPSCoords(gpsInput: gpsPosition, pixelSize = 0.000017,
    relativeAltitude = 30, focalLength = 0.013, boxCenter: pixelPosition,
    imageCenter: pixelPosition): gpsPosition {
  const gsd = findGSD(pixelSize, relativeAltitude, focalLength);

  const aZone = utmZoneFromLon(gpsInput[1]);

  // eslint-disable-next-line
  proj4.defs([
    [
      "EPSG:4326",
      "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84",
      "+datum=WGS84 +units=degrees",
    ],
    [
      "EPSG:AUTO",
      proj4SetDef(gpsInput[1]),
    ],
  ]);

  // Conversion from (long/lat) to UTM (E/N)
  // ! USES DECIMAL DEGREES NOT DMS !!!
  const enM = proj4("EPSG:4326", "EPSG:AUTO", [gpsInput[1], gpsInput[0]]);
  const e4Digits = parseInt(enM[0].toFixed(4)); // easting
  const n4Digits = parseInt(enM[1].toFixed(4)); // northing

  // X,Y difference in points * gsd to obtain distance
  const xDiff = (boxCenter[0] - imageCenter[0]) * gsd;
  const yDiff = (boxCenter[1] - imageCenter[1]) * gsd;

  // New easting and northing values
  const newE = e4Digits - xDiff;
  const newN = n4Digits - yDiff;

  // Convert UTM to lat/long
  const utm = `+proj=utm +zone=${aZone}`;
  const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
  const utmToLatLong = proj4(utm, wgs84, [newE, newN]);

  return [utmToLatLong[0], utmToLatLong[1]];
}
