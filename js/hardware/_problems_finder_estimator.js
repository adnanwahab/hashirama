const fs = require('fs');
const { chromium } = require('playwright');

const blockers_of_robotics_companies = [
    '1. High Cost of Hardware Components',
    '2. Lack of Standardization',
    '3. Battery Life and Power Efficiency', 
    '4. Precision and Repeatability in Harsh Environments',
    '6. Manufacturing and Scalability Issues',
    '8. Perception and Real-Time Processing',
    '9. Robot Autonomy and Decision-Making',
    '10.Revenue Creation for Robotics Companies',
    ]


    const convo = `
    
    1. Advanced Construction Robotics
Current Limitation: Construction robots today focus primarily on tasks like bricklaying, concrete printing, and demolition. However, the complexity required for futuristic buildings would involve dynamic, adaptive construction techniques, large-scale 3D printing, and autonomous building systems capable of working with various materials.

What’s Needed:

Modular, Adaptive Construction Systems: Robots capable of self-organizing and constructing complex, large-scale structures (similar to an arcology) in varied environments.
Multi-Material 3D Printing: Robots that can print with a wide variety of materials, including metals, plastics, and smart materials that react to environmental changes.
Autonomous Site Management: Integration of drones, ground robots, and AI for overseeing construction, monitoring site safety, and optimizing resource use.
Key Players to Expand: ICON (3D printing construction), Boston Dynamics (robotic mobility), and startups in construction automation.

2. Human-Robot Interaction (HRI) and Social Robots
Current Limitation: In futuristic environments like DynamicLand, robots would need to seamlessly interact with humans, not just as tools but as part of the social fabric. Today, HRI is still in its infancy, with robots limited to basic tasks in controlled environments.

What’s Needed:

Intuitive, Natural Interfaces: Robots capable of interacting with people through natural language, gestures, and real-time environmental understanding.
Collaborative Robots (Cobots): Robots that can work side by side with humans in shared environments, participating in creative and interactive processes.
Augmented Reality Integration: Combining robots with augmented reality to create interactive spaces like DynamicLand, where robots can respond to gestures and objects in the room as if part of a "living" environment.
Key Players to Expand: SoftBank Robotics (social robots), NVIDIA Isaac (AI-driven interaction), Google DeepMind (HRI research).

3. Modular, Smart Materials and Fabrication Robotics
Current Limitation: Current robots focus on rigid, predefined tasks with fixed materials. Futuristic buildings like arcologies require smart materials that change form, optimize energy, and adapt to environments, along with robots capable of working with them.

What’s Needed:

Robots for Fabricating Smart Materials: Robots that can work with self-healing materials, temperature-adaptive materials, and energy-optimized construction elements.
Dynamic, Flexible Manufacturing Systems: Manufacturing processes that are adaptable to evolving architectural designs and responsive to changes in the building’s usage or environmental conditions.
Key Players to Expand: ROBOTIS (modular robotic components), Universal Robots (cobots), and research into 4D printing (materials that evolve over time).

4. Autonomous and Sustainable Power Systems
Current Limitation: Futuristic buildings would rely on sustainable, decentralized energy systems. Current robotic power systems and energy management often depend on centralized grids and limited battery life.

What’s Needed:

Energy-Harvesting Robots: Robots that can collect and store renewable energy (solar, wind, kinetic) on-site and distribute it autonomously across the building.
Autonomous Power Grid Management: A system of robots capable of managing power flow within the building, optimizing for sustainability and efficiency.
Key Players to Expand: Tesla (energy storage systems), Boston Dynamics (mobile robots for monitoring), Siemens (industrial automation and smart grids).

5. Smart Infrastructure and Environmental Monitoring Robots
Current Limitation: Monitoring and maintaining a large, complex structure like an arcology requires continuous oversight of environmental conditions, building integrity, and energy usage. Current solutions are manual and fragmented.

What’s Needed:

Swarm Robotics: Networks of small robots that continuously monitor environmental conditions (air quality, temperature, structural integrity) within the building and autonomously make adjustments.
Self-Maintaining Infrastructure: Robots that can autonomously detect and repair faults (leaks, cracks, electrical issues) in a building before they become major problems.
Data-Driven Building Automation: AI-driven systems that use data from sensors and robots to manage the day-to-day operations of the building, from climate control to water management.
Key Players to Expand: Clearpath Robotics (mobile inspection robots), Siemens (building automation), Bosch (sensor technology).


    `

    
const annotations_of_hardware_blocker_problems = [
    {
        "CoreComponentsManufacturers": {
          "KeyTypesOfProducts": [
            "Motors and Actuators: Servo motors, stepper motors, and actuators for robot movement.",
            "Sensors: Vision sensors (cameras, LiDAR, radar), proximity sensors, force sensors, and IMUs.",
            "Power Systems: Battery packs, voltage regulators, and energy-efficient power modules."
          ],
          "NotableCompanies": [
            "ROBOTIS (Dynamixel actuators)",
            "Maxon Motors (precision DC motors)",
            "Intel RealSense (3D depth cameras)",
            "Velodyne (LiDAR systems)"
          ]
        }
      },
      {
        "IndustrialRobotics": {
          "KeyTypesOfProducts": [
            "Articulated Robots: Used for tasks like welding, painting, and material handling.",
            "SCARA Robots: Compact robots for fast, precise assembly.",
            "Delta Robots: High-speed robots used in pick-and-place tasks.",
            "Collaborative Robots (Cobots): Designed to work alongside humans in industrial environments."
          ],
          "NotableCompanies": [
            "Fanuc (industrial robots)",
            "KUKA (automation systems)",
            "ABB Robotics (robotic arms for factories)",
            "Universal Robots (cobots)"
          ]
        }
      },
      {
        "MobileAndAutonomousRobotics": {
          "KeyTypesOfProducts": [
            "Autonomous Mobile Robots (AMRs): Used in logistics and warehousing for material transportation.",
            "Unmanned Aerial Vehicles (UAVs): Drones for surveying, mapping, and delivery.",
            "Autonomous Ground Vehicles (AGVs): Used in agriculture, mining, and autonomous delivery."
          ],
          "NotableCompanies": [
            "Boston Dynamics (mobile and legged robots like Spot)",
            "DJI (drone manufacturing)",
            "Clearpath Robotics (autonomous ground vehicles)",
            "Zoox (self-driving vehicles)"
          ]
        }
      },
      {
        "HealthcareAndSurgicalRobotics": {
          "KeyTypesOfProducts": [
            "Surgical Robots: Precision robots that assist surgeons in minimally invasive procedures.",
            "Rehabilitation Robots: Robots used in physical therapy and rehabilitation of patients.",
            "Robotic Prosthetics: Advanced prosthetic devices controlled by neural or muscular signals."
          ],
          "NotableCompanies": [
            "Intuitive Surgical (da Vinci Surgical System)",
            "Medtronic (surgical robotics and navigation systems)",
            "Ekso Bionics (exoskeletons for rehabilitation)"
          ]
        }
      },
      {
        "ServiceAndConsumerRobotics": {
          "KeyTypesOfProducts": [
            "Domestic Robots: Cleaning robots (e.g., vacuum cleaners), lawn mowing robots, and kitchen robots.",
            "Social Robots: Personal assistants and companion robots that interact with humans.",
            "Robots for Hospitality: Customer service robots used in hotels, restaurants, and stores."
          ],
          "NotableCompanies": [
            "iRobot (Roomba robotic vacuum)",
            "SoftBank Robotics (Pepper, a humanoid robot for customer interaction)",
            "Anki (consumer robotics, now defunct but known for Cozmo and Vector robots)"
          ]
        }
      },
      {
        "AgriculturalRobotics": {
          "KeyTypesOfProducts": [
            "Harvesting Robots: Robots that pick fruits, vegetables, and other crops.",
            "Soil and Crop Monitoring Robots: Robots equipped with sensors to monitor soil health and plant conditions.",
            "Planting and Weeding Robots: Automating the planting and maintenance of crops."
          ],
          "NotableCompanies": [
            "John Deere (autonomous tractors and agricultural robots)",
            "Blue River Technology (precision agriculture with AI)",
            "Iron Ox (fully autonomous farming)"
          ]
        }
      }, 

      {
        "ResearchAndEducationRobotics": {
          "KeyTypesOfProducts": [
            "Educational Robot Kits: Kits aimed at teaching students the fundamentals of robotics and programming.",
            "Research Platforms: Robots designed for advanced academic and industry research, often customizable.",
            "Development Tools: Software and hardware development platforms for designing and testing robots."
          ],
          "NotableCompanies": [
            "LEGO Education (LEGO Mindstorms robotics kits)",
            "ROBOTIS (robotics kits for research and education)",
            "Universal Robots (open-source robotics research platforms)"
          ]
        }
      }
]

// solve pipeproblems for all these companies 

//find inptus outputs + depenegraphy - tsort

    export default blockers_of_robotics_companies;