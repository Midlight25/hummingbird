// Public API Endpoints Cloud Functions
// Author: Midlight25

import * as functions from "firebase-functions";
import {randomBytes} from "crypto";

import {db} from "./admin";
import {convertImgJSON, imageRecordConverter} from "./lib/hm_utils";
import {DroneImageJSON, ImageRecord} from "./lib/hummingbird-types";

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
  const rawData = req.body;
  const processedData: Array<ImageRecord> = [];
  const processingQueue = db.collection("inputQueue");

  for (const value of Object.values<DroneImageJSON>(rawData)) {
    const image: ImageRecord = convertImgJSON<DroneImageJSON>(value);
    processedData.push(image);
  }

  try {
    const batchRecord = await processingQueue.add({"batchID": batchId});
    const imgSubCollection = batchRecord.collection("images");
    for (const image of processedData) {
      imgSubCollection.withConverter(imageRecordConverter).add(image);
    }
  } catch (exception) {
    functions.logger.error(loggerId + ":failed-to-create-batch-record");
  }

  functions.logger.debug(loggerId + ":batch-registered",
      {batchID: batchId, numImagesRegistered: processedData.length});

  res.json({"batchID": batchId});
  return;
});
