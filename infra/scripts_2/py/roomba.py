#
# Licensed under 3-Clause BSD license available in the License file. Copyright (c) 2021-2024 iRobot Corporation. All rights reserved.
#

from irobot_edu_sdk.backend.bluetooth import Bluetooth
from irobot_edu_sdk.robots import event, hand_over, Color, Robot, Root, Create3
from irobot_edu_sdk.music import Note

# robot is the instance of the robot that will allow us to call its methods and to define events with the @event decorator.
robot = Create3(Bluetooth())  # Will connect to the first robot found.
speed = 10.0


# def f(value):
#     return format(value, '.2f')


# async def print_pos(robot):
#     pos = await robot.get_position()
#     print('🐢 (x  y  heading) = (', f(pos.x),  f(pos.y), f(pos.heading), ')')


# @event(robot.when_bumped, [True, False])  # [left, right]
# # Please note that the 'robot' parameter is not related to the 'robot' instance: robot is what can be used inside the event's function.
# async def bumped(robot):  # The name of this function can be any valid Python function name.
#     print('Left bumper pressed')
#     await robot.set_lights_on_rgb(255, 0, 0)  # red
#     await robot.set_wheel_speeds(-speed, speed)


# @event(robot.when_bumped, [False, True])
# async def bumped(robot):
#     print('Right bumper pressed')
#     await robot.set_lights_on_rgb(0, 255, 0)  # green.
#     await robot.set_wheel_speeds(speed, -speed)


# @event(robot.when_bumped, [True, True])
# async def bumped(robot):
#     print('Any bumper pressed; bumper state is', await robot.get_bumpers())


# @event(robot.when_bumped, [True, True])
# async def bumped(robot):
#     for _ in range(4):
#         await robot.play_note(440, 0.25)  # A4
#         await robot.play_note(Note.A5, 0.75)


# @event(robot.when_touched, [True, False])  # User buttons: [(.), (..)]
# async def touched(robot):
#     print('(.) button touched')


# @event(robot.when_touched, [True, True])
# async def touched(robot):
#     print('Any button sensor touched; touch state is', await robot.get_touch_sensors())


# @event(robot.when_touched, [True, False])  # (.) button
# async def touched(robot):
#     await robot.turn_right(90)
#     await robot.navigate_to(5, 10)
#     await print_pos(robot)
#     await robot.reset_navigation()
#     await print_pos(robot)


# @event(robot.when_touched, [False, True])  # (..) button
# async def touched(robot):
#     print('(..) button touched')
#     await robot.set_lights_spin_rgb(255, 255, 0)
#     await robot.move(2)
#     await robot.arc_right(90, 4)
#     await robot.arc_right(-90, 4)
#     await robot.move(-2)


# @event(robot.when_cliff_sensor, [True, True, True, True])
# async def cliff(robot):
#     print('There\'s a cliff!')


# @event(robot.when_play)
# async def play(robot):
#     print('play 1')
#     await robot.set_lights_on_rgb(100, 100, 255)


# @event(robot.when_play)
# async def play(robot):
#     print('play 2')
#     address = await robot.get_ipv4_address()
#     ip = address.wlan0
#     print('http://' + str(ip[0]) + '.' + str(ip[1]) + '.' + str(ip[2]) + '.' + str(ip[3]))
#     battery = await robot.get_battery_level()
#     print('Name:', await robot.get_name())
#     print('Version:', await robot.get_version_string())
#     print('Battery:', battery[0], 'mV; ', battery[1], '%')
#     print('Serial #:', await robot.get_serial_number())
#     print('SKU:', await robot.get_sku())
#     # await robot.set_name('NewName')  # Uncomment this line if you want to try renaming your robot.


# @event(robot.when_play)
# async def play(robot):
#     print('play 2')
#     for _ in range(4):
#         await robot.set_lights_on_rgb(100, 100, 255)
#         await robot.wait(1)
#         await robot.set_lights_on_rgb(0, 255, 80)
#         await robot.wait(1)


# @event(robot.when_play)
# async def play(robot):
#     print('play 3')
#     while True:
#         sensors = (await robot.get_ir_proximity()).sensors
#         r = 255 * sensors[2] / 4095
#         g = 255 * sensors[3] / 4095
#         b = 255 * sensors[4] / 4095
#         await robot.set_lights_on_rgb(r, g, b)

@event(robot.when_play)
async def play(robot):
    for i in range(1, 20):
        await robot.play_note(i*100, 0.25)
    await robot.stop_sound()
    print("yay done")

#http://timjchin.com/digital/one-to-many/

# Triggers all the "when_play" events as parallel tasks.
robot.play()
