export interface DroneImageData {
  Predictions: Array<Prediction>,
  Filename: string,
  metadata: Metadata,
}

export interface Prediction {
  box: [
    topLeftX: number,
    topLeftY: number,
    botRightX: number,
    botRightY: number
  ],
  center: [
    x: number,
    y: number
  ],
  label: FailureLabel,
  label_id: number,
  score: number
}

export interface PanelData {
  id: string,
  location: gpsPosition,
  faultType: FailureLabel,
  truePanel: boolean
}

enum FailureLabel {
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

interface Metadata {
  // "0th": number,
  // "1st": number,
  Exif: ExifData,
  GPS: GPSData,
  // Interop: Record<string, unknown>,
  gimbal_data: GimbalData,
}

interface ExifData {
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

interface GimbalData {
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

interface GPSData {
  GPSVersionID: [major: number, minor: number, patch: number, release: number],
  GPSLatitudeRef: CardinalDirection,
  GPSLatitude: GPSLocaleDMS,
  GPSLongitudeRef: CardinalDirection,
  GPSLongitude: GPSLocaleDMS,
  GPSAltitudeRef: number,
  GPSAltitude: [height: number, significance: number],
}

type CardinalDirection = ("N" | "E" | "S" | "W")

export type GPSLocaleDMS = [
  [degrees: number, significance: number],
  [minutes: number, significance: number],
  [seconds: number, significance: number],
]

export interface ImageDataRecord {
    gpsPosition: number[];
    pixelSize: number;
    relativeAltitude: number;
    focalLength: number;
    Predictions: Prediction[];
    imageSize: number[];
}

export type pixelPosition = [x: number, y: number];
export type gpsPosition = [lat: number, long: number];
