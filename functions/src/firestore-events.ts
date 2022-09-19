// Firestore Events Endpoints
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {getRandomInRange} from "./lib/generator";

const results = db.collection("panels");

export const queueFilledFunction = functions.firestore
    .document("inputQueue/{docId}")
    .onCreate((snapshot, context) => {
      functions.logger.info({event: "submissionQueue:called"},
          "File uploaded to processing queue with ID", context.params.docId);

      const lat = getRandomInRange(-180, 180, 3);
      const long = getRandomInRange(-180, 180, 3);
      const panelId: string = context.params.docId;

      results.add({lat: lat, long: long, panelId: panelId});

      db.collection("inputQueue").doc(context.params.docId).delete();
      return;
    });

export const checkForDupeFunction = functions.firestore
    .document("panels/{panelID}")
    .onCreate((snapshot, context) => {
      functions.logger.info({event: "checkForDupe:called"},
          "New panel with ID",
          context.params.panelID,
          "has been saved to Firestore");
      // Check if panel isn't duplicate using threshold TBD
      functions.logger.warn({event: "checkForDupe:success"},
          "Removing Panel with ID",
          context.params.panelID,
          "Reason: Duplicate");
    });
