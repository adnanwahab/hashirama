# Puppeteer JS Renderer on Fly
<!---- cut here --->

JavaScript is the bane of a web scraper's life. Scraping is all about extracting data from a web page and JavaScript is there adding content, hiding blocks, and moving the DOM around. Reading the HTML from the server is just not enough. What you ideally want is a way to run all that JavaScript on the page so you can see what's left after that. Then you can get down to some serious scraping.

There are tools to do this out there but most have their own complications or restrictions that make them difficult to deploy. Puppeteer has none of those problems and with [Fly](https://fly.io), you can deploy puppeteer based applications close to your users. At its core, this project is a puppeteer-based service. [Puppeteer](https://pptr.dev/) is a package that renders pages using a headless Chrome instance, executing the JavaScript within the page.

## Quick Start

A typical YouTube page will add the views count to itself only when the JavaScript on that page executes. These are the types of use cases where Puppeteer comes in very handy. Puppeteer can execute the JavaScript on the YouTube page and, from the rendered page, extract the view count and the title of the video.

Lets get started

### Install example project

To install this project locally, execute the following commands:

```
git clone https://github.com/fly-examples/puppeteer-js-renderer.git
cd puppeteer-js-renderer
npm install
```

### Your first scraper

To quickly try the project out after installing it, run the command below:

```
node yt-views.js
```

This will show something like below:

```
Pulling views from YouTube, please wait...
Luis Fonsi - Despacito ft. Daddy Yankee has 6,881,463,846 views
```

If you want to try any other video just pass the YouTube video URL as a parameter to the script like below:

```
node yt-views https://www.youtube.com/watch?v=XqZsoesa55w
```

It should give you an output like this:

```
Pulling views from YouTube, please wait...
Baby Shark Dance | Sing and Dance! | @Baby Shark Official | PINKFONG Songs for Children has 6,077,338,169 views
```

### What just happened here?

To show the YouTube video views count, a small scraper written with [Axrio](https://www.npmjs.com/package/@geshan/axrio) npm package was executed. Axrio combines the popular [Axios](https://www.npmjs.com/package/axios) library and [Cheerio](https://www.npmjs.com/package/cheerio) to create a mini scraper. Axios is used to make requests and Cheerio acts like DOM navigator parsing the markup and giving us an API for traversing/manipulating the resulting data structure. You can kickstart a small scraper with Axrio too.

The [yt-views.js](./yt-views) is a basic scraper which performs a GET request for the given YouTube URL with Puppeteer. This will return the final DOM after the page's JavaScript executes. Then it parses the title and views count out of the rendered page's markup and prints it on the console.

It uses the puppeteer-js-renderer service that is already deployed and running on Fly.io. Have a look at he "[how to use it as a service](#how-to-use-it-as-a-service)" section for more information. To start your own instance on Fly.io jump to the "[how to deploy on fly.io](#how-to-deploy-it-on-flyio)" section.

## Run locally

If you have node installed on your machine, you already cloned this repository and ran `npm install`. Now run `npm start` to get this service running locally.

The next step is to navigate to `http://localhost:8080/api/render?url=https://www.youtube.com/watch?v=kJQP7kiw5Fk` on your browser to view the JavaScript rendered output.

### Run with Docker

If you want to run with Docker, execute the following after you clone the repository:

```
cd puppeteer-js-renderer
docker-compose up
```

Then go to `http://localhost:8080/api/render?url=https://www.youtube.com/watch?v=kJQP7kiw5Fk` in your browser to see the output.

## How to use it as a service

If you want to use puppeteer-js-renderer for scraping, you can use the following URL on Fly.io:

```
https://js-renderer-fly.fly.dev/api/render?url=https://www.youtube.com/watch?v=kJQP7kiw5Fk
```

The YouTube URL is an example above, you can use any URL that needs javascript to be executed to be functional.

### Styles broken

Styles and images will look broken but the HTML tags will be there. Happy Web Scraping!

## How to deploy it on fly.io

[Fly.io](https://fly.io) is a platform for applications that need to run globally. It runs your code close to users and scales compute in cities where your app is busiest. Write your code, package it into a Docker image, deploy it to Fly's platform, and let that do all the work to keep your app snappy.

Fly.io has great [documentation](https://fly.io/docs/) to get started. You can find a quick speed run showing how to get your app running closer to your users with this [guide](https://fly.io/docs/speedrun/). 

Please follow these steps to deploy your own puppeteer-js-renderer service on Fly.io:

### Prerequisites

1. [Install](https://fly.io/docs/getting-started/installing-flyctl/) the flyctl CLI command.
1. Register on fly with `flyctl auth signup`, if you already have a fly account log in with `flyctl auth login`.

### Steps

1. Clone this repo with `git clone git@github.com:fly-examples/puppeteer-js-renderer.git` if you are logged in with SSH support enabled. Otherwise try `git clone https://github.com/fly-examples/puppeteer-js-renderer.git`.
1. Then run `cd puppeteer-js-renderer`.
1. After that execute `flyctl init --dockerfile` and when asked for an app name, hit return to have one generated (unless there's a name you really want). I ran it with js-renderer-fly as the app name for this example.
1. Subsequently, you can select an organization. Usually this will be your first name-last name on the prompt.
1. It should create a fly.toml file in the project root (I have not committed it, it is in .gitignore).
1. Now run `flyctl deploy` to deploy the app. It will build the docker image, push it to the fly docker image registry and deploy it. In the process of deploying it, it will display information about the number of instances and their health.
1. You can then run `flyctl info`. This will give the details of the app including hostname.
1. You can view your app in the browser with `flyctl open`. For me, it opened `https://js-renderer-fly.fly.dev` and displays `{message: "alive"}`.
1. Add `/api/render?url=https://www.youtube.com/watch?v=kJQP7kiw5Fk` on the address bar of your browser after your puppeteer-js-renderer URL. Mine looked like `https://js-renderer-fly.fly.dev/api/render?url=https://www.youtube.com/watch?v=kJQP7kiw5Fk`. This will render the final DOM of that YouTube page after the JavaScript is executed.
1. Enjoy!

The YouTube video URL is an example and it can, of course, be replaced with other web pages which need JavaScript to work.

## More fly commands

You can suspend your service with `flyctl suspend`; this will pause your service until you resume it. If you try `flyctl status` after suspending it will not show any instances running. Suspending the service means all resources allocated to run the service will be deallocated, resulting in the application running nowhere. To get the instances running again execute `flyctl resume`.

### Fly default resources

I wanted to see what resources were allocated to the App on Fly by default. The scale commands allowed me to find it out pretty easily like below:

1. `flyctl scale show` - showed me VM Size: micro-2x
1. `flyctl scale vm` - showed me micro-2x is a 0.25 CPU cores with 512 MB of memory.

If you want to increase CPU/memory or run more instances in a particular region please refer to the official Fly docs on [scaling](https://fly.io/docs/scaling/).

### Flying the app on 3 continents

Our service is running in one data center. For me, it's iad (Ashburn, Virginia) but yours will likely be different based on where you are working from. We can add instances around the world to speed up responses, let's get rolling:

1. To see the regions available run `flyctl platform regions`, I could see regions all over the world from Oregon to Sydney.
1. Let's add an instance to Australia in Sydney, to do this run `flyctl regions add syd`, yes it is that easy.
1. Now check `flyctl status` and you will see an instance running in Sydney
1. Let’s add one more in Europe in Amsterdam with `flyctl regions add ams`. So now we are mostly covered with the app running in 3 continents.
1. Of course, you can run `flyctl status` again to see your app shining on 3 continents.
