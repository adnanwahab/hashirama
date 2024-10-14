// // Window 1

// https://shop.raise3d.com/checkouts/cn/Z2NwLXVzLWNlbnRyYWwxOjAxSkE0Q0VONlM1Ujc1TU1HUTlUM0dQUjFF/payment
// https://observablehq.com/framework/
// https://observablehq.com/settings
// https://observablehq.com/documentation/data/databases/overview
// https://observablehq.com/@jwolondon/what-is-your-four-digit-pin
// https://observablehq.com/@mbostock





// https://github.com/observablehq/framework/tree/main/examples/api/src/data
// https://github.com/observablehq/framework/blob/main/examples/plot/src/index.md
// https://github.com/adnanwahab/framework/tree/main/examples/plot
// http://localhost:3000/#analyzing-web-logs
// https://observablehq.com/@roboticsuniversity/agent-dashboard
// https://www.linkedin.com/in/raffaello-bonghi/
// https://www.linkedin.com/in/robotics-university/
// https://zed.dev/docs/
// https://observablehq.com/@christophe-yamahata/industrial-robot-irb-120
// chrome://history/
// https://chromewebstore.google.com/detail/list-all-tabs/iklkoalaepbjckknpnklbipmplnipcid?hl=en
// https://chromewebstore.google.com/detail/tab-copy/micdllihgoppmejpecmkilggmaagfdmb

// Window 2

// https://reflect.app/g/awahab/93832131a5134678aa1205c020c82d86
// https://chatgpt.com/c/670c079e-356c-8013-b7d2-1e86009f9c05
// https://tailwindcss.com/docs/installation
// http://localhost:8080/




// // See https://observablehq.com/framework/config for documentation.
// export default {
//   // The app’s title; used in the sidebar and webpage titles.
//   title: "Robotics-Odyssey",

//   // The pages and sections in the sidebar. If you don’t specify this option,
//   // all pages will be listed in alphabetical order. Listing pages explicitly
//   // lets you organize them into sections and have unlisted pages.
//   // pages: [
//   //   {
//   //     name: "Perception",
//   //     pages: [
//   //       {name: "Dashboard", path: "/example-dashboard"},
//   //       {name: "Report", path: "/example-report"}
//   //     ]
//   //   }
//   // ],

//   // Content to add to the head of the page, e.g. for a favicon:
//   head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

//   // The path to the source root.
//   root: "src",

//   // Some additional configuration options and their defaults:
//   theme: "ocean-floor", // try "light", "dark", "slate", etc.
//   //header: "make cube of worrydream for all things", // what to show in the header (HTML)
//   footer: "(DynamicLand.org+SICP+Zoox+Seinfeld)**2=Zootopia = Golden Chocobo", // what to show in the footer (HTML)
//   sidebar: true, // whether to show the sidebar
//   // toc: true, // whether to show the table of contents
//   // pager: true, // whether to show previous & next links in the footer
//   // output: "dist", // path to the output root for build
//   search: true, // activate search
//   linkify: true, // convert URLs in Markdown to links
//   globalStyleSheets: [],
//   // typographer: false, // smart quotes and other typographic improvements
//   // cleanUrls: true, // drop .html from URLs
// };


// See https://observablehq.com/framework/config for documentation.
export default {
  // The app’s title; used in the sidebar and webpage titles.
  title: "Robotics-Odyssey",

  // The pages and sections in the sidebar. If you don’t specify this option,
  // all pages will be listed in alphabetical order. Listing pages explicitly
  // lets you organize them into sections and have unlisted pages.

  //   pages: [
    // {name: "Getting ever more awesome", path: "/getting-awesome"},
    // {name: "Being totally awesome", path: "/being-awesome"},
    // {name: "Staying as awesome as ever", path: "/staying-awesome"}
  // ]

  //   // pages: [
  //   {
  //     name: "Perception",
  //     pages: [
  //       {name: "Dashboard", path: "/example-dashboard"},
  //       {name: "Report", path: "/example-report"}
  //     ]
  //   }
  // ],
  pages: [
        {
          "name": "Perception",
          "pages": [
            "1. Machine Perception",
            "YOLO V5 Object detection",
            "depth perception",
            "feature extraction",
            "object tracking",
            "sensor fusion",
            "SLAM (Simultaneous Localization and Mapping)",
            "optical flow",
            "image segmentation",
            "pose estimation",
            "event-based sensing",
            "2. Computer Vision",
            "image classification",
            "semantic segmentation",
            "camera calibration",
            "perspective transformation",
            "stereo vision",
            "optical character recognition (OCR)",
            "gesture recognition",
            "3D reconstruction",
            "image augmentation",
            "GANs (Generative Adversarial Networks)",
            "3. Radar",
            "Doppler effect for motion detection",
            "frequency modulation continuous wave (FMCW)",
            "SAR (Synthetic Aperture Radar)",
            "range-Doppler imaging",
            "micro-Doppler signatures",
            "radar cross-section (RCS)",
            "polarization in radar",
            "MIMO radar (Multiple Input Multiple Output)",
            "clutter filtering",
            "target detection and tracking",
            "4. LiDAR",
            "point cloud generation",
            "point cloud registration",
            "object detection in LiDAR",
            "SLAM for LiDAR",
            "terrain mapping",
            "range accuracy and calibration",
            "beam divergence and resolution",
            "3D segmentation",
            "LiDAR-camera sensor fusion",
            "dynamic obstacle detection"
          ]
        },
        {
          "name": "Planning + Prediction",
          "pages": [
            "Path planning algorithms (A*, D*, RRT)",
            "Trajectory optimization",
            "Task and motion planning (TAMP)",
            "Model predictive control (MPC)",
            "Multi-robot coordination and planning",
            "Human motion prediction",
            "Collision prediction and avoidance",
            "Future state estimation in dynamic environments",
            "Behavior prediction using reinforcement learning",
            "Sensor-based uncertainty modeling"
          ]
        },

        {
          "name": "Hardware Design + Repair",
          "pages": [
            "1. Mechanical Engineering for Robotics",
            "Kinematics and Dynamics – Modeling and analyzing robot motion",
            "Mechanisms Design – Gears, pulleys, and linkages for optimal motion",
            "Actuator Selection – Types of motors (servo, stepper, brushless DC)",
            "Structural Analysis – Stress, strain, and fatigue of robotic components",
            "Robotic Manipulators – Design of arms and end-effectors",
            "Design for Weight Optimization – Light but strong materials",
            "Vibration Control – Damping techniques to avoid instability",
            "Compliant Mechanisms – Flexible components to mimic biological movement",
            "Control Systems – PID controllers, torque control, and stability analysis",
            "Gripper and Claw Design – Design of robotic hands for various tasks",
            "2. Electrical Engineering for Robotics",
            "Power Systems – Battery selection and power management",
            "Motor Drivers and Controllers – PWM controllers, H-bridges, ESCs",
            "Sensor Integration – IMUs, LiDAR, cameras, and encoders",
            "Embedded Systems – Microcontrollers like Arduino, STM32, and Jetson Nano",
            "Circuit Design and PCB Layout – Custom circuits for robot control",
            "Communication Protocols – UART, SPI, I2C, and CAN for robot coordination",
            "Signal Processing – Filtering and processing sensor data",
            "Electromagnetic Interference (EMI) Control – Shielding techniques",
            "Energy Harvesting for Robots – Solar and regenerative braking systems",
            "Low-Power Electronics Design – Maximizing battery life for autonomous robots",
            "3. Hardware Repair for Robotics",
            "Fault Diagnosis and Troubleshooting – Identifying component failures",
            "Soldering and Reworking PCB Components – Replacing damaged components",
            "Motor and Actuator Repair – Servicing stepper, servo, and brushless motors",
            "Sensor Calibration and Replacement – Aligning and configuring sensors",
            "Battery Testing and Replacement – Extending lifespan and efficiency",
            "Cable Management and Wire Repair – Preventing short circuits and wear",
            "Firmware Reinstallation – Restoring corrupted robot control software",
            "Bearing and Gear Replacement – Ensuring smooth movement and operation",
            "Structural Repairs – Fixing cracks and breaks in robot frames",
            "Cleaning and Preventative Maintenance – Reducing downtime",
            "4. Hardware Design for Robotics",
            "3D Modeling and CAD for Robots – Using SolidWorks, Fusion 360, etc.",
            "Design for Manufacturability (DFM) – Optimizing for production",
            "Prototyping Methods – 3D printing, CNC machining, and laser cutting",
            "Material Selection – Lightweight metals, composites, and plastics",
            "Custom PCB Design – Creating control boards for specific needs",
            "Design for Modularity – Building robots that can easily be expanded",
            "Thermal Management – Heat sinks, cooling fans, and thermal paste",
            "Ergonomic Design – Enhancing usability for human-robot interaction",
            "Design for Safety and Compliance – Ensuring product meets regulations",
            "Environmental Durability – Waterproof and dustproof design principles",
            "Hardware Construction for Robotics (Construction-Worker Friendly)",
            "Bill of Materials (BoM) Management – Creating accurate parts lists",
            "IKEA-style Assembly Instructions – Clear step-by-step guides with visuals",
            "Modular Kits for Robot Construction – Pre-built modules to snap together",
            "Tools and Techniques – Use of common tools like Allen keys and screwdrivers",
            "Color-coded Wiring and Connections – Simplifying electrical assembly",
            "Pre-configured Motor and Servo Units – Plug-and-play actuators",
            "Nanosauri-style Visual Assistants – AR tools for guided assembly",
            "Error-proofing Construction – Easy alignment with interlocking parts",
            "Quick Connectors for Electronics – No soldering needed",
            "Testing Procedures during Construction – Ensuring components work at every step"
          ]
        },
        {
          "name": "Simulation + UI + Real World Applications",
          "pages": [
            "1. Simulation",
            "Physics-based simulation – Modeling dynamics with realistic physics (e.g., gravity, friction).",
            "Robot kinematics and dynamics simulation – Testing manipulator movement and trajectories.",
            "Gazebo, MuJoCo, and PyBullet simulation tools – Popular platforms for robotics simulation.",
            "Multi-robot simulation – Simulating swarms or collaborative robotic systems.",
            "Digital twins for robotics – Creating virtual replicas of real-world robots for testing.",
            "ROS (Robot Operating System) integration with simulators – Bridging simulation with real robot control.",
            "Environment modeling and mapping – Generating realistic environments (indoor/outdoor).",
            "Sensor simulation – Emulating LiDAR, cameras, IMUs, and radar data streams.",
            "Simulation for SLAM (Simultaneous Localization and Mapping) – Testing algorithms in virtual environments.",
            "Reinforcement learning in simulation – Training robots with simulated data before real-world deployment.",
            "2. UI",
            "Teleoperation Interfaces – UI for remote robot control (e.g., joysticks, dashboards).",
            "Robot Status Dashboards – Real-time visualizations of robot metrics (e.g., battery, temperature, speed).",
            "Human-Robot Interaction (HRI) – Designing intuitive interfaces for effective collaboration between humans and robots.",
            "Augmented Reality (AR) Interfaces – Overlaying robot data on real-world views for better control.",
            "Gesture-Based Interfaces – Using gestures to communicate commands to robots (e.g., Microsoft Kinect).",
            "Voice User Interfaces (VUI) – Natural language interaction with robots through voice commands.",
            "Touchscreen Interfaces – Tablet or mobile-friendly UIs for simple robot operations and monitoring.",
            "Robot Behavior Visualization – Animating planned paths, predicted movements, and obstacle detection.",
            "Interactive Simulation Interfaces – Allowing users to test robots virtually before real-world deployment.",
            "Robot Learning and Programming UI – Visual programming tools or simplified UIs for non-experts to train or configure robots (e.g., Blockly, ROS RViz).",
            "3. Real World Applications",
            "Feeding stray cats using robots",
            "house building using robots",
            "gardeninng",
            "Medical and Surgical Robotics – Assisting in surgeries, rehabilitation, and diagnostics.",
            "Industrial Automation – Robots in manufacturing and assembly lines (e.g., robotic arms).",
            "Agricultural Robotics – Precision farming with drones and automated harvesters.",
            "Warehouse and Logistics Automation – Sorting, packaging, and warehouse management robots.",
            "Service Robots – Robots for cleaning, security, and hospitality (e.g., vacuum cleaners, hotel assistants).",
            "Swarm Robotics – Coordinated robots working together for tasks like search-and-rescue.",
            "Humanoid Robots – Robots mimicking human interaction for customer service or research.",
            "Social Robots – Companion robots used for elder care, mental health, or education.",
            "Construction Robotics – Robots for bricklaying, 3D printing structures, and infrastructure inspection.",
            "Robots in Space Exploration – Rovers, robotic arms, and probes for extraterrestrial missions.",
            "Defense and Military Robotics – Drones, autonomous weapons, and robotic exoskeletons.",
            "Underwater Robotics – Submersibles for deep-sea exploration and pipeline inspection.",
            "Entertainment Robotics – Theme park animatronics, toys, and gaming robots.",
            "Retail Robotics – Robots for customer assistance and shelf-stocking in stores.",
            "Disaster Response Robots – Robots for firefighting, hazardous material handling, and search-and-rescue operations.",
            "Personal Assistants and Domestic Robots – Robots that assist with daily tasks at home.",
            "Robots for Education and Research – Teaching programming, STEM education, and experimental platforms.",
            "Robotics in Mining – Autonomous vehicles and robotic arms for mineral extraction.",
            "Environmental Monitoring and Conservation – Robots for wildlife tracking, environmental sensing, and pollution control.",
            "Robotic Surgery – Minimally invasive robotic assistance in medical procedures.",
            "Warehouse Automation – Robotic systems for efficient order fulfillment.",
            "Construction Robotics – Robots for building and infrastructure tasks.",
            "Agricultural Robotics – Robots for crop planting, harvesting, and pest control.",
            "Petroleum and Mining Robotics – Robots for oil drilling, mining, and exploration.",
            "Space Exploration Robotics – Robots for planetary rovers and space station operations.",
            "Disaster Response Robotics – Robots for search and rescue missions after natural disasters."
          ]
        }
  ],

  // Content to add to the head of the page, e.g. for a favicon:
  head: '<link rel="icon" href="observable.png" type="image/png" sizes="32x32">',

  // The path to the source root.
  root: "src",

  // Some additional configuration options and their defaults:
  theme: "ocean-floor", // try "light", "dark", "slate", etc.
  //header: "make cube of worrydream for all things", // what to show in the header (HTML)
  footer: "(DynamicLand.org+SICP+Zoox+Seinfeld)**2=Zootopia = Golden Chocobo", // what to show in the footer (HTML)
  sidebar: true, // whether to show the sidebar
  // toc: true, // whether to show the table of contents
  // pager: true, // whether to show previous & next links in the footer
  // output: "dist", // path to the output root for build
  search: true, // activate search
  linkify: true, // convert URLs in Markdown to links
  globalStyleSheets: [],
  // typographer: false, // smart quotes and other typographic improvements
  // cleanUrls: true, // drop .html from URLs
};
