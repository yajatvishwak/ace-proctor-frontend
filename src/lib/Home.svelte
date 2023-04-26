<script>
  import { onMount } from "svelte";
  import Layout from "./components/Layout.svelte";
  import NavBar from "./components/Navbar.svelte";
  import { store } from "./store/store";
  import axios from "axios";
  import { push } from "svelte-spa-router";
  onMount(async () => {
    const res = await axios.get("http://localhost:3000/get-exams");
    console.log(res.data);
    availableExams = res.data.data.map((item) => {
      return { ...item, isSelected: false };
    });
  });

  let availableExams = [
    {
      id: "1",
      examTitle: "Maths",
      isSelected: true,
      isEnabled: true,
    },
    {
      id: "2",
      examTitle: "Physics",
      isSelected: false,
      isEnabled: true,
    },
    {
      id: "3",
      isSelected: false,
      examTitle: "Chemistry",
    },
  ];
  let isAddExamModalOpen = false;
  let selectedExam = "";
  $: {
    availableExams = availableExams.map((item) => {
      if ($store.selectedExams.includes(item.id)) {
        return { ...item, isSelected: true };
      }
      return { ...item, isSelected: false };
    });
  }
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
        <select
          bind:value={selectedExam}
          class="select w-full bg-white select-bordered"
          name=""
          id=""
        >
          {#each availableExams as exam}
            <option value={exam.id}>{exam.examTitle}</option>
          {/each}
        </select>
        <button
          on:click={async () => {
            if ($store.selectedExams.indexOf(selectedExam)) {
              $store.selectedExams.push(selectedExam);
              $store.selectedExams = [...$store.selectedExams];
              axios.post("http://localhost:3000/add-attendance", {
                eid: selectedExam,
                uid: $store.id,
              });
              isAddExamModalOpen = false;
            }
          }}
          class="btn btn-outline w-full my-4">Submit</button
        >
      </div>
    </div>
  </div>
  <NavBar />
  <div class="flex flex-col p-10 mx-auto max-w-screen-md">
    <div class="flex flex-col my-5">
      <div class="text-xl font-bold">Top of the morning, {$store.name}</div>
      <div class="text-lg">It's a beautiful day to give an exam</div>
    </div>
    <div class="divider">Actions</div>
    <div class="flex gap-3">
      <button
        on:click={() => (isAddExamModalOpen = true)}
        class="flex w-full hover:scale-95 transition-all cursor-pointer justify-center gap-3 items-center rounded-xl p-3 bg-slate-300"
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
            d="M12 4.5v15m7.5-7.5h-15"
          />
        </svg>
        <div>Add Exam</div>
      </button>
      <div
        class="flex w-full justify-center hover:scale-95 transition-all cursor-pointer gap-3 items-center rounded-xl p-3 bg-slate-300"
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
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
          />
        </svg>

        <div>Edit Profile</div>
      </div>
    </div>
    <div class="divider my-10">Registered Exams</div>
    <div class="flex flex-col gap-3">
      {#each availableExams as exam}
        {#if exam.isSelected}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <div
            on:click={() => {
              if (exam.isEnabled) push("/verify/" + exam.id);
            }}
            class="p-6 group border transition-all hover:scale-[98%] cursor-pointer rounded-2xl flex justify-between items-center"
          >
            <div class="text-xl">{exam.examTitle}</div>
            <div class="flex gap-3 items-center">
              <div>
                {#if exam.isEnabled}
                  <div class="text-xs text-green-500">🟢 Enabled</div>
                {:else}
                  <div class="text-xs text-red-500">🔴 Disabled</div>
                {/if}
              </div>
              <div class="group-hover:block hidden transition-all">></div>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  </div>
</Layout>
