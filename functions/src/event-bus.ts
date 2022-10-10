// Event Bus Functions Dispatcher
// Author: Midlight25

import * as functions from "firebase-functions";

export const notifyUserofCompletion = functions.pubsub.topic("batch-done")
    .onPublish((details) => {
      functions.logger.info({event: "notifyUserOfCompletion:message-consumed",
        details: details});

      // Send push notification to desktop and email to user.
    });
