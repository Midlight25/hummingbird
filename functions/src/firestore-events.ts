// Firestore Events Endpoints
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {hmPanelConverter, batchRecordConverter} from "./lib/hm_utils";
import {removeDuplicates} from "./lib/drone_image_analyzer";
import {HMPanel} from "./lib/hummingbird-types";

const RESULTS = db.collection("panels");
const DUPES = db.collection("duplicates");

export const queueFilledFunction = functions.firestore
    .document("inputQueue/{docId}")
    .onCreate(async (snapshot, context) => {
      const loggerId = "submissionQueue";

      const batchId: string = context.params.docId;
      const batch = batchRecordConverter.fromFirestore(snapshot);
      const allPanels = new Array<HMPanel>();

      functions.logger.info(loggerId + ":called",
          {batchId: batchId});

      batch.images.forEach((image) => {
        const panels = image.processHMPredictions(image.predictions, batchId);
        allPanels.push(...panels);
      });

      const filteredPanels = removeDuplicates(allPanels);
      const duplicatePanels = allPanels.filter(
          (i) => !filteredPanels.includes(i));

      filteredPanels.forEach((panel) => {
        RESULTS.doc(panel.id).withConverter(hmPanelConverter).set(panel);
      });
      duplicatePanels.forEach((panel) => {
        DUPES.doc(panel.id).withConverter(hmPanelConverter).set(panel);
      });

      functions.logger.info(loggerId + ":panels-processed",
          {numberPanelsFoundTotal: allPanels.length,
            numberPanelDuplicatesRemoved: duplicatePanels.length,
            numberPanelsSaved: filteredPanels.length,
            batchId: batchId});

      await snapshot.ref.update({processingDone: true});

      return;
    });
