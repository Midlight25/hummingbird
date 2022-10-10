// Auth User Actions Cloud Functions File
// Author: Midlight25

import * as functions from "firebase-functions";

import {db} from "./admin";
import {UserRecord} from "firebase-functions/v1/auth";

/**
 * Creates a new user document for a user the first time they sign-up.
 *
 * @activation auth.user().onCreate() On first time sign-up for user
 */
export const newUserActivation = functions.auth.user().onCreate(
    (user: UserRecord) => {
      const loggerId = "userActivation";

      functions.logger.info(loggerId + ":called",
          {email: user.email, uid: user.uid});

      const userDoc = db.collection("users").doc(user.uid);

      // Fill public user info with properties
      userDoc.set({
        first_name: "",
        last_name: "",
        privilege: 0,
      });

      // TODO: Add registration of API Keys and or other privileges here.
      return 0;
    });
