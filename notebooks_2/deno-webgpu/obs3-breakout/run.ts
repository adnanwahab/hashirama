import $ from "dax";

for await (const entry of $.path(".").readDir()) {
  if (entry.isDirectory && !entry.name.startsWith(".")) {
    await $`deno run --allow-read=. --allow-write=. --unstable-webgpu mod.ts`
      .cwd(
        entry.path,
      );
  }
}
