// See https://observablehq.com/framework/config for documentation.
export default {
  // The project’s title; used in the sidebar and webpage titles.
  title: "Latent Scope",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  pages: [
    {
      name: "Guides",
      pages: [
        {name: "Install & Configure", path: "/install-and-config"},
        {name: "Your First Scope", path: "/your-first-scope"},
        {name: "Explore and Curate", path: "/explore-and-curate"},
        {name: "Exporting data", path: "/exporting-data"},
        // {name: "Cluster Sculpting", path: "/cluster-sculpting"},
      ]
    },
    { 
      name: "Example Analysis", pages: [
        {name: "Datavis Survey", path: "/datavis-survey"},
        {name: "GitHub Issues & PRs", path: "/plot-issues"},
        {name: "enjalot's tweets", path: "/enjalot-tweets"},
        {name: "US Federal Laws", path: "/us-federal-laws"},
      ]
    }
  ],

  // Some additional configuration options and their defaults:
  // theme: "default", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  // footer: "Built with Observable.", // what to show in the footer (HTML)
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // root: "docs", // path to the source root for preview
  // output: "dist", // path to the output root for build
  // search: true, // activate search

  header: `
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-W8EM95KSJZ"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-W8EM95KSJZ');
  </script>
  
  <link rel="stylesheet" type="text/css" href="index.css">
  <div style="display: flex; align-items: center; gap: 0.5rem; height: 2.2rem; margin: -1.5rem -2rem 2rem -2rem; padding: 0.5rem 2rem; border-bottom: solid 1px var(--theme-foreground-faintest); font: 500 16px var(--sans-serif);">
    <div style="display: flex; flex-grow: 1; justify-content: space-between; align-items: baseline;">
      <a href="/">
        Latent Scope
      </a>
      <span style="display: flex; align-items: baseline; gap: 0.5rem; font-size: 14px;">
        <a target="_blank" href="https://github.com/enjalot/latent-scope">GitHub</a>
        <a target="_blank" href="https://pypi.org/project/latentscope/">Python Module</a>
        <a target="_blank" href="https://discord.gg/x7NvpnM4pY">Discord</a>
        
        <a target="_blank" href="https://github.com/enjalot/latent-scope-observable-examples">Examples Source</a>
      </span>
    </div>
  </div>`
};
// <a href="https://discord.gg/x7NvpnM4pY" target="_blank">
//   <img src="https://dcbadge.vercel.app/api/server/x7NvpnM4pY?style=flat" alt="Discord">
// </a>
// <a href="https://pypi.org/project/latentscope/" target="_blank">
//     <img src="https://img.shields.io/pypi/v/latentscope.svg" alt="PyPI version">
// </a>
