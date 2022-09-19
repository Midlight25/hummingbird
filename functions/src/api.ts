// Public API Endpoints Cloud Functions
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";


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
  const queue = db.collection("inputQueue");

  functions.logger.debug(loggerId + ":report-json", {data: batchData});


  for (const value of Object.values(batchData)) {
    const predictions = value.Predictions;
    const name = value.Filename;

    queue.add({predictions: predictions, name: name});
  }

  res.sendStatus(200);
  return;
});
