import {CardinalDirection, DroneImageJSON, GPSLocaleDMS,
  HMPrediction, ImageRecord} from "./hummingbird-types";

export function exifGPStoDecimalDegrees(heading: GPSLocaleDMS): number {
  const degrees = heading[0][0] / heading[0][1];
  const minutes = heading[1][0] / heading[1][1];
  const seconds = heading[2][0] / heading[2][1];

  return degrees + (minutes / 60) + (seconds / 3600);
}

export function convertImgJSON<T extends DroneImageJSON>(data: T): ImageRecord {
  const latDMS = data.metadata.GPS.GPSLatitude;
  const longDMS = data.metadata.GPS.GPSLongitude;

  let latDD = exifGPStoDecimalDegrees(latDMS);
  let longDD = exifGPStoDecimalDegrees(longDMS);

  latDD = (data.metadata.GPS.GPSLatitudeRef == CardinalDirection.NORTH) ?
    latDD : -latDD;
  longDD = (data.metadata.GPS.GPSLongitudeRef == CardinalDirection.EAST) ?
    longDD : -longDD;

  const predictions = data.Predictions.map((pred) => {
    return new HMPrediction(pred.location, pred.label);
  });

  return new ImageRecord(
      [latDD, longDD],
      [data.metadata.Exif.PixelXDimension, data.metadata.Exif.PixelYDimension],
      predictions,
      data.metadata.Exif.FocalLength[0] / data.metadata.Exif.FocalLength[1],
      0.000017,
      data.metadata.gimbal_data.RelativeAltitude
  );
}
