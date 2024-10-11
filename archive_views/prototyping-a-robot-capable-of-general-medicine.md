Mini Percpetion Pipeline for homelab / Hobbyist robotics

The ZED camera is fairly easy to use and has stereoscopic depth perception

In real Life, an autonomous robot can genreate about 1 tb a second.

We will only


# Prototyping a robot capable of general medicine in honor of Florence Nightingale

Florence Nightingale was one of the most powerful archetypes to ever walk the earth.

Florence Nightingale was not merely a nurse; she was the architect of modern healthcare.
Born into wealth, she could have lived a life of comfort, but she chose the battlefield over ballrooms, the wounded over the wealthy.
In the filth of the Crimean War, she became the "Lady with the Lamp," bringing light to the darkest corners of human suffering.

But she was more than a compassionate caregiver; she was a strategist.

Nightingale revolutionized hospital care, implementing hygiene practices that cut death
rates from 42% to 2%.

She wasn't just treating patients;

she was waging war on ignorance and inefficiency.

With her meticulous data collection and statistical analysis, she convinced governments to reform military hospitals, a feat that saved countless lives.

She didn't just change nursing; she changed the course of history.

Her work laid the foundation for public health systems worldwide, proving that the power of one determined individual could outshine even the brightest of empires.

Florence Nightingale was a force of nature, a woman who transformed her compassion into a weapon against death and disease.

She didn't inherit a kingdom; she built one—brick by brick, statistic by statistic, saving lives that would have otherwise been lost to neglect.

She wasn't just a nurse; she was a commander in the war for human dignity, and her legacy endures in every hospital ward and every life saved by modern medicine.

https://github.com/AlexanderKoch-Koch/low_cost_robot

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/6/68/Florence_Nightingale_by_Augustus_Egg.jpg/1280px-Florence_Nightingale_by_Augustus_Egg.jpg)

How affordable can we make a robotic surgeon? I think for only $1000.

In 5 years, we should be able to perform surgery autonomously with house hold materials.

![Image](https://github.com/jess-moss/koch-v1-1/raw/main/pictures/Follower_And_Leader_Arm.jpg)
![Image](https://github.com/AlexanderKoch-Koch/low_cost_robot/raw/main/pictures/robot_portait.jpg)

![Image](https://static.wikia.nocookie.net/deusex/images/f/f3/Medical_Bot.png/revision/latest?cb=20150112210255&path-prefix=en)
![Image](https://static.wikia.nocookie.net/deusex/images/7/74/MedicalBot.png/revision/latest?cb=20110104225314&path-prefix=eng)

Don't belive me? Well here's proof

Working Title : Matsu-Gravas GV-4 Nightingale medical bot

Top Level Components

1. Roomba Create 3 for locomotion - cost $350 (Can also use a wheel chair and an arduino)
2. NVIDIA Jetson Nano or Ideally Jetson Orin - $150-500
3.

Bill of materials for Arm

| Part                                                                  | Amount | Unit Cost (US) | Buy US                                                                                              | Unit Cost (EU) | Buy EU                                                                                                                                                                                                           | Unit Cost (UK) | Buy UK                                                                                                   |
| --------------------------------------------------------------------- | ------ | -------------- | --------------------------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | -------------------------------------------------------------------------------------------------------- |
| Dynamixel XL430-W250-T                                                | 2      | $50            | [Robotis](https://www.robotis.us/dynamixel-xl430-w250-t)                                            | 57-61€         | [MyBotShop](https://www.mybotshop.de/DYNAMIXEL-XL430-W250-T)-[GenRobots](https://www.generationrobots.com/en/402823-dynamixel-xl430-w250-t-servomotor.html)                                                      | £47            | [RoboSavvy](https://robosavvy.co.uk/dynamixel-xl430-w250-t.html)                                         |
| Dynamixel XL330-M288-T                                                | 4      | $24            | [Robotis](https://www.robotis.us/dynamixel-xl330-m288-t)                                            | 40-46€         | [MyBotShop](https://www.mybotshop.de/DYNAMIXEL-XL330-M288-T)-[GenRobots](https://www.generationrobots.com/en/403817-dynamixel-xl330-m288-t-servo-motor.html)                                                     | £27            | [RoboSavvy](https://robosavvy.co.uk/robotis-dynamixel-xl330-m288-t.html)                                 |
| XL330 Frame and Idler Wheel 4pcs set<sup>[1](#myfootnote1)</sup>      | 1      | $10            | [Robotis](https://www.robotis.us/fpx330-h101-4pcs-set)                                              | 12€            | [GenRobots](https://www.generationrobots.com/en/403860-FPX330-H101-hinge-frame-and-idler-set-dynamixel-xl330.html)                                                                                               | £10            | [RoboSavvy](https://robosavvy.co.uk/fpx330-h101-4pcs-set.html)                                           |
| XL430 Idler Wheel set                                                 | 1      | $7             | [Robotis](https://www.robotis.us/hn11-i101-set)                                                     | 9€             | [GenRobots](https://www.generationrobots.com/en/403206-hn11-i101-horn-set.html)                                                                                                                                  | £7             | [Robosavvy](https://robosavvy.co.uk/hn11-i101-set.html)                                                  |
| Waveshare Serial Bus Servo Driver Board                               | 1      | $10            | [Amazon](https://a.co/d/7C3RUYU)                                                                    | 6€             | [Eckstein](https://eckstein-shop.de/WaveShare-Serial-Bus-Servo-Driver-Board-for-ST-SC-Serial-Bus-Servos-EN)                                                                                                      | £11            | [Amazon](https://www.amazon.co.uk/Waveshare-Integrates-Control-Applicable-Integrate/dp/B0CJ6TP3TP/)      |
| Voltage Reducer                                                       | 1      | $14            | [Amazon](https://www.amazon.com/EPLZON-Converter-5V-5-3V-Transformer-Regulator/dp/B09R4DBZJK)       | 7€             | [Amazon](https://www.amazon.fr/ICQUANZX-Converter-Transformer-Voltage-Regulator/dp/B07RGB2HB6)                                                                                                                   | £15            | [Amazon](https://www.amazon.co.uk/Converter-Voltage-Regulator-Transformer-Charging/dp/B0989DKYWN)        |
| 12V Power Supply                                                      | 1      | $12            | [Amazon](https://a.co/d/40o8uMN)                                                                    | 15-36€         | [Amazon](https://www.amazon.fr/LEDMO-Alimentation-Adaptateur-Transformateurs-Chargeur/dp/B07PGLXK4X)-[GenRobots](https://www.generationrobots.com/en/400866-smps-charger-for-bioloid-and-dynamixel-robotis.html) | £13            | [Amazon](https://www.amazon.co.uk/Facmogu-Adapter-100-240V-Monitors-Amplifier/dp/B0CXPMJJMF/)            |
| Jumper Wires 3\*40 pcs set (M-M, M-F, F-F)                            | 1      | $7             | [Amazon](https://a.co/d/hQfk2cb)                                                                    | 9€             | [Amazon](https://www.amazon.fr/AZDelivery-Jumper-Cavalier-C%C3%A2ble-Arduino/dp/B074P726ZR)                                                                                                                      | £7             | [Amazon](https://www.amazon.co.uk/Elegoo-120pcs-Multicolored-Breadboard-arduino-colorful/dp/B01EV70C78/) |
| Table Clamp                                                           | 1      | $6             | [Amazon](https://a.co/d/4KEiYdV)                                                                    | n/a            | n/a                                                                                                                                                                                                              | n/a            | n/a                                                                                                      |
| Table Clamp 4pcs set<sup>[4](#myfootnote4)</sup>                      | 1      | n/a            | n/a                                                                                                 | 14€            | [Amazon](https://www.amazon.fr/CAUTIOUS-Serre-Joint-R%C3%A9glable-Serre-Joints/dp/B0CJMB3SKH)                                                                                                                    | £17            | [Amazon](https://www.amazon.co.uk/CAUTIOUS-Stainless-Performance-Clamps-Woodworking/dp/B0CJMB3SKH/)      |
| 1.5mm Star/Cruciform Screwdriver 2pcs set<sup>[5](#myfootnote5)</sup> | 1      | $7             | [Amazon](https://www.amazon.com/uxcell-Precision-Screwdriver-Eyeglasses-Electronics/dp/B0BLLV52G8/) | 7€             | [Amazon](https://www.amazon.fr/sourcing-map-Cruciforme-%C3%89lectroniques-R%C3%A9paration/dp/B0BQ69J2QF)                                                                                                         | £4             | [Amazon](https://www.amazon.co.uk/sourcing-map-Screwdriver-Eyeglasses-Electronics/dp/B0BLM2Y2Z5/)        |
| USB C-A or C-C 2pcs set<sup>[6](#myfootnote6)</sup>                   | 1      | $9             | [Amazon](https://www.amazon.com/Charging-etguuds-Charger-Braided-Compatible/dp/B0B8NWLLW2/)         | 7€             | [Amazon](https://www.amazon.fr/-/en/dp/B0CKPDZ3SK/)                                                                                                                                                              | £6             | [Amazon](https://www.amazon.co.uk/Anker-Charger-Braided-Standard-Charging/dp/B07DD5YHMH/)                |
| Total                                                                 |        | $278           |                                                                                                     | 360€           |                                                                                                                                                                                                                  | £290           |                                                                                                          |

This is my latest Side Project That I've been hacking on since jan 1 2024.

FDA Approval takes about 8 months and I have yet to file for it. Still doing Research.

Lets talk about dynamic land and bret victor's vision of the future.

I think humans should interact with UIs that render the environment map of the robot and the joints and use simulation to render all possible pathways.

Bill of parts =
free - use this admin panel on your own laptop to control it 500 - use a tablet for the face 500 - jetson nano unless you stream inference data from robot base to a desktop running this docker container on windows 100 - raspberry pi for compute 500 - irobot create 3 - legs + power supply 500 - trossen robotics arm - pincher x 3

--- Notes ---

1. https://github.com/huggingface/lerobot/blob/main/examples/7_get_started_with_real_robot.md
2. https://en.wikipedia.org/wiki/Florence_Nightingale
