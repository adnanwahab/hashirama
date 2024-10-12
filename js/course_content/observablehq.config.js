// See https://observablehq.com/framework/config for documentation.
export default {
  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The app’s title; used in the sidebar and webpage titles.
  title: "Robotics Odyssey",

  // The path to the source root.
  //root: "src",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.
  // pages: [
  //   {
  //     name: "Examples",
  //     pages: [
  //       { name: "perception", path: "../perception/readme.md" },
  //       { name: "Report", path: "/example-report" },
  //     ],
  //   },
  // ],

  // Some additional configuration options and their defaults:
  theme: "slate", // try "light", "dark", "slate", etc.
  // header: "", // what to show in the header (HTML)
  footer: "built by hashirama", // what to show in the footer (HTML)
  // sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  output: "../homelab-status-page/lessons", // path to the output root for build
  // search: true, // activate search
  // linkify: true, // convert URLs in Markdown to links
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs
  // only do what will be cool in 2085 / 3085
};
