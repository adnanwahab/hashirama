
from irobot_edu_sdk.backend.bluetooth import Bluetooth
from irobot_edu_sdk.robots import event, hand_over, Color, Robot, Root, Create3
from irobot_edu_sdk.music import Note
from bluetooth import *

print("performing inquiry...")

nearby_devices = discover_devices(lookup_names = True)

print("found %d devices" % len(nearby_devices))

for name, addr in nearby_devices:
     print(" %s - %s" % (addr, name))

import asyncio

print('gay robot')
backend0 = Bluetooth('') # Connects to the first BLE robot detected.

robot = Create3(backend0)

@event(robot.when_play)
async def main(robot):
    print('fuck your mom')
    print('robot', robot)
    await robot.play_note(Note.A4, 2)
    await robot.play_note(55, .1)
    await robot.wait(0.3)
    await robot.play_note(110, .1)
    await robot.wait(0.3)
    return 'ym'
    methods = [
        "get_cliff_sensors",
        "get_cliff_sensors_cached",
        "get_docking_values",
        "get_enabled_events",
        "get_ipv4_address",
        "get_ir_proximity",
        "get_name",
        "get_packed_ir_proximity",
        "get_position",
        "get_serial_number",
        "get_sku",
        "get_touch_sensors",
        "get_touch_sensors_cached",
        "get_version_string",
        "get_versions",
        "get_6x_ir_proximity",
        "get_7x_ir_proximity",
        "get_accelerometer",
        "get_battery_level",
        "get_bumpers",
        "get_bumpers_cached",
    ]

    for method in methods:
        try:
            result = await getattr(robot, method)()
            print(f"{method}: {result}")
        except Exception as e:
            print(f"Error calling {method}: {e}")

robot.play()
#asyncio.run(main())

# robot = Create3(Bluetooth())

# duration = 0.15


# @event(robot.when_touched, [True, False])  # (.) button.
# async def touched(robot):
#     await robot.set_lights_on_rgb(255, 0, 0)
#     await robot.play_note(Note.A4, duration)


# @event(robot.when_touched, [False, True])  # (..) button.
# async def touched(robot):
#     await robot.set_lights_on_rgb(0, 255, 0)
#     await robot.play_note(Note.C5_SHARP, duration)


# @event(robot.when_touched, [True, True])
# async def touched(robot):
#     print('ANY sensor touched')


# @event(robot.when_play)
# async def play(robot):
#     await robot.play_note(Note.C5_SHARP, duration)
#     await robot.play_note(Note.C5_SHARP, duration)
#     await robot.play_note(Note.C5_SHARP, duration)
#     await robot.play_note(Note.C5_SHARP, duration)
#     await robot.play_note(Note.A5, duration)

# robot.play()
