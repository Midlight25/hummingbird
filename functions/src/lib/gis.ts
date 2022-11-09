import * as proj4 from "proj4";

type pixelPosition = [x: number, y: number];

export type gpsPositionDD = [latitude: number, longitude: number];

export interface Panel {
  gpsPositionDD: gpsPositionDD;
}

export interface Prediction {
  location: pixelPosition;
}

export class Image {
  gpsPositionDD: gpsPositionDD;
  imageSize: [x_size: number, y_size: number];
  focalLength = 0.013; // Always in meters
  pixelSize = 0.000017;
  relativeAltitude = 30; // Always in meters

  constructor(gpsPositionDD: gpsPositionDD, imageSize: [x: number, y: number],
      focalLength: number, pixelSize: number, relativeAltitude: number) {
    this.gpsPositionDD = gpsPositionDD;
    this.imageSize = imageSize;
    this.focalLength = focalLength;
    this.pixelSize = pixelSize;
    this.relativeAltitude = relativeAltitude;
  }


  /**
   * Generate Ground Sample Distance as px/cm from metadata
   */
  get gsd(): number {
    return (this.pixelSize * this.relativeAltitude / this.focalLength) * 100;
  }

  /**
   * Generate UTM Zone definition from longitude for use with Proj4
   */
  get proj4SetDef(): string {
    return `+proj=utm +zone=${this.utmZone} + datum=WGS84 +units=m +no_defs`;
  }

  /**
   * Get UTM-Zone from Longitude Degrees
   */
  get utmZone(): number {
    return (((this.gpsPositionDD[1] + 180) / 6) % 60) + 1;
  }

  /**
  * Calculate the GPS position of a panel based of image metadata
  * @return {gpsPositionDD} Lat/Long of off-center object in image
  */
  calculateGPSCoords<T extends Prediction>(item: T): gpsPositionDD {
    const imageCenter = this.imageSize.map((value) => Math.floor(value / 2));

    // eslint-disable-next-line
    proj4.defs([
      [
        "EPSG:4326",
        "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84",
        "+datum=WGS84 +units=degrees",
      ],
      [
        "EPSG:AUTO",
        this.proj4SetDef,
      ],
    ]);

    // Conversion from (long/lat) to UTM (E/N)
    // ! USES DECIMAL DEGREES NOT DMS !!!
    const enM = proj4("EPSG:4326", "EPSG:AUTO",
        [this.gpsPositionDD[1], this.gpsPositionDD[0]]);
    const e4Digits = parseInt(enM[0].toFixed(4)); // easting
    const n4Digits = parseInt(enM[1].toFixed(4)); // northing

    // X,Y difference in points * gsd to obtain distance
    const xDiff = (item.location[0] - imageCenter[0]) * this.gsd;
    const yDiff = (item.location[1] - imageCenter[1]) * this.gsd;

    // New easting and northing values
    const newE = e4Digits - xDiff;
    const newN = n4Digits - yDiff;

    // Convert UTM to lat/long
    const utm = `+proj=utm +zone=${this.utmZone}`;
    const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    const utmToLatLong = proj4(utm, wgs84, [newE, newN]);

    return [utmToLatLong[0], utmToLatLong[1]];
  }
}

/**
 * Calculate pythagorean distance between two pixel positions
 */
function calcPixelDistance(locA: pixelPosition, locB: pixelPosition): number {
  return Math.hypot(locA[0] - locB[0],
      locA[1] - locB[1]);
}
