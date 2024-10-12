These examples are a deno port of the
[wgpu examples](https://github.com/gfx-rs/wgpu/tree/trunk/examples/src) but
using `utils`'s `createCapture`, `copyToBuffer` & `createPng` instead of a
swapchain as deno's webgpu implementation is headless.

To try out, upgrade deno to at least 1.8.0 and run the commands below.

```shell
$ cd hello-compute
$ deno run --unstable --allow-read --allow-write mod.ts
Uint32Array(4) [ 0, 2, 7, 55 ]
```
