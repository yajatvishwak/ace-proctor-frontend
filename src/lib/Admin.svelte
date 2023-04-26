<script>
  import Layout from "./components/Layout.svelte";
  import NavBar from "./components/Navbar.svelte";
  import toast from "svelte-french-toast";
  import axios from "axios";
  import { onMount } from "svelte";
  let exams = [
    {
      id: "1",
      examTitle: "Maths",
      isEnabled: true,
    },
  ];
  async function submit() {
    let fd = new FormData();
    fd.append("examTitle", examTitle);
    fd.append("file", questionPaperFile[0]);
    console.log(examTitle, questionPaperFile);

    axios.post("http://localhost:3000/create-exam", fd).then((res) => {
      if (res.data.status == "success") {
        toast.success("Exam successfully created");
      } else {
        toast.error("Error");
      }
    });
  }
  async function enableExam(eid) {
    await axios.post("http://localhost:3000/enable-exam", {
      eid,
    });
    toast.success("Exam enabled");
  }
  async function disableExam(eid) {
    await axios.post("http://localhost:3000/disable-exam", {
      eid,
    });
    toast.success("Exam disabled");
  }

  async function download(eid) {
    await axios.post("http://localhost:3000/generate-report", {
      eid,
    });
    window.open("http://localhost:3000/sendreport/" + eid + ".csv");
  }
  let questionPaperFile;
  let examTitle = "";
  let isAddExamModalOpen = false;
  onMount(async () => {
    let res = await axios.get("http://localhost:3000/get-exams");
    console.log(res.data);
    exams = res.data.data;
  });
</script>

<Layout>
  <input type="checkbox" checked={isAddExamModalOpen} class="modal-toggle" />
  <div class="modal">
    <div class="modal-box relative bg-white text-black">
      <button
        on:click={() => (isAddExamModalOpen = false)}
        class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
      >
      <h3 class="text-lg font-bold">Add an Exam</h3>
      <div class="py-4">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <form on:submit={submit} class="flex flex-col gap-3">
          <div class="label-text-alt">Exam title</div>
          <input
            type="text"
            bind:value={examTitle}
            class="input bg-transparent input-bordered w-full"
          />
          <div class="label-text-alt">Exam Question Paper</div>

          <input
            type="file"
            bind:files={questionPaperFile}
            class="file:p-2 file:rounded-lg"
          />

          <button type="submit" class="btn text-white">Create Exam</button>
        </form>
      </div>
    </div>
  </div>
  <NavBar />
  <div class="flex flex-col p-10 mx-auto max-w-screen-md">
    <div class="flex justify-between">
      <div class="flex flex-col my-5">
        <div class="text-xl font-bold">Top of the morning, Username</div>
        <div class="text-lg">It's a beautiful day to conduct an exam</div>
      </div>
      <div>
        <button
          on:click={() => {
            isAddExamModalOpen = true;
          }}
          class="btn btn-circle"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="w-4 h-4"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 4.5v15m7.5-7.5h-15"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="divider">Available Exams</div>

    {#each exams as exam}
      <div
        class="p-6 border transition-all rounded-2xl flex justify-between items-center"
      >
        <div class="text-xl">{exam.examTitle}</div>
        <div class="flex gap-3 items-center">
          <button
            on:click={() => download(exam.id)}
            class="flex gap-3 items-center hover:scale-90"
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
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
          </button>
          <input
            type="checkbox"
            class="toggle"
            bind:checked={exam.isEnabled}
            on:change={() => {
              if (exam.isEnabled) {
                enableExam(exam.id);
              } else {
                disableExam(exam.id);
              }
            }}
            name=""
            id=""
          />
          <div>
            {#if exam.isEnabled}
              <div class="text-xs text-green-500">🟢 Enabled</div>
            {:else}
              <div class="text-xs text-red-500">🔴 Disabled</div>
            {/if}
          </div>
        </div>
      </div>
    {/each}
  </div>
</Layout>
