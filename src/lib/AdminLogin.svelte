<script>
  import Layout from "./components/Layout.svelte";
  import NavBar from "./components/NavBar.svelte";
</script>

<Layout>
  <NavBar />
  <section class="p-10 max-w-screen-md mx-auto">
    <div class="text-xl font-bold">Login to ACE proctoring</div>
    <div class="text-sm">Admin login, use admin credentials</div>
    <div class="mt-4">
      <div class="flex flex-col">
        <label for="usn" class="label-text-alt">USN</label>
        <input
          type="text"
          id="usn"
          class="border border-gray-300 rounded-md p-2 bg-transparent"
        />
      </div>
      <div class="flex flex-col mt-4">
        <label for="password" class="label-text-alt">Password</label>
        <input
          type="password"
          id="password"
          class="border border-gray-300 rounded-md p-2 bg-transparent"
        />
      </div>
      <div class="mt-4">
        <button class="btn w-full text-white"> Login </button>
      </div>
    </div>
  </section>
</Layout>
