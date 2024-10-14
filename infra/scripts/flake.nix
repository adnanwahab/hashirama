{
  description = "NixOS configurations for my VMs";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
        flake-utils.url = "github:numtide/flake-utils";

  };

    outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
      in {
        packages = {
          default = pkgs.stdenv.mkDerivation {
            pname = "my-package";
            version = "1.0.0";
            src = ./.;

            buildInputs = [ pkgs.hello ];

            buildPhase = ''
              echo "Building my package..."
              # Add your build steps here
   # Simulate build process (replace this with actual build steps)
              echo "#!/bin/sh" > my-executable
              echo "echo Hello, World!" >> my-executable
              chmod +x my-executable
            '';

            installPhase = ''
              mkdir -p $out/bin
              cp my-executable $out/bin/
            '';
          };
        };
      }
    );
  #   nixosConfigurations = {
  #     jetson = nixpkgs.lib.nixosSystem {
  #       system = "aarch64linux";
  #       modules = [
  #         ./hosts/jetson/configuration.nix
  #       ];
  #     };
  #     macbook = nixpkgs.lib.nixosSystem {
  #       system = "aarch64linux";
  #       modules = [
  #         ./hosts/macbook/configuration.nix
  #       ];
  #     };

  #     thinkpad = nixpkgs.lib.nixosSystem {
  #       system = "x86_64-linux";
  #       modules = [
  #         ./hosts/thinkpad/configuration.nix
  #       ];
  #     };
  #   };
  # };
}


# https://github.com/adnanwahab/hashirama-private/tree/71e5a33ef7c540c2c623382863bca6d54a5c5476

# https://github.com/orgs/replit/repositories?type=all&page=4

# 1000 githubs
# 1000 books
# 1000 blogs
# 1000 anime - tv - comics books
#https://github.com/tolmasky/demokit?tab=readme-ov-file



      '67959fb0-2', '2facc0a1',   '7c0f1871'
    ],
    added: []
  },
  files: {
    removed: [
      './data/latency-heatmap.parquet',
      './data/latency-histogram.parquet',
      './data/top-routes-count.parquet',
      './data/top-routes-duration.parquet',
      './data/size-heatmap.parquet',
      './data/latency-heatmap-documents-public.parquet',
      './data/latency-heatmap-avatar.parquet',
      './data/latency-heatmap-documents-at.parquet'
    ],
    added: []
  },
  tables: { removed: [], added: [] },
  stylesheets: {
    removed: [],
    added: [
      'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap'
    ]
  },
  hash: {
    previous: '20b9344436324c373514d9aa329c047236200328f9c5191fa4395ddbe9298e1b',
    current: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
  }
}
↓ {
  type: 'update',
  html: [ { type: 'remove', oldPos: 1, newPos: 1, items: [Object] } ],
  code: {
    removed: [
      '00c12633',   'c5aacd99',   'aa07257e',
      '1703a5bf',   '8ead1dc2',   '67959fb0',
      '218bfc9d',   '4e86852b',   '263aa713',
      '68d89334',   '64f6c586',   '67959fb0-1',
      '218bfc9d-1', '09ee7d1b',   '51689107',
      'eee35ef5',   '1c6bdacf',   'f3549263',
      'ee7707c5',   '263aa713-1', '5d56640a',
      '2c43c6ce',   '5d56640a-1', 'f0eb888e',
      '3226b9bf',   '450eb8f7',   '25a18122',
      '218bfc9d-2', '5271da65',   '4f365a32',
      '67959fb0-2', '2facc0a1',   '7c0f1871'
    ],
    added: []
  },
  files: {
    removed: [
      './data/latency-heatmap.parquet',
      './data/latency-histogram.parquet',
      './data/top-routes-count.parquet',
      './data/top-routes-duration.parquet',
      './data/size-heatmap.parquet',
      './data/latency-heatmap-documents-public.parquet',
      './data/latency-heatmap-avatar.parquet',
      './data/latency-heatmap-documents-at.parquet'
    ],
    added: []
  },
  tables: { removed: [], added: [] },
  stylesheets: {
    removed: [],
    added: [
      'https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,200..900;1,8..60,200..900&display=swap'
    ]
  },
  hash: {
    previous: '20b9344436324c373514d9aa329c047236200328f9c5191fa4395ddbe9298e1b',
    current: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
  }
}
GET /
socket close /_observablehq
GET /_observablehq/theme-air,near-midnight.css
GET /_observablehq/client.js
GET /_observablehq/runtime.js
GET /_observablehq/stdlib.js
socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
}
↓ { type: 'welcome' }
GET /
socket close /_observablehq
GET /_observablehq/theme-air,near-midnight.css
GET /_observablehq/client.js
GET /_observablehq/runtime.js
GET /_observablehq/stdlib.js
socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
}
↓ { type: 'welcome' }
^C
.venvshelbernstein@shels-macbook-pro api % 
.venvshelbernstein@shels-macbook-pro api % cd ..
.venvshelbernstein@shels-macbook-pro course_content % ls
api                     data                    node_modules            package-lock.json       src
components              dist                    observablehq.config.js  package.json
.venvshelbernstein@shels-macbook-pro course_content % bun run dev
$ observable preview
(node:87884) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
Observable Framework v1.12.0
↳ http://127.0.0.1:3000/

GET /
npm:apache-arrow@17.0.0/+esm → src/.observablehq/cache/_npm/apache-arrow@17.0.0/_esm.js
npm:apache-arrow@17.0.0/package.json → src/.observablehq/cache/_npm/apache-arrow@17.0.0/package.json
npm:tslib@^2.6.2 → socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
}
socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
}
socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
}
npm:tslib@2.7.0
npm:flatbuffers@^24.3.25 → npm:flatbuffers@24.3.25
npm:parquet-wasm@0.6.1/+esm → src/.observablehq/cache/_npm/parquet-wasm@0.6.1/_esm.js
npm:tslib@2.7.0/+esm → src/.observablehq/cache/_npm/tslib@2.7.0/_esm.js
npm:flatbuffers@24.3.25/+esm → src/.observablehq/cache/_npm/flatbuffers@24.3.25/_esm.js
npm:parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm → src/.observablehq/cache/_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '44136fa355b3678a1146ad16f7e8649e94fb4fc21fe77e8310c060f61caaff8a'
}
↓ { type: 'reload' }
↓ { type: 'reload' }
↓ { type: 'reload' }
↓ { type: 'reload' }
GET /
GET /
GET /_import/components/apiHeatmap.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_import/components/apiHistogram.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/apache-arrow@17.0.0/_esm.js
socket close /_observablehq
GET /_observablehq/theme-slate.css
GET /_file/data/latency-histogram.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/parquet-wasm@0.6.1/_esm.js
GET /
GET /_file/data/latency-heatmap.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/tslib@2.7.0/_esm.js
socket close /_observablehq
GET /_npm/flatbuffers@24.3.25/_esm.js
socket open /_observablehq
GET /_file/data/plot-version-data.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-npm-downloads.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_observablehq/stdlib/inputs.css
↑ {
  type: 'hello',
  path: '/',
  hash: '648f1fd10bab37c6b0e94b6592be16a18163565b4c52cb2baf4ce80eb759fdfe'
}
GET /_file/data/plot-github-issues.json?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-github-stars.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_observablehq/theme-slate.css
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_observablehq/stdlib/inputs.css
GET /_npm/katex@0.16.11/dist/katex.min.css
↓ { type: 'welcome' }
GET /_observablehq/client.js
GET /_npm/katex@0.16.11/dist/katex.min.css
GET /_observablehq/client.js
GET /_observablehq/runtime.js
GET /_observablehq/stdlib.js
GET /
socket close /_observablehq
GET /_observablehq/theme-slate.css
GET /_observablehq/stdlib/inputs.css
GET /_npm/katex@0.16.11/dist/katex.min.css
GET /_import/components/apiHeatmap.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_observablehq/stdlib.js
GET /_observablehq/client.js
GET /_observablehq/stdlib.js
GET /_import/components/apiHistogram.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_import/components/revive.js?sha=24f207f9301acf273550e2d35a6d5d8e4ffac639f044e7315cf4aaf4f60b8fc2
GET /_import/components/trend.js?sha=bb7a38f0bb4ec380e13bf7a2ea1cf7da3c50458bb4580a08bb76aaa1335b9bce
GET /_import/components/burndownPlot.js?sha=cb4be8a2e12becc64ba925f64f13002c36728866c5a7cf904e49dd96e60188e5
socket close /_observablehq
GET /_observablehq/stdlib/inputs.css
GET /_observablehq/theme-slate.css
GET /_npm/katex@0.16.11/dist/katex.min.css
GET /_import/components/apiHeatmap.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_import/components/apiHistogram.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_import/components/revive.js?sha=24f207f9301acf273550e2d35a6d5d8e4ffac639f044e7315cf4aaf4f60b8fc2
GET /_import/components/dailyPlot.js?sha=880d9d69b56fa6ebec3335e808af53019738aa92aa3a241db39f29267c6d8a5c
GET /_npm/d3@7.9.0/_esm.js
GET /_npm/htl@0.3.1/_esm.js
GET /_observablehq/stdlib/inputs.js
GET /_npm/@observablehq/plot@0.6.16/_esm.js
GET /_observablehq/stdlib/tex.js
GET /_npm/d3-dsv@3.0.1/_esm.js
GET /_npm/apache-arrow@17.0.0/_esm.js
GET /_npm/parquet-wasm@0.6.1/_esm.js
GET /_npm/isoformat@0.2.1/_esm.js
GET /_npm/katex@0.16.11/_esm.js
GET /_npm/d3-array@3.2.4/_esm.js
GET /_npm/d3-axis@3.0.0/_esm.js
GET /_npm/d3-brush@3.0.0/_esm.js
GET /_npm/d3-chord@3.0.1/_esm.js
GET /_npm/d3-color@3.1.0/_esm.js
GET /_npm/d3-contour@4.0.2/_esm.js
GET /_npm/d3-delaunay@6.0.4/_esm.js
GET /_npm/d3-dispatch@3.0.1/_esm.js
GET /_npm/d3-drag@3.0.0/_esm.js
GET /_npm/d3-ease@3.0.1/_esm.js
GET /_npm/d3-fetch@3.0.1/_esm.js
GET /_npm/d3-force@3.0.0/_esm.js
GET /_npm/d3-format@3.1.0/_esm.js
GET /_npm/d3-geo@3.1.1/_esm.js
GET /_npm/d3-hierarchy@3.1.2/_esm.js
GET /_npm/d3-interpolate@3.0.1/_esm.js
GET /_npm/d3-path@3.1.0/_esm.js
GET /_npm/d3-polygon@3.0.1/_esm.js
GET /_npm/d3-quadtree@3.0.1/_esm.js
GET /_npm/d3-random@3.0.1/_esm.js
GET /_npm/d3-scale@4.0.2/_esm.js
GET /_npm/d3-scale-chromatic@3.1.0/_esm.js
GET /_npm/d3-selection@3.0.0/_esm.js
GET /_npm/d3-shape@3.2.0/_esm.js
GET /_npm/d3-time@3.1.0/_esm.js
GET /_npm/d3-time-format@4.1.0/_esm.js
GET /_npm/d3-timer@3.0.1/_esm.js
GET /_npm/d3-transition@3.0.1/_esm.js
GET /_npm/d3-zoom@3.0.0/_esm.js
GET /_npm/interval-tree-1d@1.0.4/_esm.js
GET /_npm/tslib@2.7.0/_esm.js
GET /_npm/flatbuffers@24.3.25/_esm.js
GET /_npm/internmap@2.0.3/_esm.js
GET /_npm/delaunator@5.0.1/_esm.js
GET /_npm/binary-search-bounds@2.0.5/_esm.js
GET /_npm/robust-predicates@3.0.2/_esm.js
GET /_import/components/trend.js?sha=bb7a38f0bb4ec380e13bf7a2ea1cf7da3c50458bb4580a08bb76aaa1335b9bce
GET /_import/components/burndownPlot.js?sha=cb4be8a2e12becc64ba925f64f13002c36728866c5a7cf904e49dd96e60188e5
GET /_observablehq/stdlib.js
GET /_import/components/apiHeatmap.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/d3@7.9.0/_esm.js
GET /_import/components/dailyPlot.js?sha=880d9d69b56fa6ebec3335e808af53019738aa92aa3a241db39f29267c6d8a5c
GET /_observablehq/client.js
GET /_import/components/apiHistogram.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_import/components/apiHeatmap.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_import/components/revive.js?sha=24f207f9301acf273550e2d35a6d5d8e4ffac639f044e7315cf4aaf4f60b8fc2
GET /_npm/htl@0.3.1/_esm.js
GET /_import/components/trend.js?sha=bb7a38f0bb4ec380e13bf7a2ea1cf7da3c50458bb4580a08bb76aaa1335b9bce
GET /_import/components/apiHistogram.js?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/@observablehq/plot@0.6.16/_esm.js
GET /_import/components/burndownPlot.js?sha=cb4be8a2e12becc64ba925f64f13002c36728866c5a7cf904e49dd96e60188e5
GET /_import/components/revive.js?sha=24f207f9301acf273550e2d35a6d5d8e4ffac639f044e7315cf4aaf4f60b8fc2
GET /_import/components/dailyPlot.js?sha=880d9d69b56fa6ebec3335e808af53019738aa92aa3a241db39f29267c6d8a5c
GET /_observablehq/stdlib/tex.js
GET /_npm/d3@7.9.0/_esm.js
GET /_import/components/trend.js?sha=bb7a38f0bb4ec380e13bf7a2ea1cf7da3c50458bb4580a08bb76aaa1335b9bce
GET /_npm/htl@0.3.1/_esm.js
GET /_observablehq/runtime.js
GET /_observablehq/runtime.js
socket open /_observablehq
GET /_npm/d3-dsv@3.0.1/_esm.js
↑ {
  type: 'hello',
  path: '/',
  hash: '648f1fd10bab37c6b0e94b6592be16a18163565b4c52cb2baf4ce80eb759fdfe'
}
GET /_npm/@observablehq/plot@0.6.16/_esm.js
GET /_import/components/burndownPlot.js?sha=cb4be8a2e12becc64ba925f64f13002c36728866c5a7cf904e49dd96e60188e5
GET /_npm/apache-arrow@17.0.0/_esm.js
GET /_npm/parquet-wasm@0.6.1/_esm.js
↓ { type: 'welcome' }
GET /_observablehq/stdlib/inputs.js
GET /_npm/isoformat@0.2.1/_esm.js
GET /_observablehq/stdlib/tex.js
GET /_npm/katex@0.16.11/_esm.js
GET /_import/components/dailyPlot.js?sha=880d9d69b56fa6ebec3335e808af53019738aa92aa3a241db39f29267c6d8a5c
GET /_npm/d3-array@3.2.4/_esm.js
GET /_npm/d3@7.9.0/_esm.js
GET /_npm/d3-axis@3.0.0/_esm.js
GET /_npm/d3-dsv@3.0.1/_esm.js
GET /_npm/d3-brush@3.0.0/_esm.js
GET /_npm/d3-chord@3.0.1/_esm.js
GET /_npm/htl@0.3.1/_esm.js
GET /_npm/apache-arrow@17.0.0/_esm.js
GET /_npm/d3-color@3.1.0/_esm.js
GET /_npm/d3-contour@4.0.2/_esm.js
GET /_npm/d3-delaunay@6.0.4/_esm.js
GET /_npm/d3-dispatch@3.0.1/_esm.js
GET /_npm/d3-drag@3.0.0/_esm.js
GET /_npm/d3-ease@3.0.1/_esm.js
GET /_npm/d3-fetch@3.0.1/_esm.js
GET /_npm/d3-force@3.0.0/_esm.js
GET /_npm/parquet-wasm@0.6.1/_esm.js
GET /_npm/d3-format@3.1.0/_esm.js
GET /_npm/d3-geo@3.1.1/_esm.js
GET /_npm/isoformat@0.2.1/_esm.js
GET /_npm/d3-hierarchy@3.1.2/_esm.js
GET /_npm/katex@0.16.11/_esm.js
GET /_npm/d3-interpolate@3.0.1/_esm.js
GET /_npm/d3-path@3.1.0/_esm.js
GET /_npm/d3-polygon@3.0.1/_esm.js
GET /_npm/d3-quadtree@3.0.1/_esm.js
GET /_npm/d3-random@3.0.1/_esm.js
GET /_npm/d3-scale@4.0.2/_esm.js
GET /_npm/d3-scale-chromatic@3.1.0/_esm.js
GET /_npm/d3-array@3.2.4/_esm.js
GET /_npm/d3-selection@3.0.0/_esm.js
GET /_npm/d3-shape@3.2.0/_esm.js
GET /_npm/d3-axis@3.0.0/_esm.js
GET /_npm/d3-time@3.1.0/_esm.js
GET /_npm/d3-time-format@4.1.0/_esm.js
GET /_npm/d3-brush@3.0.0/_esm.js
GET /_npm/d3-timer@3.0.1/_esm.js
GET /_npm/d3-transition@3.0.1/_esm.js
GET /_npm/d3-chord@3.0.1/_esm.js
GET /_npm/d3-zoom@3.0.0/_esm.js
GET /_npm/d3-color@3.1.0/_esm.js
GET /_npm/interval-tree-1d@1.0.4/_esm.js
GET /_npm/tslib@2.7.0/_esm.js
GET /_npm/flatbuffers@24.3.25/_esm.js
GET /_npm/d3-contour@4.0.2/_esm.js
GET /_npm/internmap@2.0.3/_esm.js
GET /_npm/d3-delaunay@6.0.4/_esm.js
GET /_npm/delaunator@5.0.1/_esm.js
GET /_npm/binary-search-bounds@2.0.5/_esm.js
GET /_npm/robust-predicates@3.0.2/_esm.js
GET /_npm/d3-dispatch@3.0.1/_esm.js
GET /_file/observable.png?sha=1af93621c62a90e8470b360f1fbd3e26aff4fb62b9c83c1f90a14dc72aa92a31
GET /_npm/d3-drag@3.0.0/_esm.js
GET /_npm/d3-ease@3.0.1/_esm.js
GET /_npm/d3-fetch@3.0.1/_esm.js
GET /_npm/d3-force@3.0.0/_esm.js
GET /_npm/d3-format@3.1.0/_esm.js
GET /_npm/d3-geo@3.1.1/_esm.js
GET /_npm/d3-hierarchy@3.1.2/_esm.js
GET /_npm/d3-interpolate@3.0.1/_esm.js
GET /_npm/d3-path@3.1.0/_esm.js
GET /_npm/d3-polygon@3.0.1/_esm.js
GET /_observablehq/runtime.js
GET /_npm/d3-quadtree@3.0.1/_esm.js
GET /_npm/@observablehq/plot@0.6.16/_esm.js
socket open /_observablehq
GET /_observablehq/stdlib/inputs.js
↑ {
  type: 'hello',
  path: '/',
  hash: '648f1fd10bab37c6b0e94b6592be16a18163565b4c52cb2baf4ce80eb759fdfe'
}
↓ { type: 'welcome' }
GET /_npm/d3-random@3.0.1/_esm.js
GET /_observablehq/stdlib/tex.js
GET /_npm/d3-scale@4.0.2/_esm.js
socket open /_observablehq
↑ {
  type: 'hello',
  path: '/',
  hash: '648f1fd10bab37c6b0e94b6592be16a18163565b4c52cb2baf4ce80eb759fdfe'
}
↓ { type: 'welcome' }
GET /_npm/d3-scale-chromatic@3.1.0/_esm.js
GET /_npm/d3-selection@3.0.0/_esm.js
GET /_npm/d3-dsv@3.0.1/_esm.js
GET /_npm/apache-arrow@17.0.0/_esm.js
GET /_npm/d3-shape@3.2.0/_esm.js
GET /_npm/d3-time@3.1.0/_esm.js
GET /_npm/parquet-wasm@0.6.1/_esm.js
GET /_npm/d3-time-format@4.1.0/_esm.js
GET /_npm/d3-timer@3.0.1/_esm.js
GET /_npm/isoformat@0.2.1/_esm.js
GET /_npm/d3-transition@3.0.1/_esm.js
GET /_npm/d3-zoom@3.0.0/_esm.js
GET /_npm/katex@0.16.11/_esm.js
GET /_npm/interval-tree-1d@1.0.4/_esm.js
GET /_npm/tslib@2.7.0/_esm.js
GET /_npm/flatbuffers@24.3.25/_esm.js
GET /_npm/internmap@2.0.3/_esm.js
GET /_npm/delaunator@5.0.1/_esm.js
GET /_npm/binary-search-bounds@2.0.5/_esm.js
GET /_npm/robust-predicates@3.0.2/_esm.js
GET /_npm/d3-array@3.2.4/_esm.js
GET /_npm/d3-axis@3.0.0/_esm.js
GET /_npm/d3-brush@3.0.0/_esm.js
GET /_npm/d3-chord@3.0.1/_esm.js
GET /_npm/d3-color@3.1.0/_esm.js
GET /_observablehq/stdlib/inputs.js
GET /_npm/d3-contour@4.0.2/_esm.js
GET /_npm/d3-delaunay@6.0.4/_esm.js
GET /_npm/d3-dispatch@3.0.1/_esm.js
GET /_npm/d3-drag@3.0.0/_esm.js
GET /_npm/d3-ease@3.0.1/_esm.js
socket open /_observablehq
GET /_npm/d3-fetch@3.0.1/_esm.js
↑ {
  type: 'hello',
  path: '/',
  hash: '648f1fd10bab37c6b0e94b6592be16a18163565b4c52cb2baf4ce80eb759fdfe'
}
GET /_npm/d3-force@3.0.0/_esm.js
↓ { type: 'welcome' }
GET /_file/data/latency-histogram.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/latency-heatmap.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_file/data/plot-version-data.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-npm-downloads.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-github-issues.json?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-github-stars.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/d3-format@3.1.0/_esm.js
GET /_npm/d3-geo@3.1.1/_esm.js
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_npm/d3-hierarchy@3.1.2/_esm.js
GET /_npm/d3-interpolate@3.0.1/_esm.js
GET /_npm/d3-path@3.1.0/_esm.js
GET /_npm/d3-polygon@3.0.1/_esm.js
GET /_npm/d3-quadtree@3.0.1/_esm.js
GET /_npm/d3-random@3.0.1/_esm.js
GET /_npm/d3-scale@4.0.2/_esm.js
GET /_npm/d3-scale-chromatic@3.1.0/_esm.js
GET /_npm/d3-selection@3.0.0/_esm.js
GET /_npm/d3-shape@3.2.0/_esm.js
GET /_npm/d3-time@3.1.0/_esm.js
GET /_npm/d3-time-format@4.1.0/_esm.js
GET /_npm/d3-timer@3.0.1/_esm.js
GET /_npm/d3-transition@3.0.1/_esm.js
GET /_npm/d3-zoom@3.0.0/_esm.js
GET /_npm/interval-tree-1d@1.0.4/_esm.js
GET /_npm/tslib@2.7.0/_esm.js
GET /_npm/flatbuffers@24.3.25/_esm.js
GET /_npm/internmap@2.0.3/_esm.js
GET /_npm/delaunator@5.0.1/_esm.js
GET /_npm/binary-search-bounds@2.0.5/_esm.js
GET /_npm/robust-predicates@3.0.2/_esm.js
GET /_file/data/latency-histogram.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/latency-heatmap.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_file/data/plot-github-stars.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-version-data.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_file/data/plot-npm-downloads.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-github-issues.json?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
socket close /_observablehq
socket close /_observablehq
GET /_file/observable.png?sha=1af93621c62a90e8470b360f1fbd3e26aff4fb62b9c83c1f90a14dc72aa92a31
GET /_file/data/latency-histogram.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/latency-heatmap.parquet?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-github-stars.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
GET /_file/data/plot-version-data.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-npm-downloads.csv?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_file/data/plot-github-issues.json?sha=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
GET /_npm/parquet-wasm@0.6.1/esm/parquet_wasm_bg.wasm
↓ { type: 'reload' }
↓ { type: 'reload' }
↓ { type: 'reload' }
file:///Users/shelbernstein/homelab_status_page/course_content/observablehq.config.js?1728877241783.8623:4
https://observablehq.com/framework/
^^^^^

SyntaxError: Label 'https' has already been declared
    at compileSourceTextModule (node:internal/modules/esm/utils:337:16)
    at ModuleLoader.moduleStrategy (node:internal/modules/esm/translators:166:18)
    at callTranslator (node:internal/modules/esm/loader:436:14)
    at ModuleLoader.moduleProvider (node:internal/modules/esm/loader:442:30)
    at async ModuleJob._link (node:internal/modules/esm/module_job:106:19)

Node.js v22.7.0
error: script "dev" exited with code 1
.venvshelbernstein@shels-macbook-pro course_content % mkdir examples
.venvshelbernstein@shels-macbook-pro course_content % cd examples 
.venvshelbernstein@shels-macbook-pro examples % ls
.venvshelbernstein@shels-macbook-pro examples % ls
.venvshelbernstein@shels-macbook-pro examples % 
https://observablehq.com/@asrenninger/park-access-in-london
https://observablehq.com/@twitter/density-scatterplot
https://observablehq.com/@fil/advent-of-code-12
https://observablehq.com/@laotzunami/jungs-window-mandala
https://observablehq.com/@enjalot
https://observablehq.com/@enjalot/touring-the-d3-ecosystem
https://observablehq.com/@asg017/100-command-line-tools-for-data-viz
https://observablehq.com/@floatingpurr/visualizing-twitter-data
https://observablehq.com/@mbostock/liquidfun
https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl
https://observablehq.com/@rreusser
https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss
https://observablehq.com/@mattdesl
https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path
https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype
https://observablehq.com/@donghaoren/buddhabrot-playground
https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
https://observablehq.com/@timhau/conways-game-of-life-on-a-torus
https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1
https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons
https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation
https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings
https://observablehq.com/@uwdata/fast-kde
https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles

.venvshelbernstein@shels-macbook-pro examples % 
.venvshelbernstein@shels-macbook-pro examples % bun run
Usage: bun run [flags] <file or script>

Flags:
      --silent               Don't print the script command
  -b, --bun                  Force a script or package to use Bun's runtime instead of Node.js (via symlinking node)
      --watch                Automatically restart the process on file change
      --hot                  Enable auto reload in the Bun runtime, test runner, or bundler
      --smol                 Use less memory, but run garbage collection more often
  -r, --preload              Import a module before other modules are loaded
      --inspect              Activate Bun's debugger
      --inspect-wait         Activate Bun's debugger, wait for a connection before executing
      --inspect-brk          Activate Bun's debugger, set breakpoint on first line of code and wait
      --if-present           Exit without an error if the entrypoint does not exist
      --no-install           Disable auto install in the Bun runtime
      --install              Configure auto-install behavior. One of "auto" (default, auto-installs when no node_modules), "fallback" (missing packages only), "force" (always).
  -i                         Auto-install dependencies during execution. Equivalent to --install=fallback.
  -e, --eval                 Evaluate argument as a script
      --prefer-offline       Skip staleness checks for packages in the Bun runtime and resolve from disk
      --prefer-latest        Use the latest matching versions of packages in the Bun runtime, always checking npm
  -p, --port                 Set the default port for Bun.serve
      --main-fields          Main fields to lookup in package.json. Defaults to --target dependent
      --extension-order      Defaults to: .tsx,.ts,.jsx,.js,.json
      --tsconfig-override    Specify custom tsconfig.json. Default <d>$cwd<r>/tsconfig.json
  -d, --define               Substitute K:V while parsing, e.g. --define process.env.NODE_ENV:"development". Values are parsed as JSON.
  -l, --loader               Parse files with .ext:loader, e.g. --loader .js:jsx. Valid loaders: js, jsx, ts, tsx, json, toml, text, file, wasm, napi
      --no-macros            Disable macros from being executed in the bundler, transpiler and runtime
      --jsx-factory          Changes the function called when compiling JSX elements using the classic JSX runtime
      --jsx-fragment         Changes the function called when compiling JSX fragments
      --jsx-import-source    Declares the module specifier to be used for importing the jsx and jsxs factory functions. Default: "react"
      --jsx-runtime          "automatic" (default) or "classic"
      --env-file             Load environment variables from the specified file(s)
      --cwd                  Absolute path to resolve files & entry points from. This just changes the process' cwd.
  -c, --config               Specify path to Bun config file. Default <d>$cwd<r>/bunfig.toml
  -h, --help                 Display this menu and exit

package.json scripts (5 found):
  $ bun run clean
    rimraf src/.observablehq/cache

  $ bun run build
    observable build

  $ bun run dev
    observable preview

  $ bun run deploy
    observable deploy

  $ bun run observable
    observable


Examples:
  Run a JavaScript or TypeScript file
  bun run ./index.js
  bun run ./index.tsx

  Run a package.json script
  bun run dev
  bun run lint

Full documentation is available at https://bun.sh/docs/cli/run
.venvshelbernstein@shels-macbook-pro examples % bun run observable
$ observable
usage: observable <command>
  create       create a new app from a template
  preview      start the preview server
  build        generate a static site
  login        sign-in to Observable
  logout       sign-out of Observable
  deploy       deploy an app to Observable
  whoami       check authentication status
  convert      convert an Observable notebook to Markdown
  help         print usage information
  version      print the version
error: script "observable" exited with code 1
.venvshelbernstein@shels-macbook-pro examples % bun run observable convert 
https://observablehq.com/@asrenninger/park-access-in-london
https://observablehq.com/@twitter/density-scatterplot
https://observablehq.com/@fil/advent-of-code-12
https://observablehq.com/@laotzunami/jungs-window-mandala
https://observablehq.com/@enjalot
https://observablehq.com/@enjalot/touring-the-d3-ecosystem
https://observablehq.com/@asg017/100-command-line-tools-for-data-viz
https://observablehq.com/@floatingpurr/visualizing-twitter-data
https://observablehq.com/@mbostock/liquidfun
https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl
https://observablehq.com/@rreusser
https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss
https://observablehq.com/@mattdesl
https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path
https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype
https://observablehq.com/@donghaoren/buddhabrot-playground
https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
https://observablehq.com/@timhau/conways-game-of-life-on-a-torus
https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1
https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons
https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation
https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings
https://observablehq.com/@uwdata/fast-kde
https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles

$ observable convert
Warning: the config file is missing the root option, which specifies the path to
the source root. You can suppress this warning by specifying root: "src" in the
config file.

(node:6665) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
┌   observable convert  v1.12.0
│
◇  Note ─────────────────────────────────────────────────────────────╮
│                                                                    │
│  Due to syntax differences between Observable notebooks and        │
│  Observable Framework, converted notebooks may require further     │
│  changes to function correctly. To learn more about JavaScript in  │
│  Framework, please read:                                           │
│                                                                    │
│  https://observablehq.com/framework/javascript                     │
│                                                                    │
├────────────────────────────────────────────────────────────────────╯
│
└  0 notebooks converted; 0 files written

zsh: no such file or directory: https://observablehq.com/@asrenninger/park-access-in-london
zsh: no such file or directory: https://observablehq.com/@twitter/density-scatterplot
zsh: no such file or directory: https://observablehq.com/@fil/advent-of-code-12
zsh: no such file or directory: https://observablehq.com/@laotzunami/jungs-window-mandala
zsh: no such file or directory: https://observablehq.com/@enjalot
zsh: no such file or directory: https://observablehq.com/@enjalot/touring-the-d3-ecosystem
zsh: no such file or directory: https://observablehq.com/@asg017/100-command-line-tools-for-data-viz
zsh: no such file or directory: https://observablehq.com/@floatingpurr/visualizing-twitter-data
zsh: no such file or directory: https://observablehq.com/@mbostock/liquidfun
zsh: no such file or directory: https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl
zsh: no such file or directory: https://observablehq.com/@rreusser
zsh: no such file or directory: https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss
zsh: no such file or directory: https://observablehq.com/@mattdesl
zsh: no such file or directory: https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path
zsh: no such file or directory: https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype
zsh: no such file or directory: https://observablehq.com/@donghaoren/buddhabrot-playground
zsh: no such file or directory: https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
zsh: no such file or directory: https://observablehq.com/@timhau/conways-game-of-life-on-a-torus
zsh: no such file or directory: https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1
zsh: no such file or directory: https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons
zsh: no such file or directory: https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation
zsh: no such file or directory: https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings
zsh: no such file or directory: https://observablehq.com/@uwdata/fast-kde
zsh: no such file or directory: https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles
.venvshelbernstein@shels-macbook-pro examples % bun run observable convert  https://observablehq.com/@asrenninger/park-access-in-london
https://observablehq.com/@twitter/density-scatterplot      
https://observablehq.com/@fil/advent-of-code-12      
https://observablehq.com/@laotzunami/jungs-window-mandala
https://observablehq.com/@enjalot                        
https://observablehq.com/@enjalot/touring-the-d3-ecosystem
https://observablehq.com/@asg017/100-command-line-tools-for-data-viz
https://observablehq.com/@floatingpurr/visualizing-twitter-data     
https://observablehq.com/@mbostock/liquidfun                   
https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl
https://observablehq.com/@rreusser                                 
https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss
https://observablehq.com/@mattdesl                                    
https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path
https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype
https://observablehq.com/@donghaoren/buddhabrot-playground               
https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
https://observablehq.com/@timhau/conways-game-of-life-on-a-torus                       
https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1
https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons
https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation             
https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings     
https://observablehq.com/@uwdata/fast-kde                             
https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles

$ observable convert https://observablehq.com/@asrenninger/park-access-in-london
Warning: the config file is missing the root option, which specifies the path to
the source root. You can suppress this warning by specifying root: "src" in the
config file.

(node:6881) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
┌   observable convert  v1.12.0
│
◇  Downloaded src/park-access-in-london.md in 266ms
│
◇  Downloaded src/london_entrances.csv in 656ms
│
◇  Downloaded src/london_nodes.csv in 1,101ms
│
◇  Downloaded src/london_edges.csv in 764ms
│
◇  Note ─────────────────────────────────────────────────────────────╮
│                                                                    │
│  Due to syntax differences between Observable notebooks and        │
│  Observable Framework, converted notebooks may require further     │
│  changes to function correctly. To learn more about JavaScript in  │
│  Framework, please read:                                           │
│                                                                    │
│  https://observablehq.com/framework/javascript                     │
│                                                                    │
├────────────────────────────────────────────────────────────────────╯
│
└  1 notebook converted; 4 files written

zsh: no such file or directory: https://observablehq.com/@twitter/density-scatterplot
zsh: no such file or directory: https://observablehq.com/@fil/advent-of-code-12
zsh: no such file or directory: https://observablehq.com/@laotzunami/jungs-window-mandala
zsh: no such file or directory: https://observablehq.com/@enjalot
zsh: no such file or directory: https://observablehq.com/@enjalot/touring-the-d3-ecosystem
zsh: no such file or directory: https://observablehq.com/@asg017/100-command-line-tools-for-data-viz
zsh: no such file or directory: https://observablehq.com/@floatingpurr/visualizing-twitter-data
zsh: no such file or directory: https://observablehq.com/@mbostock/liquidfun
zsh: no such file or directory: https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl
zsh: no such file or directory: https://observablehq.com/@rreusser
zsh: no such file or directory: https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss
zsh: no such file or directory: https://observablehq.com/@mattdesl
zsh: no such file or directory: https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path
zsh: no such file or directory: https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype
zsh: no such file or directory: https://observablehq.com/@donghaoren/buddhabrot-playground
zsh: no such file or directory: https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js
zsh: no such file or directory: https://observablehq.com/@timhau/conways-game-of-life-on-a-torus
zsh: no such file or directory: https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1
zsh: no such file or directory: https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons
zsh: no such file or directory: https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation
zsh: no such file or directory: https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings
zsh: no such file or directory: https://observablehq.com/@uwdata/fast-kde
zsh: no such file or directory: https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles
.venvshelbernstein@shels-macbook-pro examples % bun run observable convert   https://observablehq.com/@twitter/density-scatterplot https://observablehq.com/@fil/advent-of-code-12 https://observablehq.com/@laotzunami/jungs-window-mandala https://observablehq.com/@enjalot https://observablehq.com/@enjalot/touring-the-d3-ecosystem https://observablehq.com/@asg017/100-command-line-tools-for-data-viz https://observablehq.com/@floatingpurr/visualizing-twitter-data https://observablehq.com/@mbostock/liquidfun https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl  https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss  https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype https://observablehq.com/@donghaoren/buddhabrot-playground https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js https://observablehq.com/@timhau/conways-game-of-life-on-a-torus https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1 https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings https://observablehq.com/@uwdata/fast-kde https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles                                                                                

$ observable convert https://observablehq.com/@twitter/density-scatterplot https://observablehq.com/@fil/advent-of-code-12 https://observablehq.com/@laotzunami/jungs-window-mandala https://observablehq.com/@enjalot https://observablehq.com/@enjalot/touring-the-d3-ecosystem https://observablehq.com/@asg017/100-command-line-tools-for-data-viz https://observablehq.com/@floatingpurr/visualizing-twitter-data https://observablehq.com/@mbostock/liquidfun https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype https://observablehq.com/@donghaoren/buddhabrot-playground https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js https://observablehq.com/@timhau/conways-game-of-life-on-a-torus https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1 https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings https://observablehq.com/@uwdata/fast-kde https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles
Warning: the config file is missing the root option, which specifies the path to
the source root. You can suppress this warning by specifying root: "src" in the
config file.

(node:8194) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
┌   observable convert  v1.12.0
│
◇  Downloaded src/density-scatterplot.md in 242ms
│
◇  Downloaded src/advent-of-code-12.md in 185ms
│
◇  Downloaded src/jungs-window-mandala.md in 191ms
│
◇  Downloaded src/Background_Texture.jpg in 1,147ms
│
◇  Downloaded src/Light_Blue_Rays.jpg in 253ms
│
◇  Downloaded src/Light_Red@1.jpg in 382ms
│
◇  Downloaded src/Walls_Texture@4.jpg in 684ms
│
◇  Downloaded src/Center_Texture@3.jpg in 335ms
│
◒  Downloading src/@enjalot.md│
■  Error: error fetching https://api.observablehq.com/document/@enjalot: 401
│
●  To see the full stack trace, run with the --debug flag.
│
│  If you think this is a bug, please file an issue at
└  https://github.com/observablehq/framework/issues

■  Canceled
error: script "observable" exited with code 1
.venvshelbernstein@shels-macbook-pro examples % bun run observable convert https://observablehq.com/@enjalot https://observablehq.com/@enjalot/touring-the-d3-ecosystem https://observablehq.com/@asg017/100-command-line-tools-for-data-viz https://observablehq.com/@floatingpurr/visualizing-twitter-data https://observablehq.com/@mbostock/liquidfun https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl  https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss  https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype https://observablehq.com/@donghaoren/buddhabrot-playground https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js https://observablehq.com/@timhau/conways-game-of-life-on-a-torus https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1 https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings https://observablehq.com/@uwdata/fast-kde https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles                            

$ observable convert https://observablehq.com/@enjalot https://observablehq.com/@enjalot/touring-the-d3-ecosystem https://observablehq.com/@asg017/100-command-line-tools-for-data-viz https://observablehq.com/@floatingpurr/visualizing-twitter-data https://observablehq.com/@mbostock/liquidfun https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype https://observablehq.com/@donghaoren/buddhabrot-playground https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js https://observablehq.com/@timhau/conways-game-of-life-on-a-torus https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1 https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings https://observablehq.com/@uwdata/fast-kde https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles
Warning: the config file is missing the root option, which specifies the path to
the source root. You can suppress this warning by specifying root: "src" in the
config file.

(node:8963) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
┌   observable convert  v1.12.0
│
◐  Downloading src/@enjalot.md│
■  Error: error fetching https://api.observablehq.com/document/@enjalot: 401
│
●  To see the full stack trace, run with the --debug flag.
│
│  If you think this is a bug, please file an issue at
└  https://github.com/observablehq/framework/issues

■  Canceled
error: script "observable" exited with code 1
.venvshelbernstein@shels-macbook-pro examples % bun run observable convert https://observablehq.com/@enjalot/touring-the-d3-ecosystem https://observablehq.com/@asg017/100-command-line-tools-for-data-viz https://observablehq.com/@floatingpurr/visualizing-twitter-data https://observablehq.com/@mbostock/liquidfun https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl  https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss  https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype https://observablehq.com/@donghaoren/buddhabrot-playground https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js https://observablehq.com/@timhau/conways-game-of-life-on-a-torus https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1 https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings https://observablehq.com/@uwdata/fast-kde https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles      

$ observable convert https://observablehq.com/@enjalot/touring-the-d3-ecosystem https://observablehq.com/@asg017/100-command-line-tools-for-data-viz https://observablehq.com/@floatingpurr/visualizing-twitter-data https://observablehq.com/@mbostock/liquidfun https://observablehq.com/@bmschmidt/animating-voting-maps-with-regl https://observablehq.com/@barefootbiology/simulating-rod-and-cone-loss https://observablehq.com/@cguastini/3d-webgl-particles-over-an-svg-path https://observablehq.com/@iamgrahamallen/sprite-graphics-canvas-prototype https://observablehq.com/@donghaoren/buddhabrot-playground https://observablehq.com/@bmschmidt/zoom-strategies-for-huge-scatterplots-with-three-js https://observablehq.com/@timhau/conways-game-of-life-on-a-torus https://observablehq.com/@rreusser/strange-attractors-on-the-gpu-part-1 https://observablehq.com/@bmschmidt/regl-and-earcut-for-rendering-very-detailed-polygons https://observablehq.com/@rreusser/2d-n-body-gravity-with-poissons-equation https://observablehq.com/@saehrimnir/dimensionality-reduction-drawings https://observablehq.com/@uwdata/fast-kde https://observablehq.com/@tmcw/isometric-real-world-terrarium-tiles
Warning: the config file is missing the root option, which specifies the path to
the source root. You can suppress this warning by specifying root: "src" in the
config file.

(node:9158) [DEP0040] DeprecationWarning: The `punycode` module is deprecated. Please use a userland alternative instead.
(Use `node --trace-deprecation ...` to show where the warning was created)
┌   observable convert  v1.12.0
│
◇  Downloaded src/touring-the-d3-ecosystem.md in 259ms
│
◇  Downloaded src/d3js.png in 1,315ms
│
◇  Downloaded src/hamilton.png in 426ms
│
◇  Downloaded src/NYT512paths.png in 338ms
│
◇  Downloaded src/NYTObamaBudget.png in 322ms
│
◇  Downloaded src/WaPoSegregated@1.png in 362ms
│
◇  Downloaded src/r2d3.png in 305ms
│
◇  Downloaded src/ReutersShiftingSmoke@1.png in 274ms
│
◇  Downloaded src/alignedleft.png in 420ms
│
◇  Downloaded src/distill@1.png in 278ms
│
(node:9158) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 uncaughtExceptionMonitor listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(node:9158) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 unhandledRejection listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(node:9158) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 SIGINT listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(node:9158) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 SIGTERM listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
(node:9158) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 exit listeners added to [process]. MaxListeners is 10. Use emitter.setMaxListeners() to increase limit
◇  Downloaded src/distill-interactives@1.png in 399ms
│
◇  Downloaded src/fullstackd3.png in 578ms
│
◇  Downloaded src/wattenberger-d3.png in 304ms
│
◇  Downloaded src/stackoverflow.png in 376ms
│
◇  Downloaded src/d3mailinglist.png in 355ms
│
◇  Downloaded src/slack.png in 272ms
│
◇  Downloaded src/datasketches.png in 517ms
│
◇  Downloaded src/observable-explore@1.png in 392ms
│
◇  Downloaded src/d3twitter.png in 302ms
│
◇  Downloaded src/d3youtube.png in 471ms
│
◇  Downloaded src/meetup.png in 290ms
│
◇  Downloaded src/d3-online.png in 578ms
│
◇  Downloaded src/github.png in 210ms
│
◇  Downloaded src/visfest-youtube.png in 264ms
│
◇  Downloaded src/d3map.png in 304ms
│
◇  Downloaded src/100-command-line-tools-for-data-viz.md in 242ms
│
◇  Downloaded src/visualizing-twitter-data.md in 161ms
│
◇  Downloaded src/twitter.json in 288ms
│
◇  Downloaded src/data pane.png in 201ms
│
◇  Downloaded src/liquidfun.md in 179ms
│
◇  Downloaded src/animating-voting-maps-with-regl.md in 171ms
│
◇  Downloaded src/ne_50m_admin_0_countries_lakes.gleofeather in 735ms
│
◇  Downloaded src/simulating-rod-and-cone-loss.md in 170ms
│
◇  Downloaded src/central_bscan_data@2.tsv in 295ms
│
◇  Downloaded src/central_bscan_od@2.png in 313ms
│
◇  Downloaded src/central_bscan_os@1.png in 405ms
│
◇  Downloaded src/3d-webgl-particles-over-an-svg-path.md in 179ms
│
◇  Downloaded src/SnowFlake04.svg in 296ms
│
◇  Downloaded src/sprite-graphics-canvas-prototype.md in 229ms
│
◇  Downloaded src/ground_tile_foliage1.png in 282ms
│
◇  Downloaded src/ground_tile_porous2.png in 230ms
│
◇  Downloaded src/ground_tile_foliage2.png in 265ms
│
◇  Downloaded src/ground_tile_porous1.png in 205ms
│
◇  Downloaded src/stair4.png in 198ms
│
◇  Downloaded src/stair1.png in 344ms
│
◇  Downloaded src/bee1.png in 204ms
│
◇  Downloaded src/crow1.png in 225ms
│
◇  Downloaded src/rock1.png in 233ms
│
◇  Downloaded src/door1.png in 213ms
│
◇  Downloaded src/reeds1.png in 230ms
│
◇  Downloaded src/tomb1.png in 207ms
│
◇  Downloaded src/buddhabrot-playground.md in 163ms
│
◇  Downloaded src/zoom-strategies-for-huge-scatterplots-with-three-js.md in 165ms
│
◇  Downloaded src/conways-game-of-life-on-a-torus.md in 158ms
│
◇  Downloaded src/strange-attractors-on-the-gpu-part-1.md in 201ms
│
◇  Downloaded src/regl-and-earcut-for-rendering-very-detailed-polygons.md in 155ms
│
◇  Downloaded src/gz_2010_us_050_00_20m.json in 326ms
│
◇  Downloaded src/gz_2010_us_050_00_5m.json in 371ms
│
◇  Downloaded src/oput.topojson in 877ms
│
◇  Downloaded src/2d-n-body-gravity-with-poissons-equation.md in 181ms
│
◇  Downloaded src/dimensionality-reduction-drawings.md in 154ms
│
◇  Downloaded src/fast-kde.md in 159ms
│
◇  Downloaded src/isometric-real-world-terrarium-tiles.md in 180ms
│
◇  Note ─────────────────────────────────────────────────────────────╮
│                                                                    │
│  Due to syntax differences between Observable notebooks and        │
│  Observable Framework, converted notebooks may require further     │
│  changes to function correctly. To learn more about JavaScript in  │
│  Framework, please read:                                           │
│                                                                    │
│  https://observablehq.com/framework/javascript                     │
│                                                                    │
├────────────────────────────────────────────────────────────────────╯
│
└  17 notebooks converted; 63 files written

.venvshelbernstein@shels-macbook-pro examples %  ls
src
.venvshelbernstein@shels-macbook-pro examples % https://observablehq.com/pricing                                                                                                 
https://observablehq.com/@d3/contours?intent=fork        
https://observablehq.com/@d3/zoomable-circle-packing?intent=fork
https://observablehq.com/@d3/radial-cluster/2?intent=fork
https://observablehq.com/@d3/brushable-scatterplot?intent=fork
https://observablehq.com/@d3/treemap/2?intent=fork 
https://observablehq.com/@d3/calendar/2               
https://observablehq.com/@d3/the-impact-of-vaccines           
https://observablehq.com/@mbostock/electric-usage-2019            
https://observablehq.observablehq.cloud/framework-example-eia/           
https://observablehq.observablehq.cloud/framework-example-us-dams/       
https://observablehq.observablehq.cloud/framework-example-mortgage-rates/
https://observablehq.observablehq.cloud/framework-example-hotel-bookings/
https://observablehq.com/@observablehq/plot-sorted-heatmap
https://observablehq.com/@observablehq/plot-auto-mark-heatmap
https://observablehq.com/@observablehq/plot-percentogram  
https://observablehq.com/@observablehq/plot-mandelbrot-set   
https://observablehq.com/@observablehq/plot-volcano-raster    
https://observablehq.com/@observablehq/plot-raster-projection     
https://observablehq.com/@observablehq/plot-function-contour-2
https://observablehq.com/@visionscarto/planar-vs-spherical-voronoi
https://observablehq.com/@observablehq/plot-delaunay-links                                                                                                                 <....



https://idl.uw.edu/mosaic-framework-example/    
https://climatecentral.observablehq.cloud/urban-heat-hot-spots/
https://tibotiber.observablehq.cloud/smplrvable/     
https://m-clare.observablehq.cloud/boston-building-retrofits/
https://waveform-analytics.github.io/wa_density_demo/     
https://csdiehl.github.io/private-jet-emissions/            


#bun run js/convert_md_to_sqlite.js


# ///the course is generated by a modules.json 
# // each submodule is a folder with a index.md

# // this script converts all the md files to a sqlite database
# // each prompt in the modules.json is a prompt that is run on the ai to generate the content of the submodule
# // each prompt makes a file in the folder bucket
# // theres 3 types of files js, md, json, pdf, images, and video, audio
# // the js files are the most important and are the backbone of the course
# //  pdf are preprocessed into images and text + an html for ease of use + storage


# // each course submmodule renders an observable frameowork page
# /// he page has 3 contents
# // title
# // toc
# // content - daigrams + captions + links
# // bibliogrpahy for further reading
# // also thhers a group-chatbot for testing people on their knowledge progress. 

# //the knowledge progress makes everyones robot smarter  -> you can add your own robot to the clsuter for $500 for basic version
# //more robots = more compute = faster results
# // the robots are like mini computers that can run in the background and stream compute to the main computer
# // the main computer is the one that is used to surf the web, run apps, and do other stuff
# // the robots are used to do the heavy lifting of rendering the content and running the ai prompts

