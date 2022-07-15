// Health Check Actions Cloud Function
// Author: Midlight25

import * as functions from "firebase-functions";

export const healthCheck = functions.https.onRequest((req, res) => {
  functions.logger.info("health-check:called", {structuredData: true});
  res.send(200);
});
