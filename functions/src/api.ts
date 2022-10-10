// Public API Endpoints Cloud Functions
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {DroneImageData} from "./lib/types";
import {checkAuth} from "./lib/auth";


export const registerBatchFunction = functions.https.onRequest((req, res) => {
  const loggerId = "registerBatch";

  if (req.get("content-type") !== "application/json") {
    functions.logger.error(loggerId + ":bad-content-type " +
    "Endpoint called without JSON.");
    res.sendStatus(400);
    return;
  }

  const key = req.get("access-key");

  if (!key) {
    functions.logger.error(loggerId + ":no-key-supplied");
    res.sendStatus(400);
    return;
  }

  if (!checkAuth(key)) {
    functions.logger.error(loggerId + ":unauthorized-attempt");
    res.sendStatus(401);
    return;
  }

  functions.logger.info(loggerId + ":called");

  const batchData = req.body;
  const processedData: Array<DroneImageData> = [];
  const queue = db.collection("inputQueue");

  functions.logger.debug(loggerId + ":report-json", {data: batchData});


  for (const value of Object.values(batchData)) {
    // @ts-ignore
    processedData.push(value);
  }

  functions.logger.debug("Number of images registered: ",
      processedData.length);

  res.sendStatus(200);
  return;
});