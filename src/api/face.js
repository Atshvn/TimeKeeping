import * as faceapi from 'face-api.js';

const maxDescriptorDistance = 0.4;

export async function loadModels() {
  const MODEL_URL = process.env.PUBLIC_URL + '/models';
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
  // await faceapi.nets.mtcnn.loadFromUri(MODEL_URL)
  // await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  // await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  // await faceapi.loadFaceExpressionModel(MODEL_URL)
  // await  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
  // await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
}

//SsdMobilenetv1 model full face
export async function getFullFaceDescription(blob, inputSize = 320) {
  if(!blob) return;
  // tiny_face_detector options
  const OPTION = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.8 
    // inputSize,
    // scoreThreshold,
    // maxResults
  });

  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks()
    .withFaceDescriptors();
  return fullDesc;
}


//model TinyFaceDetector
export async function getFaceDescription(blob, inputSize = 320) {
  if(!blob) return;
  // tiny_face_detector options
  let scoreThreshold = 0.9;
  let maxResults = 1000;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
    maxResults
  });

  let img = await faceapi.fetchImage(blob);
  let fullDesc = await faceapi.detectSingleFace(img, OPTION).withFaceLandmarks().withFaceDescriptor()
  return fullDesc;
}


//SsdMobilenetv1 model
export async function getFaceDescriptionSsd(blob, inputSize = 320) {
  if(!blob) return;
 
  const OPTION = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.8 
  });

  let img = await faceapi.fetchImage(blob);
  let fullDesc = await faceapi.detectSingleFace(img, OPTION).withFaceLandmarks().withFaceDescriptor()
  
  return fullDesc
}

//SsdMobilenetv1 model
export async function getFaceDescriptionSsdBlob(blob) {
  if(!blob) return;
 
  const OPTION = new faceapi.SsdMobilenetv1Options({
    minConfidence: 0.8 
  });

  let img = await faceapi.fetchImage(blob);
  let fullDesc = await faceapi.detectSingleFace(img, OPTION).withFaceLandmarks().withFaceDescriptor()
  return {fullDesc, blob}
}

//Mtcnn model
export async function getFaceDescriptionMtcnn(blob, inputSize = 320) {
  if(!blob) return;
 
  const OPTION = new faceapi.MtcnnOptions({
    minFaceSize: 100,
    scoreThresholds: [0.8, 0.9, 0.9],
    scaleFactor: 0.8
  });

  let img = await faceapi.fetchImage(blob);
  let fullDesc = await faceapi.detectSingleFace(img, OPTION).withFaceLandmarks().withFaceDescriptor()
  return fullDesc
}

export async function createMatcher(faceProfile) {
  // Create labeled descriptors of member from profile
  let members = Object.keys(faceProfile);
 
  let labeledDescriptors = members.map(
    member =>
      new faceapi.LabeledFaceDescriptors(
        faceProfile[member].name,
        faceProfile[member].descriptors.map(
          descriptor => new Float32Array(descriptor)
        )
      )
  );

  // Create face matcher (maximum descriptor distance is 0.5)
  let faceMatcher = new faceapi.FaceMatcher(
    labeledDescriptors,
    maxDescriptorDistance 
  );
  return faceMatcher;
}

export function isFaceDetectionModelLoaded() {
  return !!faceapi.nets.tinyFaceDetector.params;
}
