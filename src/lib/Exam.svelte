<script>
  // @ts-nocheck

  import { onMount } from "svelte";
  import Layout from "./components/Layout.svelte";
  import NavBar from "./components/Navbar.svelte";
  import * as faceapi from "face-api.js";
  import Webcam from "webcam-easy";
  import { store } from "./store/store";
  import axios from "axios";

  let webcamElement;
  let canvasElement;
  let webcam;
  let picture;
  let pictureString;
  let isFaceVisible = false;
  let isOkay = false;
  let message = "Initializing...";
  let interval;
  export let params = {};

  let pdflink = "http://s29.q4cdn.com/175625835/files/doc_downloads/test.pdf";

  onMount(async () => {
    const res = await axios.post("http://localhost:3000/get-exam", {
      id: params.id,
    });
    console.log(res.data);
    pdflink = "http://localhost:3000/sendqp/" + res.data.data.questionLink;
    Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceExpressionNet.loadFromUri("/models"),
    ]).then(() => console.log("models loaded"));
    webcam = new Webcam(webcamElement, "user", canvasElement, null);
    await webcam.start();
    interval = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(webcamElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions();
      if (detections.length > 0) {
        isFaceVisible = true;
        if (detections.length > 1) {
          isOkay = false;
          message = "Multiple faces detected";
        } else {
          isOkay = true;
          message = "All good, Continue writing the exam";
        }
      } else {
        isOkay = false;
        message = "No face detected";
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      webcam.stop();
    };
  });
  function dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(",")[1]);
    let mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  }

  function takeSnapshot() {
    const snap = webcam.snap();
    let blobsnap = dataURItoBlob(snap);
    let file = new File([blobsnap], "image.webp", {
      type: "image/webp",
    });
    picture = file;
    pictureString = snap;
  }

  // check if face is in frame
  // check if face is in db every 10 seconds
  // check if more than 2 faces are in the frame
</script>

<Layout>
  <NavBar />
  <div class=" relative flex flex-col h-full">
    <div class="h-[95vh] w-full bg-yellow-300">
      <embed class="w-full h-full" src={pdflink} />
    </div>

    <div
      class="absolute flex flex-col gap-3 bottom-5 right-5 rounded text-white z-10"
    >
      <div class="alert {isOkay ? 'alert-success ' : 'alert-error'}  shadow-lg">
        <div>
          {#if isOkay}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="stroke-current flex-shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              /></svg
            >
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          {/if}
          <span>{message}</span>
        </div>
      </div>

      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        id="webcam"
        autoplay
        playsinline
        bind:this={webcamElement}
        class="w-full max-w-xs rounded-xl"
      />
      <canvas id="canvas" bind:this={canvasElement} class="hidden" />
    </div>
  </div>
</Layout>
