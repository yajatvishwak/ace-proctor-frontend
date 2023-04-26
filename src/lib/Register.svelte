<script>
  import { onMount } from "svelte";
  import Webcam from "webcam-easy";
  import Navbar from "./components/NavBar.svelte";
  import Layout from "./components/Layout.svelte";
  import { push } from "svelte-spa-router";
  import toast from "svelte-french-toast";
  import axios from "axios";
  import { store } from "./store/store";

  let webcamElement;
  let canvasElement;
  let webcam;
  let picture;
  let pictureString;
  let name;
  let roll;
  let password;

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
  }
  async function submit() {
    let fd = new FormData();
    fd.append("name", name);
    fd.append("usn", roll.toLowerCase());

    fd.append("password", password.toLowerCase());
    fd.append("file", picture);

    axios.post("http://localhost:3000/register", fd).then((res) => {
      if (res.data.status == "success") {
        toast.success("Registration successful");
        $store.name = res.data.data.name;
        $store.id = res.data.data.id;
        $store.usn = roll.toLowerCase();
        push("/home");
      } else {
        toast.error("Registration unsuccessful");
      }
    });
  }
</script>

<Layout>
  <Navbar />
  <div class="mx-auto max-w-screen-md p-10 rounded-xl">
    <div class="text-xl font-bold">Make an account</div>
    <div class="">Register by submitting your details and picture</div>
    <form on:submit|preventDefault={submit} class="flex gap-2 my-5 flex-col">
      <div class="flex gap-1 flex-col">
        <label for="" class="label-text-alt">Name</label>
        <input
          bind:value={name}
          type="text"
          placeholder="John Doe"
          class="input input-bordered bg-transparent"
        />
      </div>
      <div class="flex gap-1 flex-col">
        <label for="" class="label-text-alt">Roll Number</label>
        <input
          bind:value={roll}
          type="text"
          placeholder="1NH19CSxxx"
          class="input input-bordered bg-transparent"
        />
      </div>

      <div class="flex gap-1 flex-col">
        <label for="" class="label-text-alt">Password</label>
        <input
          bind:value={password}
          type="password"
          placeholder="Password"
          class="input input-bordered bg-transparent"
        />
      </div>
      <div class="flex gap-1 flex-col">
        <label for="" class="label-text-alt"
          >Reqired Documents (10th, 12th, Aadhar in PDF format)</label
        >

        <input
          class="w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:p-2"
          id="file_input"
          type="file"
        />
      </div>

      <div class="flex gap-1 flex-col mt-4">
        <label for="" class="label-text-alt">Take a Face Picture</label>
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
          <button
            class="btn btn-outline"
            on:click={async () => {
              picture = null;
              pictureString = null;
            }}>Retake</button
          >
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
      <button type="submit" class="btn mt-3 border-0 text-white">Submit</button>
    </form>
  </div>
</Layout>
