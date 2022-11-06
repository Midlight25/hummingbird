// Public API Endpoints Cloud Functions
// Author: Midlight25

import * as functions from "firebase-functions";
import {randomBytes} from "crypto";

import {db} from "./admin";
import {exifGPStoDecimalDegrees} from "./lib/gis";
import {DroneImageData, ImageDataRecord} from "./lib/types";

export const registerBatchFunc = functions.https.onRequest(async (req, res)=> {
  const loggerId = "registerBatch";

  if (req.get("content-type") !== "application/json") {
    functions.logger.error(loggerId + ":bad-content-type " +
    "Endpoint called without JSON.");
    res.sendStatus(400);
    return;
  }

  functions.logger.info(loggerId + ":called");

  const batchId = randomBytes(21).toString("base64").slice(0, 21);

  const batchData = req.body;
  const processedData: Array<ImageDataRecord> = [];
  const queue = db.collection("inputQueue");

  for (const value of Object.values<DroneImageData>(batchData)) {
    const latDMS = value.metadata.GPS.GPSLatitude;
    const longDMS = value.metadata.GPS.GPSLongitude;

    let latDD = exifGPStoDecimalDegrees(latDMS);
    let longDD = exifGPStoDecimalDegrees(longDMS);

    latDD = (value.metadata.GPS.GPSLatitudeRef === "S") ?
      -1 * latDD : latDD;
    longDD = (value.metadata.GPS.GPSLongitudeRef === "W") ?
      -1 * longDD : longDD;

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

  try {
    const batchRecord = await queue.add({"batchID": batchId});
    const imgSubCollection = batchRecord.collection("images");
    for (const image of processedData) {
      imgSubCollection.add(image);
    }
  } catch (exception) {
    functions.logger.error(loggerId + ":failed-to-create-batch-record",
        {exception: exception});
  }

  functions.logger.debug(loggerId + ":batch-registered",
      {batchID: batchId, numImagesRegistered: processedData.length});

  res.json({"batchID": batchId});
  return;
});
