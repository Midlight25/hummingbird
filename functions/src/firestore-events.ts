// Firestore Events Endpoints
// Author: Midlight25

import * as functions from "firebase-functions";
import {randomBytes} from "crypto";
import {PanelData, Prediction, pixelPosition} from "./lib/types";
import {calculateGPSCoords} from "./lib/gis";

import {db} from "./admin";

const RESULTS = db.collection("panels");

export const queueFilledFunction = functions.firestore
    .document("inputQueue/{docId}")
    .onCreate((snapshot, context) => {
      functions.logger.info({event: "submissionQueue:called"},
          "File uploaded to processing queue with ID", context.params.docId);

      const documentData = snapshot.data();
      const batchId: string = documentData.batchID;

      const documentRef = snapshot.ref;

      documentRef.collection("images").get().then((images) => {
        images.forEach((image) => {
          const imageData = image.data();

          const focalLength: number = imageData.focalLength;
          const gpsPosition: [number, number] = imageData.gpsPosition;
          const imageSize: [number, number] = imageData.imageSize;
          const relativeAltitude: number = imageData.relativeAltitude;
          const pixelSize: number = imageData.pixelSize;

          const imageCenter: pixelPosition = [
            Math.floor(imageSize[0] / 2),
            Math.floor(imageSize[1] / 2),
          ];

          const panelsInImage = Array<PanelData>();

          imageData.Predictions.forEach((prediction: Prediction) => {
            const gpsPredict = calculateGPSCoords(gpsPosition, pixelSize,
                relativeAltitude, focalLength, prediction.center, imageCenter);
            const panelId = randomBytes(16).toString("base64").slice(0, 16);

            panelsInImage.push({
              id: panelId,
              location: gpsPredict,
              faultType: prediction.label,
              truePanel: true,
            });
          });

          functions.logger.info("Image found",
              {data: panelsInImage});
        });
      });

      db.collection("inputQueue").doc(context.params.docId).delete();
      return 0;
    });

// export const checkForDupeFunction = functions.firestore
//     .document("panels/{panelID}")
//     .onCreate((snapshot, context) => {
//       functions.logger.info({event: "checkForDupe:called"},
//           "New panel with ID",
//           context.params.panelID,
//           "has been saved to Firestore");
//       // Check if panel isn't duplicate using threshold TBD
//       functions.logger.warn({event: "checkForDupe:success"},
//           "Removing Panel with ID",
//           context.params.panelID,
//           "Reason: Duplicate");
//     });
