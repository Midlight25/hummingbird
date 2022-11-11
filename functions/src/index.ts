// Firebase Cloud Functions Index File
// Author: Midlight25 (Michael Mesquita)

import {healthCheckFunction} from "./health";
// import {queueFilledFunction} from "./firestore-events";
import {registerBatchFunc} from "./api";

export const health = healthCheckFunction;
// export const queueFilled = queueFilledFunction;
export const registerBatch = registerBatchFunc;
