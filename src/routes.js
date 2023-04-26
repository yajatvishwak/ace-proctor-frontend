import Admin from "./lib/Admin.svelte";
import AdminLogin from "./lib/AdminLogin.svelte";
import Exam from "./lib/Exam.svelte";
import Home from "./lib/Home.svelte";
import Landing from "./lib/Landing.svelte";
import Login from "./lib/Login.svelte";
import Register from "./lib/Register.svelte";
import Verify from "./lib/Verify.svelte";

const routes = {
  "/": Landing,
  "/login": Login,
  "/register": Register,
  "/home": Home,
  "/exam/:id": Exam,
  "/verify/:id": Verify,
  "/admin/": Admin,
  "/admin/login": AdminLogin,
};

export default routes;
