import { defineAbility } from "@casl/ability";

export default defineAbility((can, cannot) => {
  can("read", "Post");
  can("add", "Post");
  cannot("update", "Post");
  cannot("delete", "Post");
});