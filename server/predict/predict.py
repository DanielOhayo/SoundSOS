import librosa
import numpy as np
import pandas as pd
import tensorflow as tf


def extract_features(file_path):
    X, sample_rate = librosa.load(file_path, res_type='kaiser_fast',
                                  duration=2.5, sr=22050*2, offset=0.5)
    mfccs = np.mean(librosa.feature.mfcc(
        y=X, sr=sample_rate, n_mfcc=13), axis=0)
    features = mfccs
    print(features.shape)
    return features


# Load the model
model = tf.keras.models.load_model(
    'predict\Emotion_Voice_Detection_Model.h5')
model.summary()
# Load the audio file and extract features
audio_file = 'predict\\my_unique_voice.wav'
features = extract_features(audio_file)
print(features.shape)

feat = np.expand_dims(features, axis=1)
feat = np.expand_dims(feat, axis=2)
feat = feat.reshape(1, -1, 1)
print(feat.shape)

prediction = model.predict(feat)

# Make a prediction on the features
# prediction = model.predict(np.expand_dims(features, axis=0))

# Map the prediction to an emotion label
emotion_labels = ['female_angry', 'female_calm', 'female_fearful',
                  'female_happy', 'female_sad', 'male_angry', 'male_calm', 'male_fearful',
                  'male_happy', 'male_sad']
emotion_index = np.argmax(prediction)
print(emotion_index)

emotion_label = emotion_labels[emotion_index]

print('Predicted emotion:', emotion_label)


def retLabel():
    return emotion_label
