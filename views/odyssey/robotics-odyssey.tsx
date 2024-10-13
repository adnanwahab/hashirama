import React from 'react';
import Header from './Header';


function TwitchPlaysPokemonPanel(props) {
  const users = [
    { name: 'Mstrbojangl3s', vote: 'b' },
    { name: 'Kyddz', vote: 'anarchy' },
    { name: 'Bws41', vote: 'b' },
    { name: 'Faith', vote: 'anarchy' },
    { name: 'Touptar', vote: 'b' },
    { name: 'Sverioramoebe', vote: 'left' },
    { name: 'Harblngr', vote: 'democracy' },
    { name: 'Downwiththesi', vote: 'right' },
    { name: 'Towerunb', vote: 'up' },
    { name: 'Odrquy132', vote: 'democracy' },
    { name: 'Darkjesal', vote: 'r' },
    { name: 'Bluediegl', vote: 'democracy' },
    { name: 'Capo1dg', vote: 'r' },
    { name: 'Rushifiedba', vote: 'anarchy' },
    { name: 'Ulcyuubt', vote: 'r' },
    { name: 'B2badare', vote: 'democracy' },
    { name: 'Go3sauer', vote: 'r' },
  ];

  return (
    <div className="bg-gray-800 text-white p-4 font-mono text-sm bg-slate-900">
<script src="https://cdn.tailwindcss.com"></script>
<h2 className="text-xl font-bold mb-2">Twitch Plays Pokemon</h2>
      <p className="mb-4">6d 17h 46m 27s</p>
      <div className="flex mb-4">
        <div className="w-1/2 pr-2">
          <div className="bg-gray-700 h-4 rounded-full">
            <div className="bg-red-500 h-full rounded-full" style={{width: '70%'}}></div>
          </div>
          <p className="text-center">Anarchy</p>
        </div>
        <div className="w-1/2 pl-2">
          <div className="bg-gray-700 h-4 rounded-full">
            <div className="bg-blue-500 h-full rounded-full" style={{width: '30%'}}></div>
          </div>
          <p className="text-center">Democracy</p>
        </div>
      </div>
      <div className="space-y-1">
        {users.map((user, index) => (
          <div key={index} className="flex justify-between">
            <span className="truncate">{user.name}</span>
            <span>{user.vote}</span>
          </div>
        ))}
      </div>
    </div>
  );


}


function TeleGuidanceFrame(props) {
  let  src = props.link;
  if (typeof src === 'function') {
    console.log("returning twitch pane")
   return <TwitchPlaysPokemonPanel/>
  }
console.log("returning iframe", src)
 //src = "https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*"
  return (
    <iframe
      style={{ backgroundColor: 'white' }}
 
      className="h-80 object-cover object-left w-full"
      src={src}
    ></iframe>
  );
}

const observable_links = {
  voxels:
    "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",
  //"worrydream": "https://observablehq.com/embed/@roboticsuniversity/worrydream?cell=*",
  //"dynamicland.org": "https://observablehq.com/embed/@roboticsuniversity/dynamicland.org?cell=*",
  dynamicland: "https://observablehq.com/embed/@roboticsuniversity/dynamicland?cell=*",
  "livekit_subscriber": "https://observablehq.com/embed/@roboticsuniversity/livekit?cell=*",
  //"livekit_subscriber": "https://observablehq.com/embed/@roboticsuniversity/livekit-robotics-tele-guidance?cell=*",

  alan_how:"https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*",
  hardware: "https://observablehq.com/embed/@roboticsuniversity/robotics-hardware?cell=*",
  prediction:
    "https://observablehq.com/embed/@roboticsuniversity/3-planning-prediction?cell=*",
  infra:
    "https://observablehq.com/embed/@roboticsuniversity/infrastructure-notebook@13?cell=*",
  democracy:
    "https://observablehq.com/embed/@roboticsuniversity/collaborative-ui-twitch-plays-robot?cell=*",
  twitch: TwitchPlaysPokemonPanel,

  //twitch: "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",

  research:
    "https://observablehq.com/embed/@roboticsuniversity/5000-research-papers?cell=*",
  //semseg: "https://observablehq.com/embed/@roboticsuniversity/semantic-segmentation-robot?cell=*",
};






function RoboticsOdyssey() {
  return (
    <html className="dark">
      <Header />
      <body className="text-gray-950 antialiased bg-slate-900">
        <div className="overflow-hidden">
          <main>

            <TeleGuidance />

            {/* <ObservablePreview></ObservablePreview> */}

              <DynamicHow  />
        
                  <Footer />
          </main>
        </div>
      </body>
    </html>
  );
}




{/* <div className="2">
<iframe className="w-full h-1/2" src="http://localhost:3000"></iframe>
</div> */}

function Footer() {
  return (
    <footer
      style={{
        zIndex: 1,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.0), white 2em)',
      }}
      className=""
    >
      <div className="mv3 w-100 mw-max-width ph4-l ph3 center">
        <div className="w-100 center mt5 f7" style={{ marginBottom: '1.85em' }}>
          <div className="flex items-center-ns items-end justify-between pt3 bt b--silver">
            <div className="db inline-flex-ns items-center">
              <div className="inline-flex items-center">
                <a
                  style={{ lineHeight: 0 }}
                  title="Home"
                  className="observable-navy o-60 glow"
                  href="/web/20200411144627/https://observablehq.com/"
                >
                  <svg
                    role="img"
                    viewBox="0 0 25 28"
                    width="25"
                    height="28"
                    aria-label="Observable"
                    fill="currentColor"
                    style={{ height: '16px', width: '16px' }}
                  >
                    <path
                      d="M12.5 22.6667C11.3458 22.6667 10.3458 22.4153 9.5 21.9127C8.65721 21.412 7.98339 20.7027 7.55521 19.8654C7.09997 18.9942 6.76672 18.0729 6.56354 17.1239C6.34796 16.0947 6.24294 15.0483 6.25 14C6.25 13.1699 6.30417 12.3764 6.41354 11.6176C6.52188 10.8598 6.72292 10.0894 7.01563 9.30748C7.30833 8.52555 7.68542 7.84763 8.14479 7.27274C8.62304 6.68378 9.24141 6.20438 9.95208 5.87163C10.6979 5.51244 11.5458 5.33333 12.5 5.33333C13.6542 5.33333 14.6542 5.58467 15.5 6.08733C16.3428 6.588 17.0166 7.29733 17.4448 8.13459C17.8969 8.99644 18.2271 9.9103 18.4365 10.8761C18.6448 11.841 18.75 12.883 18.75 14C18.75 14.8301 18.6958 15.6236 18.5865 16.3824C18.4699 17.1702 18.2639 17.9446 17.9719 18.6925C17.6698 19.4744 17.2948 20.1524 16.8427 20.7273C16.3906 21.3021 15.7927 21.7692 15.0479 22.1284C14.3031 22.4876 13.4542 22.6667 12.5 22.6667ZM14.7063 16.2945C15.304 15.6944 15.6365 14.864 15.625 14C15.625 13.1073 15.326 12.3425 14.7292 11.7055C14.1313 11.0685 13.3885 10.75 12.5 10.75C11.6115 10.75 10.8688 11.0685 10.2708 11.7055C9.68532 12.3123 9.36198 13.1405 9.375 14C9.375 14.8927 9.67396 15.6575 10.2708 16.2945C10.8688 16.9315 11.6115 17.25 12.5 17.25C13.3885 17.25 14.124 16.9315 14.7063 16.2945C15.2886 15.6575 15.5875 14.8927 15.5875 14C15.5875 13.1073 15.2886 12.3425 14.7063 11.7055C14.1184 11.0685 13.3756 10.75 12.5 10.75C11.6244 10.75 10.8816 11.0685 10.2937 11.7055C9.70678 12.3425 9.40782 13.1073 9.40782 14C9.40782 14.8927 9.70678 15.6575 10.2937 16.2945C10.8816 16.9315 11.6244 17.25 12.5 17.25C13.3756 17.25 14.1184 16.9315 14.7063 16.2945ZM12.5 27C19.4031 27 25 21.1792 25 14C25 6.82075 19.4031 1 12.5 1C5.59687 1 0 6.82075 0 14C0 21.1792 5.59687 27 12.5 27Z"
                      fill="currentColor"
                    ></path>
                  </svg>
                </a>
                <a
                  href="https://web.archive.org/web/20200411144627/https://github.com/observablehq"
                  style={{ lineHeight: 0 }}
                  title="See our work on GitHub"
                  className="ml2 observable-navy o-60 glow"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    style={{ height: '16px', width: '16px' }}
                  >
                    <path
                      fill="currentColor"
                      d="M14.0609 4.65755C13.435 3.58505 12.5859 2.73595 11.5135 2.11005C10.4409 1.48413 9.26999 1.17125 7.99989 1.17125C6.72994 1.17125 5.55864 1.48423 4.4863 2.11005C3.4138 2.73591 2.56476 3.58505 1.9388 4.65755C1.31295 5.73002 1 6.90116 1 8.17095C1 9.69625 1.44501 11.0678 2.33526 12.2861C3.22542 13.5044 4.37536 14.3474 5.78501 14.8153C5.94909 14.8457 6.07056 14.8243 6.14954 14.7516C6.22855 14.6787 6.26801 14.5875 6.26801 14.4782C6.26801 14.46 6.26644 14.296 6.26341 13.9861C6.26028 13.6761 6.25881 13.4057 6.25881 13.175L6.04917 13.2113C5.91551 13.2358 5.74689 13.2461 5.54331 13.2432C5.33983 13.2404 5.1286 13.219 4.90989 13.1794C4.69109 13.1401 4.48757 13.0489 4.29919 12.9062C4.11091 12.7634 3.97725 12.5764 3.89823 12.3457L3.80709 12.136C3.74634 11.9963 3.6507 11.8412 3.52004 11.6712C3.38937 11.501 3.25724 11.3856 3.12358 11.3249L3.05977 11.2792C3.01724 11.2488 2.97779 11.2122 2.9413 11.1697C2.90484 11.1273 2.87755 11.0847 2.85932 11.0421C2.84106 10.9995 2.85619 10.9646 2.90487 10.9371C2.95356 10.9097 3.04154 10.8964 3.1692 10.8964L3.35142 10.9236C3.47295 10.948 3.62328 11.0208 3.80259 11.1424C3.98181 11.2639 4.12914 11.4218 4.2446 11.6162C4.38443 11.8654 4.55289 12.0552 4.75046 12.1859C4.94788 12.3166 5.14692 12.3818 5.3474 12.3818C5.54788 12.3818 5.72103 12.3666 5.86692 12.3364C6.01265 12.306 6.14938 12.2603 6.27704 12.1996C6.33173 11.7923 6.48062 11.4794 6.72359 11.2607C6.37728 11.2243 6.06593 11.1695 5.78938 11.0966C5.51299 11.0236 5.22737 10.9052 4.93271 10.741C4.6379 10.577 4.39334 10.3733 4.19895 10.1304C4.00454 9.88734 3.84499 9.56824 3.72052 9.17337C3.59598 8.77835 3.5337 8.32268 3.5337 7.80622C3.5337 7.07086 3.77377 6.4451 4.2538 5.92858C4.02893 5.37573 4.05016 4.75597 4.31755 4.06936C4.49377 4.01461 4.75509 4.05569 5.1014 4.19236C5.44777 4.32909 5.70137 4.44621 5.86245 4.54332C6.02354 4.6404 6.15261 4.72267 6.24984 4.78939C6.81505 4.63147 7.39832 4.55249 7.99982 4.55249C8.60133 4.55249 9.18473 4.63147 9.74996 4.78939L10.0963 4.57075C10.3331 4.42486 10.6128 4.29116 10.9347 4.16963C11.2567 4.04816 11.503 4.0147 11.6732 4.06945C11.9465 4.75609 11.9709 5.37582 11.7459 5.92867C12.2259 6.4452 12.4661 7.07112 12.4661 7.80632C12.4661 8.32277 12.4036 8.77989 12.2793 9.17794C12.1548 9.57606 11.9938 9.89485 11.7964 10.135C11.5988 10.3751 11.3526 10.5771 11.058 10.7411C10.7633 10.9052 10.4776 11.0236 10.2012 11.0966C9.92465 11.1695 9.6133 11.2244 9.26699 11.2608C9.58284 11.5342 9.7408 11.9656 9.7408 12.555V14.478C9.7408 14.5872 9.77879 14.6784 9.85483 14.7513C9.93078 14.8241 10.0507 14.8455 10.2148 14.815C11.6246 14.3472 12.7746 13.5041 13.6647 12.2858C14.5547 11.0676 14.9999 9.69599 14.9999 8.17069C14.9996 6.90106 14.6865 5.73002 14.0609 4.65755Z"
                    ></path>
                  </svg>
                </a>
                <a
                  href="https://web.archive.org/web/20200411144627/https://twitter.com/observablehq"
                  style={{ lineHeight: 0 }}
                  title="Follow us on Twitter"
                  className="ml2 observable-navy o-60 glow"
                >
                  <svg
                    viewBox="0 0 16 16"
                    width="16"
                    height="16"
                    fill="currentColor"
                    style={{ height: '16px', width: '16px' }}
                  >
                    <path d="M15 3.429c-.517.24-1.07.402-1.651.477a3.028 3.028 0 0 0 1.264-1.675 5.761 5.761 0 0 1-1.827.728 2.8 2.8 0 0 0-2.1-.959C9.1 2 7.812 3.355 7.812 5.025c0 .24.027.47.074.691-2.39-.119-4.509-1.327-5.926-3.153-.25.444-.39.96-.39 1.522 0 1.052.509 1.977 1.279 2.52a2.758 2.758 0 0 1-1.302-.379c.66 1.819 1.428 2.821 2.306 3.007a2.783 2.783 0 0 1-1.293.052c.37 1.202 1.43 2.078 2.691 2.102A5.588 5.588 0 0 1 1 12.641 7.886 7.886 0 0 0 5.417 14c5.291 0 8.181-4.611 8.181-8.604 0-.128 0-.258-.008-.387.374-.283.844-.81 1.41-1.58z"></path>
                  </svg>
                </a>
              </div>
              <div className="ml2-ns observable-navy o-60">© 2020 Observable, Inc.</div>
            </div>
            <div>
              <a
                className="ml2 no-underline observable-navy o-60 glow"
                href="/web/20200411144627/https://observablehq.com/about"
              >
                About
              </a>
              <a
                className="ml3-ns ml2 no-underline observable-navy o-60 glow"
                href="/web/20200411144627/https://observablehq.com/about#jobs"
              >
                Jobs
              </a>
              <a
                className="ml3-ns ml2 no-underline observable-navy o-60 glow"
                href="https://web.archive.org/web/20200411144627/mailto:hello@observablehq.com"
              >
                Contact
              </a>
              <a
                className="ml3-ns ml2 no-underline observable-navy o-60 glow"
                href="/web/20200411144627/https://observablehq.com/terms-of-service"
              >
                Terms
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}


const navigation = {
  solutions: [
    { name: 'Marketing', href: '#' },
    { name: 'Analytics', href: '#' },
    { name: 'Commerce', href: '#' },
    { name: 'Insights', href: '#' },
  ],
  support: [
    { name: 'Pricing', href: '#' },
    { name: 'Documentation', href: '#' },
    { name: 'Guides', href: '#' },
    { name: 'API Status', href: '#' },
  ],
  company: [
    { name: 'About', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Jobs', href: '#' },
    { name: 'Press', href: '#' },
    { name: 'Partners', href: '#' },
  ],
  legal: [
    { name: 'Claim', href: '#' },
    { name: 'Privacy', href: '#' },
    { name: 'Terms', href: '#' },
  ],
  social: [
    {
      name: 'Facebook',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'X',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path d="M13.6823 10.6218L20.2391 3H18.6854L12.9921 9.61788L8.44486 3H3.2002L10.0765 13.0074L3.2002 21H4.75404L10.7663 14.0113L15.5685 21H20.8131L13.6819 10.6218H13.6823ZM11.5541 13.0956L10.8574 12.0991L5.31391 4.16971H7.70053L12.1742 10.5689L12.8709 11.5655L18.6861 19.8835H16.2995L11.5541 13.096V13.0956Z" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      href: '#',
      icon: (props) => (
        <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
          <path
            fillRule="evenodd"
            d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ],
}

function Footer() {
  return (
    <footer aria-labelledby="footer-heading" className="bg-gray-900">
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="mx-auto max-w-7xl px-6 pb-8 pt-16 sm:pt-24 lg:px-8 lg:pt-32">
        <div className="mt-16 border-t border-white/10 pt-8 sm:mt-20 lg:mt-24 lg:flex lg:items-center lg:justify-between">
          <div>
            <h3 className="text-sm font-semibold leading-6 text-white">Subscribe to our newsletter</h3>
            <p className="mt-2 text-sm leading-6 text-gray-300">
              The latest news, articles, and resources, sent to your inbox weekly.
            </p>
          </div>
          <form className="mt-6 sm:flex sm:max-w-md lg:mt-0">
            <label htmlFor="email-address" className="sr-only">
              Email address
            </label>
            <input
              id="email-address"
              name="email-address"
              type="email"
              required
              placeholder="Enter your email"
              autoComplete="email"
              className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/5 px-3 py-1.5 text-base text-white shadow-sm ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:w-56 sm:text-sm sm:leading-6"
            />
            <div className="mt-4 sm:ml-4 sm:mt-0 sm:flex-shrink-0">
              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
        <div className="mt-8 border-t border-white/10 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {navigation.social.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-500 hover:text-gray-400">
                <span className="sr-only">{item.name}</span>
                <item.icon aria-hidden="true" className="h-6 w-6" />
              </a>
            ))}
          </div>
          <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; 2020 Your Company, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default RoboticsOdyssey;





function ObservablePreview() {
return (
  <div className="overflow-hidden">
    <div className="pb-24 px-6 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        <h2 className="max-w-3xl text-pretty text-4xl font-medium tracking-tighter text-gray-950 data-[dark]:text-white sm:text-6xl">
          A snapshot of your entire sales pipeline.
        </h2>
        <div
          style={{ "--width": 1216, "--height": 768 }}
          className="mt-16 h-[36rem] sm:h-auto sm:w-[76rem] relative aspect-[var(--width)/var(--height)] [--radius:theme(borderRadius.xl)]"
        >
          <div className="absolute -inset-[var(--padding)] rounded-[calc(var(--radius)+var(--padding))] shadow-sm ring-1 ring-black/5 [--padding:theme(spacing.2)]"></div>
          <img
            alt=""
            src="https://radiant.tailwindui.com/screenshots/app.png"
            className="h-full rounded-[var(--radius)] shadow-2xl ring-1 ring-black/10"
          />
        </div>
      </div>
    </div>
  </div>
);

}


function TeleGuidance() {
  const list_of_links = [
    "livekit_subscriber",
    TwitchPlaysPokemonPanel,
    "https://observablehq.com/embed/@roboticsuniversity/robotics-hardware?cell=*",
    "https://observablehq.com/embed/@roboticsuniversity/voxels-diffusion-policy-3d?cell=*",
    
  ]
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        {/* <h2 className="text-base font-semibold text-indigo-400">Deploy faster</h2> */}
        <p className="mt-2 max-w-lg text-4xl font-medium tracking-tight text-white sm:text-5xl">
          {/* Everything you need to deploy your app. */}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="lg:col-span-4 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
              <TeleGuidanceFrame link={list_of_links[0]}/>
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Releases</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Push to deploy</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. In gravida justo et nulla efficitur, maximus
                egestas sem pellentesque.
              </p>
            </div> */}
          </div>
          <div className="lg:col-span-2 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
              <TeleGuidanceFrame link={list_of_links[1]}/>
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Integrations</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Connect your favorite tools</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Curabitur auctor, ex quis auctor venenatis, eros arcu rhoncus massa.
              </p>
            </div> */}
          </div>
          <div className="lg:col-span-2 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
              <TeleGuidanceFrame link={list_of_links[3]}/>
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Security</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Advanced access control</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.
              </p>
            </div> */}
          </div>
          <div className="lg:col-span-4 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
              <TeleGuidanceFrame link={list_of_links[4]}/>
            </div>
            {/* <div className="p-10">
              <h3 className="text-sm font-semibold text-gray-400">Performance</h3>
              <p className="mt-2 text-lg font-medium tracking-tight text-white">Lightning-fast builds</p>
              <p className="mt-2 max-w-lg text-sm text-gray-400">
                Sed congue eros non finibus molestie. Vestibulum euismod augue vel commodo vulputate. Maecenas at
                augue sed elit dictum vulputate.
              </p>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}




function _({list_of_links}) {
  return (
    <div className="bg-gray-900 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
        {/* <h2 className="text-base font-semibold text-indigo-400">Deploy faster</h2> */}
        <p className="mt-2 max-w-lg text-4xl font-medium tracking-tight text-white sm:text-5xl">
          {/* Everything you need to deploy your app. */}
        </p>
        <div className="mt-10 grid grid-cols-1 gap-4 sm:mt-16 lg:grid-cols-6 lg:grid-rows-2">
          <div className="lg:col-span-6 flex flex-col rounded-lg bg-gray-800 overflow-hidden">
            <div className="flex-grow">
              <TeleGuidanceFrame link={list_of_links[0]}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DynamicHow() {
  const second_bento = [
    'https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*',
    'https://observablehq.com/embed/@roboticsuniversity/alan-how?cell=*',
  ]
  
    return (
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
  
          <div className="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] lg:rounded-l-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
               
                </div>
                <div className="relative min-h-[30rem] w-full grow [container-type:inline-size] max-lg:mx-auto max-lg:max-w-sm">
                  <div className="absolute inset-x-10 bottom-0 top-10 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 shadow-2xl">
                  <TeleGuidanceFrame link={second_bento[0]}/>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 lg:rounded-l-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-1">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-t-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]">

                <div className="flex flex-1 items-center justify-center px-8 max-lg:pb-12 max-lg:pt-10 sm:px-10 lg:pb-2">
                <TeleGuidanceFrame link={second_bento[1]}/>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-t-[2rem]"></div>
            </div>
            <div className="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <div className="absolute inset-px rounded-lg bg-white"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)]">
                <div className="px-8 pt-8 sm:px-10 sm:pt-10">
      
                </div>
                <div className="flex flex-1 items-center [container-type:inline-size] max-lg:py-6 lg:pb-2">
                <TeleGuidanceFrame link={second_bento[0]}/>

                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5"></div>
            </div>
            <div className="relative lg:row-span-2">
              <div className="absolute inset-px rounded-lg bg-white max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
              <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(theme(borderRadius.lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <div className="px-8 pb-3 pt-8 sm:px-10 sm:pb-0 sm:pt-10">
     
           
                </div>
                <div className="relative min-h-[30rem] w-full grow">
                  <div className="absolute bottom-0 left-10 right-0 top-10 overflow-hidden rounded-tl-xl bg-gray-900 shadow-2xl">
                    <div className="flex bg-gray-800/40 ring-1 ring-white/5">
                      <div className="-mb-px flex text-sm font-medium leading-6 text-gray-400">
                   
                      </div>
                    </div>
                    <div className="px-6 pb-14 pt-6">{/* Your code example */}</div>
                  </div>
                </div>
              </div>
              <div className="pointer-events-none absolute inset-px rounded-lg shadow ring-1 ring-black/5 max-lg:rounded-b-[2rem] lg:rounded-r-[2rem]"></div>
            </div>
          </div>
        </div>
      </div>
    )

}