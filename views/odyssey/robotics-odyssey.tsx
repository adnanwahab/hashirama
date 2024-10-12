import React from 'react';

function TeleGuidanceFrame() {
  return (
    <iframe
      style={{ backgroundColor: 'white' }}
      width="100%"
      height="500"
      frameBorder="0"
      src="https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*"
    ></iframe>
  );
}

function RoboticsOdyssey() {
  return (
    <html className="dark">
      <body className="text-gray-950 antialiased bg-slate-900">
        <div className="overflow-hidden">
          <main>
            <div className="1">
              <div>
                <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
                  <p className="mt-2 max-w-lg text-pretty text-4xl font-medium tracking-tight text-blue-200 sm:text-5xl">
                    Robotics made simple, easy, and fun.
                  </p>
                  <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-1">
                    <div className="flex p-px lg:col-span-4">
                      <div className="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 max-lg:rounded-t-[2rem] lg:rounded-tl-[2rem] w-full">
                        <div id="livekit-container" className="h-80 w-full">
                          <TeleGuidanceFrame />
                        </div>
                      </div>
                    </div>
                    <div className="flex p-px lg:col-span-2">
                      <div className="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 lg:rounded-tr-[2rem]">
                        {/* Replace with appropriate JSX or component */}
                      </div>
                    </div>
                    <div className="flex p-px lg:col-span-2">
                      <div className="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 lg:rounded-bl-[2rem]">
                        {/* Replace with appropriate JSX or component */}
                      </div>
                    </div>
                    <div className="flex p-px lg:col-span-4">
                      <div className="overflow-hidden rounded-lg bg-gray-800 ring-1 ring-white/15 max-lg:rounded-b-[2rem] lg:rounded-br-[2rem]">
                        {/* Replace with appropriate JSX or component */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="2">
                <iframe src="http://localhost:3000"></iframe>
              </div>

              <div>
                <script src="https://unpkg.com/htmx.org@2.0.3"></script>

                <div className="relative isolate overflow-hidden bg-gray-900 py-16 sm:py-24 lg:py-32">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
                      <div className="max-w-xl lg:max-w-lg">
                        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                          Join Robotics Odyssey
                        </h2>
                        <p className="mt-4 text-lg leading-8 text-gray-300">
                          Only $95 for a 48 hour complete course
                        </p>
                        <div className="mt-6 flex max-w-md gap-x-4">
                          <form action="/contact/email" method="post">
                            <label htmlFor="email-address" className="sr-only">
                              Email address
                            </label>
                            <input
                              id="email-address"
                              name="email"
                              type="email"
                              autoComplete="email"
                              required
                              className="min-w-0 flex-auto rounded-md border-0 bg-white/5 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                              placeholder="Enter your email"
                            />
                            <button
                              type="submit"
                              className="flex-none rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            >
                              Start learning now
                            </button>
                            <div id="response-message" className="mt-2 text-sm text-white"></div>
                          </form>
                        </div>
                      </div>
                      <dl className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:pt-2">
                        <div className="flex flex-col items-start">
                          <div className="rounded-md bg-white/5 p-2 ring-1 ring-white/10">
                            <svg
                              className="h-6 w-6 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              aria-hidden="true"
                              data-slot="icon"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                              />
                            </svg>
                          </div>
                          <dt className="mt-4 font-semibold text-white">Weekly updates</dt>
                          <dd className="mt-2 leading-7 text-gray-400">
                            48 hours of video and 48 Notebooks to go from absolute beginner to
                            advanced Robotics and Machine Learning Engineer.
                          </dd>
                        </div>
                        {/* Additional content omitted for brevity */}
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}

export default RoboticsOdyssey;