<script>
  import Layout from "./components/Layout.svelte";
  import NavBar from "./components/NavBar.svelte";
  import toast from "svelte-french-toast";
  import { push } from "svelte-spa-router";
  import axios from "axios";
  import { store } from "./store/store";

  let username = "";
  let password = "";
  async function submit() {
    axios
      .post("http://localhost:3000/login", {
        usn: username.toLowerCase(),
        password: password.toLowerCase(),
      })
      .then((res) => {
        if (res.data.status == "success") {
          toast.success("Login successful");
          $store.name = res.data.data.name;
          $store.id = res.data.data.id;
          $store.usn = username.toLowerCase();
          push("/home");
        } else {
          toast.error("Login unsuccessful");
        }
      });
  }
</script>

<Layout>
  <NavBar />
  <section class="p-10 max-w-screen-md mx-auto">
    <div class="text-xl font-bold">Login to ACE proctoring</div>
    <div class="text-sm">Use your USN and password to login</div>
    <div class="mt-4">
      <div class="flex flex-col">
        <label for="usn" class="label-text-alt">USN</label>
        <input
          bind:value={username}
          type="text"
          id="usn"
          class="border border-gray-300 rounded-md p-2 bg-transparent"
        />
      </div>
      <div class="flex flex-col mt-4">
        <label for="password" class="label-text-alt">Password</label>
        <input
          bind:value={password}
          type="password"
          id="password"
          class="border border-gray-300 rounded-md p-2 bg-transparent"
        />
      </div>
      <div class="mt-4">
        <button on:click={submit} class="btn w-full text-white"> Login </button>
      </div>
    </div>
  </section>
</Layout>
