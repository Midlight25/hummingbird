import * as proj4 from "proj4";
// import haversine from "haversine-distance";
import * as haversine from "haversine-distance";

type pixelPosition = [x: number, y: number];

export type gpsPositionDD = [latitude: number, longitude: number];

export interface Panel {
  gpsPositionDD: gpsPositionDD;
  // This panel's gps coordinates are accurate enough to be considered true.
  truePanel: boolean;
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
   * Calculate image centerpoint from image size
   */
  get imageCenter(): [x: number, y: number] {
    return [Math.floor(this.imageSize[0] / 2),
      Math.floor(this.imageSize[1] / 2)];
  }

  /**
   * Calculate radius around center to be considered true panel zone.
   */
  get threshold(): number {
    return this.imageSize[1] * 0.1;
  }

  /**
   * Calculate the GPS position of a panel based of image metadata
   * @return {gpsPositionDD} Lat/Long of off-center object in image
   */
  calcGPSCoords<T extends Prediction>(item: T): gpsPositionDD {
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
    const xDiff = (item.location[0] - this.imageCenter[0]) * this.gsd;
    const yDiff = (item.location[1] - this.imageCenter[1]) * this.gsd;

    // New easting and northing values
    const newE = e4Digits - xDiff;
    const newN = n4Digits - yDiff;

    // Convert UTM to lat/long
    const utm = `+proj=utm +zone=${this.utmZone}`;
    const wgs84 = "+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs";
    const utmToLatLong = proj4(utm, wgs84, [newE, newN]);

    return [utmToLatLong[0], utmToLatLong[1]];
  }

  /**
   * Process predictions and report as panel array.
   */
  processPredictions<T extends Prediction>(predictions: T[]): Panel[] {
    const gpsPos = predictions.map((pred) => this.calcGPSCoords(pred));

    const panels: Panel[] = gpsPos.map((gps) => {
      return {gpsPositionDD: gps, truePanel: false};
    });

    const pixDistances = predictions.map((pred) =>
      this.calcPixelDistance(pred.location));
    const minDistance = Math.min(...pixDistances);
    const minDistIndex = pixDistances.indexOf(minDistance);

    if (minDistance < this.threshold) {
      panels[minDistIndex].truePanel = true;
    }

    return panels;
  }

  /**
   * Calculate pythagorean distance from center point of image
   */
  calcPixelDistance(locA: pixelPosition): number {
    return Math.hypot(locA[0] - this.imageCenter[0],
        locA[1] - this.imageCenter[1]);
  }
}

/**
 * Filter panels for duplicates, true panels are untouched.
 * Distance Threshold should be width of solar panel minus 5-10% ish
 */
export function removeDuplicates<T extends Panel>(panels: T[],
    distanceThreshold = 0.90): T[] {
  const truePanels = panels.filter((item) => item.truePanel);
  const predicts = panels.filter((item) => !item.truePanel);

  predicts.forEach((panel) => {
    const distancesMeters = truePanels.map((tPanel) =>
      haversine(tPanel.gpsPositionDD, panel.gpsPositionDD));
    // Accounting for truePanels possibly being empty
    distancesMeters.push(Number.POSITIVE_INFINITY);
    const minDistance = Math.min(...distancesMeters);
    if (minDistance > distanceThreshold) {
      truePanels.push(panel);
    }
  });

  return truePanels;
}
