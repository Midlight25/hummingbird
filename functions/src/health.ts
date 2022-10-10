// Health Check Actions Cloud Function
// Author: Midlight25

import * as functions from "firebase-functions";

export const healthCheckFunction = functions.https.onRequest((req, res) => {
  functions.logger.info({event: "health-check:called"},
      "Health Check has been called");
  res.send(200);
});
