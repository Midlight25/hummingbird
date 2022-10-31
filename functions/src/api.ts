// Public API Endpoints Cloud Functions
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {DroneImageData, ImageDataRecord} from "./lib/types";

import {exifGPStoDecimalDegrees} from "./lib/gis";

export const registerBatchFunction = functions.https.onRequest((req, res) => {
  const loggerId = "registerBatch";

  if (req.get("content-type") !== "application/json") {
    functions.logger.error(loggerId + ":bad-content-type " +
    "Endpoint called without JSON.");
    res.sendStatus(400);
    return;
  }

  functions.logger.info(loggerId + ":called");

  const batchData = req.body;
  const processedData: Array<ImageDataRecord> = [];
  const queue = db.collection("inputQueue");

  // functions.logger.debug(loggerId + ":report-json", {data: batchData});

  for (const value of Object.values<DroneImageData>(batchData)) {
    const latDMS = value.metadata.GPS.GPSLatitude;
    const longDMS = value.metadata.GPS.GPSLongitude;

    const latDD = exifGPStoDecimalDegrees(latDMS);
    const longDD = exifGPStoDecimalDegrees(longDMS);

    const imageData: ImageDataRecord = {
      gpsPosition: [latDD, longDD],
      pixelSize: 0.000017,
      relativeAltitude: value.metadata.gimbal_data.RelativeAltitude,
      focalLength: value.metadata.Exif.FocalLength[0] /
        value.metadata.Exif.FocalLength[1],
      Predictions: value.Predictions,
      imageSize: [value.metadata.Exif.PixelXDimension,
        value.metadata.Exif.PixelYDimension],
    };

    processedData.push(imageData);
  }

  for (const image of processedData) {
    queue.add(image);
  }

  functions.logger.debug("Number of images registered: ",
      processedData.length);

  functions.logger.debug("Check it", {data: processedData});
  res.sendStatus(200);
  return;
});
