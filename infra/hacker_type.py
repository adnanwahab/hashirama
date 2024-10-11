import keyboard
import pyautogui
import time

#listen or screenshot -> llm the question -> on type do this
#https://hackertyper.net/
# The text you want to types word by word
# naruto chunin exam
text = "asdf asdf sadf"
words = text.split()  # Splits the text into individual words

def type_word():
    if words:  # Check if there are still words left to type
        word = words.pop(0)  # Remove and return the first word
        pyautogui.write(word)  # Type the word
        pyautogui.write(' ')  # Add a space after the word

# Trigger `type_word` every time any key is pressed
keyboard.on_press(lambda event: type_word())

print("Press any key to start typing the text, word by word.")
keyboard.wait()  # Keep the program running to listen for keypresses
