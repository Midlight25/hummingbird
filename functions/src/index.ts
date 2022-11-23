// Firebase Cloud Functions Index File
// Author: Midlight25 (Michael Mesquita)

import {healthCheckFunction} from "./health";
import {queueFilledFunction} from "./firestore-events";
import {registerBatchFunc, getBatchResultsFunc} from "./api";

export const health = healthCheckFunction;
export const queueFilled = queueFilledFunction;
export const registerBatch = registerBatchFunc;
export const getBatchResults = getBatchResultsFunc;
