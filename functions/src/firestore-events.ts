// Firestore Events Endpoints
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {hmPanelConverter, imageRecordConverter} from "./lib/hm_utils";
import {removeDuplicates} from "./lib/gis";
import {HMPanel} from "./lib/hummingbird-types";

const RESULTS = db.collection("panels");

export const queueFilledFunction = functions.firestore
    .document("inputQueue/{docId}")
    .onCreate(async (snapshot) => {
      const loggerId = "submissionQueue";

      const batchId: string = snapshot.id;
      const documentRef = snapshot.ref;
      const querySnapshot = await documentRef.collection("images")
          .withConverter(imageRecordConverter).get();
      const allPanels = new Array<HMPanel>();

      functions.logger.info(loggerId + ":called",
          {batchId: batchId});

      querySnapshot.forEach((imageDoc) => {
        const image = imageDoc.data();
        const panels = image.processHMPredictions(image.predictions);
        allPanels.push(...panels);
      });

      const filteredPanels = removeDuplicates(allPanels);

      filteredPanels.forEach((panel) => {
        RESULTS.doc(panel.id).withConverter(hmPanelConverter).set(panel);
      });

      functions.logger.info(loggerId + ":panels-processed",
          {numberPanelsFound: allPanels.length,
            numberPanelsRemoved: allPanels.length - filteredPanels.length});

      return;
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
