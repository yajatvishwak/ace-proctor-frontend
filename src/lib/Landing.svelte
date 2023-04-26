<script>
  import { push } from "svelte-spa-router";
  import Layout from "./components/Layout.svelte";
  import Navbar from "./components/NavBar.svelte";
</script>

<Layout>
  <Navbar />
  <div
    class="flex flex-col gap-3 justify-center h-[90vh] items-center max-w-screen-lg mx-auto"
  >
    <div class=" uppercase tracking-wider font-bold">Major project</div>
    <div class="text-7xl font-bold text-center">
      Welcome to the next gen Proctoring
    </div>
    <div class="text-center">
      Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta, dicta
      assumenda blanditiis debitis voluptates, aut, enim natus ut dignissimos
      quo repellendus numquam eius omnis repellat cumque pariatur.
      Necessitatibus, nostrum ipsum.
    </div>
    <div class="flex gap-3">
      <button
        on:click={() => push("/register")}
        class="btn rounded-full text-white">Register</button
      >
      <button
        on:click={() => push("/login")}
        class="btn rounded-full btn-outline text-black">Sign in</button
      >
    </div>
  </div>
</Layout>
