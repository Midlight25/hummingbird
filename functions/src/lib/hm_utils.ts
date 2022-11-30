import {DocumentData, QueryDocumentSnapshot} from "firebase-admin/firestore";
import {BatchFirestoreRecord, CardinalDirection, DroneImageJSON, GPSLocaleDMS,
  HMPanel, HMPrediction, ImageFirestoreRecord, HMImage,
  PredictionFirestoreRecord, PanelFirestoreRecord, Batch}
  from "./hummingbird-types";

export function exifGPStoDecimalDegrees(heading: GPSLocaleDMS): number {
  const degrees = heading[0][0] / heading[0][1];
  const minutes = heading[1][0] / heading[1][1];
  const seconds = heading[2][0] / heading[2][1];

  return degrees + (minutes / 60) + (seconds / 3600);
}

export function convertImgJSON<T extends DroneImageJSON>(data: T): HMImage {
  const latDMS = data.metadata.GPS.GPSLatitude;
  const longDMS = data.metadata.GPS.GPSLongitude;

  let latDD = exifGPStoDecimalDegrees(latDMS);
  let longDD = exifGPStoDecimalDegrees(longDMS);

  latDD = (data.metadata.GPS.GPSLatitudeRef == CardinalDirection.NORTH) ?
    latDD : -latDD;
  longDD = (data.metadata.GPS.GPSLongitudeRef == CardinalDirection.EAST) ?
    longDD : -longDD;

  const predictions = data.Predictions.map((pred) => {
    return new HMPrediction(pred.center, pred.label);
  });

  return new HMImage(
      [latDD, longDD],
      [data.metadata.Exif.PixelXDimension, data.metadata.Exif.PixelYDimension],
      predictions,
      data.metadata.Exif.FocalLength[0] /
      data.metadata.Exif.FocalLength[1] / 1000,
      0.000017,
      data.metadata.gimbal_data.RelativeAltitude
  );
}

export const batchRecordConverter = {
  toFirestore: (batch: Batch) : BatchFirestoreRecord => {
    const imagesFrs: ImageFirestoreRecord[] = batch.images.map((image) => {
      const predictions: PredictionFirestoreRecord[] =
        image.predictions.map((pred) => {
          return {location: pred.location, label: pred.label};
        });
      return {
        gpsPositionDD: image.gpsPositionDD,
        imageSize: image.imageSize,
        predictions: predictions,
        focalLength: image.focalLength,
        pixelSize: image.pixelSize,
        relativeAltitude: image.relativeAltitude,

      };
    });
    return {processingDone: batch.processingDone, images: imagesFrs};
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>)
  : Batch => {
    const batchRec = snapshot.data();
    const images: HMImage[] = batchRec.images
        .map((image: ImageFirestoreRecord) => {
          const predictions = image.predictions.map((pred) => {
            return new HMPrediction(pred.location, pred.label);
          });
          return new HMImage(
              image.gpsPositionDD,
              image.imageSize,
              predictions,
              image.focalLength,
              image.pixelSize,
              image.relativeAltitude,
          );
        });
    return {processingDone: batchRec.processingDone, images: images};
  },
};

export const hmPanelConverter = {
  toFirestore: (panel: HMPanel): PanelFirestoreRecord => {
    return {
      faultType: panel.faultType,
      gpsPositionDD: panel.gpsPositionDD,
      truePanel: panel.truePanel,
      batchId: panel.batchId,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>) => {
    const docData = snapshot.data();
    return new HMPanel(docData.gpsPositionDD, docData.faultType,
        docData.truePanel, docData.batchId, snapshot.id);
  },
};
