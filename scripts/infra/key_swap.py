import keyboard

words = "asdf asdf sadf".split()

def type_next_word():
    if words:
        print(words.pop(0), end=' ', flush=True)

keyboard.on_press(type_next_word)

# Keep the script running
keyboard.wait('esc')  # Press 'esc' to stop
