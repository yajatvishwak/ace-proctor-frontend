import { persisted } from "svelte-local-storage-store";

export const store = persisted("preferences", {
  selectedExams: [],
  usn: "",
  name: "",
  id: "",
});
