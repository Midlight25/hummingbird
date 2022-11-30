// Public API Endpoints Cloud Functions
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {batchRecordConverter, convertImgJSON,
  hmPanelConverter} from "./lib/hm_utils";
import {DroneImageJSON, HMImage, HMPanel} from "./lib/hummingbird-types";

export const registerBatchFunc = functions.https.onRequest(async (req, res)=> {
  const loggerId = "registerBatch";

  if (req.get("content-type") !== "application/json") {
    functions.logger.error(loggerId + ":bad-content-type " +
    "Endpoint called without JSON.");
    res.sendStatus(400);
    return;
  }

  functions.logger.info(loggerId + ":called");

  const rawData = req.body;
  const processedData: Array<HMImage> = [];
  const processingQueue = db.collection("inputQueue");

  for (const value of Object.values<DroneImageJSON>(rawData)) {
    const image: HMImage = convertImgJSON<DroneImageJSON>(value);
    processedData.push(image);
  }

  try {
    const batchRecord = await processingQueue
        .withConverter(batchRecordConverter)
        .add({processingDone: false, images: processedData});
    // const imgSubCollection = batchRecord.collection("images");
    // for (const image of processedData) {
    //   imgSubCollection.withConverter(imageRecordConverter).add(image);
    // }

    functions.logger.debug(loggerId + ":batch-registered",
        {batchID: batchRecord.id, numImagesRegistered: processedData.length});
    res.json({"batchID": batchRecord.id});
  } catch (exception) {
    functions.logger.error(loggerId + ":failed-to-create-batch-record");
    res.sendStatus(500);
  }

  return;
});

export const getBatchResultsFunc = functions.https.onRequest(
    async (req, res) => {
      const loggerId = "getBatchResults";
      const batchId = req.query.batchId;
      const panels = new Array<HMPanel>();


      try {
        const panelRecords = await db.collection("panels")
            .where("batchId", "==", batchId)
            .withConverter(hmPanelConverter)
            .get();

        panelRecords.forEach((document) => {
          panels.push(document.data());
        // const panel = document.data();
        // panels.push(panel);
        });

        functions.logger.info(loggerId + ":called",
            {batchIdRequested: batchId,
              numPanelSent: panels.length});

        if (panels.length > 0) {
          res.json(panels);
        } else {
          res.sendStatus(404);
        }
      } catch (error) {
        functions.logger.error(loggerId + ":unexpected-error",
            {error: error});
        res.sendStatus(500);
      }
    });
