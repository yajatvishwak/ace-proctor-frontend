<script>
  import { onMount } from "svelte";
  import Layout from "./components/Layout.svelte";
  import NavBar from "./components/Navbar.svelte";
  import Webcam from "webcam-easy";
  import { store } from "./store/store";
  import axios from "axios";
  import toast from "svelte-french-toast";
  import { push } from "svelte-spa-router";

  export let params = {};

  let webcamElement;
  let canvasElement;
  let webcam;
  let picture;
  let pictureString;
  onMount(async () => {
    webcam = new Webcam(webcamElement, "user", canvasElement, null);
    await webcam.start();
    return () => {
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
    submit();
  }
  async function submit() {
    let fd = new FormData();
    fd.append("usn", $store.usn);
    fd.append("uid", $store.id);
    fd.append("eid", params.id);
    fd.append("file", picture);

    axios.post("http://localhost:3000/verify", fd).then((res) => {
      if (res.data.verified === "True") {
        toast.success("Registration successful");
        push("/exam/" + params.id);
      } else {
        toast.error("Registration unsuccessful");
      }
    });
  }
</script>

<Layout>
  <NavBar />
  <div class=" relative flex flex-col h-full max-w-screen-md mx-auto my-10">
    <div class=" flex flex-col gap-3 bottom-5 right-5 rounded z-10">
      <div>
        <div class="text-xl font-bold">
          We need to verify you before we start your exam
        </div>
        <div class="text-sm">
          Please make sure you are in a well lit room and your face is clearly
          visible. This will mark your attendance for the exam.
        </div>
      </div>
      <!-- svelte-ignore a11y-media-has-caption -->
      <video
        id="webcam"
        autoplay
        playsinline
        bind:this={webcamElement}
        class={picture ? "hidden" : "w-full rounded-xl"}
      />
      {#if pictureString}
        <img src={pictureString} alt="" />
        <div class="flex gap-3">
          <button
            class="btn btn-outline"
            on:click={async () => {
              picture = null;
              pictureString = null;
            }}>Retake</button
          >
          <button
            class="btn btn-outline"
            on:click={async () => {
              // server call
            }}>Submit</button
          >
        </div>
      {:else}
        <canvas id="canvas" bind:this={canvasElement} class="hidden" />
        <div class="flex gap-3 items-center">
          <button
            type="button"
            class="btn btn-circle text-white border-0"
            on:click={takeSnapshot}
          >
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
                d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
              />
            </svg>
          </button>
          <div class="label-text-alt">Capture</div>
        </div>
      {/if}
    </div>
  </div>
</Layout>
