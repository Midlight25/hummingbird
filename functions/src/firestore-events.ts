// Firestore Events Endpoints
// Author: Midlight25

import * as functions from "firebase-functions";

export const queueFilledFunction = functions.firestore
    .document("submissionQueue/{docId}")
    .onCreate((snapshot, context) => {
      functions.logger.info({event: "submissionQueue:called"},
          "File uploaded to processing queue with ID", context.params.docId);
      // Analyze JSON data from upload and calculate GPS Coordinates of panels
      // Save to Firestore
      return null;
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
