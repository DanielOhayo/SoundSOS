import ffmpeg
import sys

print("here")
name = sys.argv[1]
input_file = 'C:\\Users\\ohayo\AppData\\Local\\Google\\AndroidStudio2022.1\\device-explorer\\Pixel_6_Pro_API_33 [emulator-5554]\\data\\data\\com.example.flutter_dev\\cache\\' + name
print(input_file)
output_file = 'predict\\my_unique_voice.wav'
(
    ffmpeg
    .input(input_file, format='aac')
    .output(output_file, format='wav')
    .run(cmd=['ffmpeg', '-y'])
)
