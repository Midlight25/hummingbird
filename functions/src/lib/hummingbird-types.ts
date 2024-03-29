import {Image, gpsPositionDD, Panel, Prediction, pixelPosition}
  from "./drone_image_analyzer";
import {randomBytes} from "crypto";

export interface DroneImageJSON {
  Predictions: Array<PredictionJSON>,
  Filename: string,
  metadata: MetadataJSON,
}

export interface PredictionJSON {
  box: [
    topLeftX: number,
    topLeftY: number,
    botRightX: number,
    botRightY: number
  ],
  center: [x: number, y: number]
  label: FailureLabel,
  label_id: number,
  score: number
}


export enum FailureLabel {
    EDGE_HOTSPOT = "Edge Hotspot",
    LINEAR_HOTSPOT = "Linear Hotspot",
    MULTIPLE_CELL_HOTSPOT = "Multiple Cell Hotspot",
    PANEL_FAILURE = "Panel Failure",
    PID = "Potential Induced degradation",
    SECTIONAL_OUTAGE = "Sectional Outage",
    SINGLE_HOTSPOT = "Single Hotspot",
    STRING_FAILURE = "String Failure",
    STRING_SHORT_CIRCUIT = "String Short Circuit"
}

interface MetadataJSON {
  // "0th": number,
  // "1st": number,
  Exif: ExifDataJSON,
  GPS: GPSDataJSON,
  // Interop: Record<string, unknown>,
  gimbal_data: GimbalDataJSON,
}

interface ExifDataJSON {
  ExposureTime: [number, number],
  FNumber: [number, number],
  ExposureProgram: number,
  ISOSpeedRatings: number,
  ExifVersion: string,
  DateTimeOriginal: string,
  DateTimeDigitized: string,
  ComponentsConfiguration: string,
  ShutterSpeedValue: [number, number],
  ApertureValue: [number, number],
  FocalLength: [length: number, significance: number],
  PixelXDimension: number,
  PixelYDimension: number,
}

interface GimbalDataJSON {
  AbsoluteAltitude: number,
  RelativeAltitude: number,
  GimbalRollDegree: number,
  GimbalYawDegree: number,
  GimbalPitchDegree: number,
  FlightRollDegree: number,
  FlightYawDegree: number,
  FlightPitchDegree: number,
  CamReverse: number,
  GimbalReverse: number,
  RtkFlag: number,
}

interface GPSDataJSON {
  GPSVersionID: [major: number, minor: number, patch: number, release: number],
  GPSLatitudeRef: CardinalDirection,
  GPSLatitude: GPSLocaleDMS,
  GPSLongitudeRef: CardinalDirection,
  GPSLongitude: GPSLocaleDMS,
  GPSAltitudeRef: number,
  GPSAltitude: [height: number, significance: number],
}

export enum CardinalDirection {
  NORTH = "N",
  EAST = "E",
  SOUTH = "S",
  WEST = "W",
}

export class HMImage extends Image {
  predictions: Array<HMPrediction>;

  constructor(gpsPositionDD: gpsPositionDD, imageSize: [x: number, y: number],
      predictions: Array<HMPrediction>, focalLength?: number,
      pixelSize?: number, relativeAltitude?: number) {
    super(gpsPositionDD, imageSize, focalLength, pixelSize, relativeAltitude);
    this.predictions = predictions;
  }

  processHMPredictions<T extends HMPrediction>(
      predictions: T[], batchId: string): HMPanel[] {
    const panels = super.processPredictions(predictions);
    const hmPanels = panels.map((panel, index) => {
      return new HMPanel(panel.gpsPositionDD, predictions[index].label,
          panel.truePanel, batchId);
    });
    return hmPanels;
  }
}

export class HMPanel implements Panel {
  id: string;
  faultType: FailureLabel;
  gpsPositionDD: gpsPositionDD;
  truePanel: boolean;
  batchId: string;

  constructor(gpsPositionDD: gpsPositionDD, faultType: FailureLabel,
      truePanel = false, batchId = "", id = "") {
    this.faultType = faultType;
    this.gpsPositionDD = gpsPositionDD;
    this.truePanel = truePanel;
    this.id = id ? id : randomBytes(16).toString("hex").slice(0, 16);
    this.batchId = batchId;
  }
}

// Location and label
export class HMPrediction implements Prediction {
  label: FailureLabel;
  location: pixelPosition;

  constructor(location: pixelPosition, label: FailureLabel) {
    this.location = location;
    this.label = label;
  }
}

export interface Batch {
  // Whether or not this batch has been calculated and can thus be discarded
  processingDone: boolean,
  images: HMImage[],
}

export type GPSLocaleDMS = [
  [degrees: number, significance: number],
  [minutes: number, significance: number],
  [seconds: number, significance: number]
];

export interface BatchFirestoreRecord {
  processingDone: boolean,
  images: ImageFirestoreRecord[],
}

export interface ImageFirestoreRecord {
  predictions: PredictionFirestoreRecord[],
  gpsPositionDD: gpsPositionDD,
  imageSize: [x: number, y: number],
  focalLength: number,
  pixelSize: number,
  relativeAltitude: number,

}

export interface PredictionFirestoreRecord extends Prediction {
  label: FailureLabel
}

export interface PanelFirestoreRecord extends Panel {
  faultType: FailureLabel,
  batchId: string,
}
