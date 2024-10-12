{{ define "content" }}
<h2>This is the content section</h2>
<p>Hello, this is where the content goes!</p>
{{ end }}

{/* <head>
<!-- <link
  rel="stylesheet"
  href="https://radiant.tailwindui.com/_next/static/css/5b849275a16cf72f.css"
/> -->
<link rel="stylesheet" href="/static/css/output.css" />
<title>Robotics Odyssey - Info Course like pwf </title>
<!-- 
<link rel="stylesheet" href="/static/radiant.css" />
<link rel="stylesheet" href="/static/radiant_2.css" />
<link rel="stylesheet" href="/static/radiant_3.css" /> -->
<!-- <link
  rel="stylesheet"
  href="https://adnanwahab.com/_next/static/css/946d5f8790e4487c.css"
/> -->

          <style>
              .tele-guidance-livekit {
                height: 800px;
              }
            
              .tele-guidance-voxels {
                width: 600px;
              }
             </style>
</head> */}

  
// <!--   <div id="observablehq-fba2beec"></div>
// <p>Credit: <a href="https://observablehq.com/@roboticsuniversity/dynamicland">DynamicLand by roboticsuniversity</a></p>

// <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@observablehq/inspector@5/dist/inspector.css">
// <script type="module">
// import {Runtime, Inspector} from "https://cdn.jsdelivr.net/npm/@observablehq/runtime@5/dist/runtime.js";
// import define from "https://api.observablehq.com/@roboticsuniversity/dynamicland.js?v=4";
// new Runtime().module(define, Inspector.into("#observablehq-fba2beec"));
// </script>`)
//  -->

function  teleGuidanceframe() {
  return (<<iframe style="background-color: white;" width="100%" height="500" frameborder="0" src="https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*"></iframe>)
}

function RoboticsOdyssey() {
  return (<html class="dark">
   <body class="text-gray-950 antialiased bg-slate-900">
    <div class="overflow-hidden">
    <main>
        <div class="1">
          <div>
            <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
              <p
                class="mt-2 max-w-lg text-pretty text-4xl font-medium tracking-tight text-blue-200 sm:text-5xl"
              >
                Robotics made simple, easy, and fun.
              </p>
              <div
                class="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-1"
              >
                <div class="flex p-px lg:col-span-4">
                  <div
                    class="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem] w-full"
                  >
                    <div id="livekit-container" class="h-80 w-full">
                       <TeleGuidanceframe("livekit_subscriber")>
                    </div>
            
                  </div>
                </div>
                <div class="flex p-px lg:col-span-2">
                  <div
                    class="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 lg:rounded-tr-[2rem]"
                  >
                    {{template "tele-guidance-frame" "twitch"}}
                  </div>
                </div>
            
                <div class="flex p-px lg:col-span-2">
                  <div
                    class="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 lg:rounded-bl-[2rem]"
                  >
                  {{template "tele-guidance-frame" "hardware"}}
            
                  </div>
                </div>
            
                <div class="flex p-px lg:col-span-4">
                  <div
                    class="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]"
                  >
                    {{template "tele-guidance-frame" "voxels"}}
                    <!-- <iframe style="width: 600px; " class="iframe-container" src="https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*"></iframe> -->
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="2">
            <iframe
            src="http://localhost:3000"
          ></iframe>          
        </div>

          <div><script src="https://unpkg.com/htmx.org@2.0.3"></script>

            <div
              class="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32"
            >
              <div class="mx-auto max-w-7xl px-6 lg:px-8">
                <div
                  class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2"
                >
                  <div class="max-w-xl lg:max-w-lg">
                    <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                      Join Robotics Odyssey
                    </h2>
                    <p class="mt-4 text-lg leading-8 text-gray-300">
                      Only $95 for a 48 hour complete course
                    </p>
                    <div class="mt-6 flex max-w-md gap-x-4">
                      <form hx-post="/contact/email" hx-swap="outerHTML">
                        <label for="email-address" class="sr-only">Email address</label>
                        <input
                          id="email-address"
                          name="email"
                          type="email"
                          autocomplete="email"
                          required
                          class="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                          placeholder="Enter your email"
                        />
                        <button
                          type="submit"
                          class="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                          Start learning now
                        </button>
                        <div id="response-message" class="mt-2 text-sm text-white"></div>
                      </form>
                    </div>
                  </div>
                  <dl class="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                    <div class="flex flex-col items-start">
                      <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                        <svg
                          class="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                          />
                        </svg>
                      </div>
                      <dt class="mt-4 font-semibold text-white">Weekly updates</dt>
                      <dd class="mt-2 leading-7 text-gray-400">
                        48 hours of video and 48 Notebooks to go from absolute beginner to
                        advanced Robotics and Machine Learning Engineer.
                      </dd>
                    </div>
                    <div class="flex flex-col items-start">
                      <div class="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                        <svg
                          class="h-6 w-6 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          aria-hidden="true"
                          data-slot="icon"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
                          />
                        </svg>
                      </div>
                      <dt class="mt-4 font-semibold text-white">
                        Everything you need in one place:
                      </dt>
                      <dd class="mt-2 leading-7 text-gray-400">
                        Free Compute, no upsells, buy it once for life. Discounts on robotic
                        hardware, nvidia jetson, and more.
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <!-- <div class="absolute left-1/2 top-0 -z-10 -translate-x-1/2 blur-3xl xl:-top-6" aria-hidden="true">
                  <div class="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30" style="clip-path: polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)"></div>
                </div> -->
            </div>
            </div>
        </div>
        <footer class="border-t border-gray-700 border-2-t">
          <div
            class="mx-auto max-w-7xl px-6 py-6 md:flex md:items-center md:justify-between lg:px-8"
          >
            <div class="flex justify-center space-x-6 md:order-2">
              <a
                href="https://observablehq.com/collection/@roboticsuniversity/robotics-odyssey"
                class="text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">observablehq</span>
                <svg
                  role="img"
                  viewBox="0 0 25 28"
                  width="25"
                  height="28"
                  aria-label="Observable"
                  fill="currentColor"
                  style="width: 22px"
                  class="white"
                >
                  <path
                    d="M12.5 22.6667C11.3458 22.6667 10.3458 22.4153 9.5 21.9127C8.65721 21.412 7.98339 20.7027 7.55521 19.8654C7.09997 18.9942 6.76672 18.0729 6.56354 17.1239C6.34796 16.0947 6.24294 15.0483 6.25 14C6.25 13.1699 6.30417 12.3764 6.41354 11.6176C6.52188 10.8598 6.72292 10.0894 7.01563 9.30748C7.30833 8.52555 7.68542 7.84763 8.14479 7.27274C8.62304 6.68378 9.24141 6.20438 9.95208 5.87163C10.6979 5.51244 11.5458 5.33333 12.5 5.33333C13.6542 5.33333 14.6542 5.58467 15.5 6.08733C16.3428 6.588 17.0166 7.29733 17.4448 8.13459C17.8969 8.99644 18.2271 9.9103 18.4365 10.8761C18.6448 11.841 18.75 12.883 18.75 14C18.75 14.8301 18.6958 15.6236 18.5865 16.3824C18.4699 17.1702 18.2639 17.9446 17.9719 18.6925C17.6698 19.4744 17.2948 20.1524 16.8427 20.7273C16.3906 21.3021 15.7927 21.7692 15.0479 22.1284C14.3031 22.4876 13.4542 22.6667 12.5 22.6667ZM14.7063 16.2945C15.304 15.6944 15.6365 14.864 15.625 14C15.625 13.1073 15.326 12.3425 14.7292 11.7055C14.1313 11.0685 13.3885 10.75 12.5 10.75C11.6115 10.75 10.8688 11.0685 10.2708 11.7055C9.68532 12.3123 9.36198 13.1405 9.375 14C9.375 14.8927 9.67396 15.6575 10.2708 16.2945C10.8688 16.9315 11.6115 17.25 12.5 17.25C13.3885 17.25 14.124 16.9315 14.7063 16.2945ZM12.5 27C19.4031 27 25 21.1792 25 14C25 6.82075 19.4031 1 12.5 1C5.59687 1 0 6.82075 0 14C0 21.1792 5.59687 27 12.5 27Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </a>
              {{if false}}
              <a
                href="https://linkedin.com/in/robotics-university"
                class="text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">Linkedin</span>
                <svg
                  height="16"
                  version="1.1"
                  viewBox="0 0 512 512"
                  width="16"
                  style="fill: currentcolor"
                >
                  <title>LinkedIn</title>
                  <path
                    d="M473.305,-1.353c20.88,0 37.885,16.533 37.885,36.926l0,438.251c0,20.393 -17.005,36.954 -37.885,36.954l-436.459,0c-20.839,0 -37.773,-16.561 -37.773,-36.954l0,-438.251c0,-20.393 16.934,-36.926 37.773,-36.926l436.459,0Zm-37.829,436.389l0,-134.034c0,-65.822 -14.212,-116.427 -91.12,-116.427c-36.955,0 -61.739,20.263 -71.867,39.476l-1.04,0l0,-33.411l-72.811,0l0,244.396l75.866,0l0,-120.878c0,-31.883 6.031,-62.773 45.554,-62.773c38.981,0 39.468,36.461 39.468,64.802l0,118.849l75.95,0Zm-284.489,-244.396l-76.034,0l0,244.396l76.034,0l0,-244.396Zm-37.997,-121.489c-24.395,0 -44.066,19.735 -44.066,44.047c0,24.318 19.671,44.052 44.066,44.052c24.299,0 44.026,-19.734 44.026,-44.052c0,-24.312 -19.727,-44.047 -44.026,-44.047Z"
                    style="fill-rule: nonzero"
                  ></path>
                </svg>
              </a>
              {{end}} {{if false}}
              <a
                href="https://x.com/adnan_wahab_"
                class="text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">X</span>
                <svg
                  class="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z"
                  />
                </svg>
              </a>
              {{end}}
              <a
                href="https://github.com/BotParty"
                class="text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">GitHub</span>
                <svg
                  class="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://www.twitch.tv/roboticsodyssey"
                class="text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">Twitch</span>
                <svg
                  class="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M2.089 0L.525 4.175v16.694h5.736V24h3.132l3.127-3.132h4.695l6.26-6.258V0H2.089zm2.086 2.085H21.39v11.479l-3.652 3.652H12l-3.127 3.127v-3.127H4.175V2.085zM9.915 12.522H12v-6.26H9.915v6.26zm5.735 0h2.086v-6.26H15.65v6.26z"
                  />
                </svg>
              </a>
        
              <a
                href="https://www.youtube.com/@Robotics-Odyssey"
                class="text-gray-400 hover:text-gray-500"
              >
                <span class="sr-only">YouTube</span>
                <svg
                  class="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://discord.gg/YVAMRtKj"
                class="text-gray-400 hover:text-gray-500"
                ><span class="sr-only">Discord</span
                ><svg
                  class="w-6 h-6"
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Discord Logo"
                >
                  <g clip-path="url(#clip0_1993_195)">
                    <path
                      d="M11.8595 2.62936C10.9397 2.21264 9.96862 1.917 8.97117 1.75C8.83467 1.99146 8.71117 2.23988 8.60118 2.49424C7.5387 2.33581 6.45822 2.33581 5.39574 2.49424C5.28569 2.23991 5.16219 1.99149 5.02575 1.75C4.02766 1.91841 3.05598 2.21475 2.13524 2.63154C0.307332 5.30775 -0.188185 7.9175 0.0595735 10.4902C1.13004 11.2729 2.3282 11.8681 3.60197 12.25C3.88878 11.8683 4.14258 11.4633 4.36066 11.0394C3.94644 10.8863 3.54665 10.6974 3.16591 10.4749C3.26612 10.403 3.36412 10.3289 3.45882 10.257C4.56668 10.7726 5.77586 11.0399 7.00011 11.0399C8.22437 11.0399 9.43354 10.7726 10.5414 10.257C10.6372 10.3344 10.7352 10.4085 10.8343 10.4749C10.4528 10.6978 10.0523 10.887 9.63736 11.0405C9.85518 11.4642 10.109 11.8688 10.3961 12.25C11.6709 11.8696 12.87 11.2747 13.9406 10.4913C14.2314 7.50778 13.444 4.92201 11.8595 2.62936ZM4.67449 8.908C3.98407 8.908 3.41367 8.28798 3.41367 7.52522C3.41367 6.76245 3.96425 6.13699 4.67228 6.13699C5.38032 6.13699 5.94631 6.76245 5.9342 7.52522C5.92209 8.28798 5.37812 8.908 4.67449 8.908ZM9.32574 8.908C8.63422 8.908 8.06602 8.28798 8.06602 7.52522C8.06602 6.76245 8.6166 6.13699 9.32574 6.13699C10.0349 6.13699 10.5965 6.76245 10.5843 7.52522C10.5722 8.28798 10.0294 8.908 9.32574 8.908Z"
                      fill="currentColor"
                    ></path>
                  </g>
                  <defs>
                    <clipPath id="clip0_1993_195">
                      <rect width="14" height="14" fill="white"></rect>
                    </clipPath>
                  </defs></svg
              ></a>
            </div>
        
            <div class="mt-8 md:order-1 md:mt-0">
              <div class="text-sm/6 text-gray-150">
                <a
                  class="text-gray-400 hover:text-gray-500"
                  href="https://en.wikipedia.org/wiki/Silent_protagonist"
                >
                  <!-- Made with 💜💜🩵🩵 by a conduit of Alan Kay -->
                  <a href="/office-hours" class="text-gray-400 hover:text-gray-500">
                    Office Hours
                  </a>
                </a>
        
               
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  </body>
</html>


->

// {{define "sub-header"}}
// <header id="header" class="mb-10 md:flex md:items-start">
//   <div class="flex-auto max-w-4xl">
//     <p
//       class="mb-4 text-sm leading-6 font-semibold text-sky-500 dark:text-sky-400"
//     >
//       Installation
//     </p>
//     <h1
//       class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight dark:text-slate-200"
//     >
//       Get started with Tailwind CSS
//     </h1>
//     <p class="mt-4 text-lg text-slate-700 dark:text-slate-400">
//       Tailwind CSS works by scanning all of your HTML files, JavaScript
//       components, and any other templates for class names, generating the
//       corresponding styles and then writing them to a static CSS file.
//     </p>
//     <p class="mt-4 text-lg text-slate-700 dark:text-slate-400">
//       It's fast, flexible, and reliable — with zero-runtime.
//     </p>
//   </div>
// </header>



export default RoboticsOdyssey;

