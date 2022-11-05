// Firebase Cloud Functions Index File
// Author: Midlight25 (Michael Mesquita)

import {healthCheckFunction} from "./health";
// import {queueFilledFunction, checkForDupeFunction} from "./firestore-events";
import {registerBatchFunction} from "./api";

export const health = healthCheckFunction;
// export const queueFilled = queueFilledFunction;
// export const checkForDupe = checkForDupeFunction;
export const registerBatch = registerBatchFunction;
