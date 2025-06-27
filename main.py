import multiprocessing
from flask import Flask, request, jsonify, render_template
import os
import time
from werkzeug.utils import secure_filename
from pydub import AudioSegment
import numpy as np
import whisper
import torch
from openai import OpenAI
from flask_cors import CORS
from dotenv import load_dotenv
from concurrent.futures import ProcessPoolExecutor
import itertools
from pyannote.audio import Pipeline

load_dotenv()

# Load API Key Once
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OpenAI API key is missing! Set it in the .env file.")

client = OpenAI(api_key=OPENAI_API_KEY)

# Load Whisper Model
print("Loading Whisper model...")
start_time = time.time()
WHISPER_MODEL = whisper.load_model("tiny.en")
print(f"Whisper model loaded in {time.time() - start_time:.2f} seconds.\n")

app = Flask(__name__)
CORS(app, resources={r"/upload": {"origins": "http://10.245.146.157:8786"}})

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'wav', 'mp3', 'txt'}

# Utility: Check allowed file
def allowed_file(filename, file_type):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Utility: Measure time
def measure_time(func):
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        print(f"{func.__name__} executed in {time.time() - start_time:.2f} seconds")
        return result
    return wrapper

# Preprocessing for Whisper
def preprocess_audio(audio_segment):
    return np.array(audio_segment.set_channels(1).set_frame_rate(16000).get_array_of_samples(), dtype=np.float32) / 32768.0

# Split audio into 30s chunks
def split_audio(file_path, chunk_length_ms=30000):
    audio = AudioSegment.from_file(file_path)
    chunks = []
    for i in range(0, len(audio), chunk_length_ms):
        chunk = audio[i:i + chunk_length_ms]
        chunk_path = f"{file_path}_chunk_{i // chunk_length_ms}.wav"
        chunk.export(chunk_path, format="wav")
        chunks.append((chunk_path, i / 1000.0))  # Offset in seconds
    return chunks

# Global pipeline per worker
def init_worker():
    global pipeline
    HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
    if not HF_API_KEY:
        raise ValueError("HuggingFace API key is missing! Set it in the .env file.")
    pipeline = Pipeline.from_pretrained(
        "pyannote/speaker-diarization-3.1",
        use_auth_token=HF_API_KEY
    ).to(torch.device("cuda"))

def diarize_chunk(args):
    chunk_path, offset = args
    diarization = pipeline(chunk_path)
    results = []
    for turn, _, speaker in diarization.itertracks(yield_label=True):
        start = round(turn.start + offset, 1)
        end = round(turn.end + offset, 1)
        results.append((start, end, speaker))
    return results

@measure_time
def diarize_audio_parallel(file_path):
    chunks = split_audio(file_path)
    with ProcessPoolExecutor(max_workers=2, initializer=init_worker) as executor:
        results = list(executor.map(diarize_chunk, chunks))
    return list(itertools.chain.from_iterable(results))

@measure_time
def process_and_transcribe(audio_file_path, speaker_segments, model=WHISPER_MODEL):
    audio = AudioSegment.from_file(audio_file_path)
    transcriptions = []
    for start, end, sp in speaker_segments:
        segment = audio[start * 1000:end * 1000]
        preprocessed_audio = preprocess_audio(segment)
        transcript = model.transcribe(preprocessed_audio)['text']
        transcriptions.append((sp, transcript))
    return transcriptions

@measure_time
def generate_mom(transcriptions, is_audio=False):
    formatted_input = "\n".join(f"{sp or 'Speaker'}: {txt}" for sp, txt in transcriptions)
    prompt = f"Generate professional MoM based on:\n{formatted_input}"
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": "You are a helpful assistant."},
                      {"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error generating MoM: {str(e)}"

@app.route('/upload', methods=['POST'])
def upload_file():
    start_time = time.time()
    file = request.files.get("file")
    file_type = request.form.get("file_type")

    if not file or file.filename == '':
        return jsonify({"error": "No valid file uploaded"}), 400
    if not allowed_file(file.filename, file_type):
        return jsonify({"error": f"Invalid {file_type} file format"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(file_path)

    try:
        if file_type == "audio":
            speaker_segments = diarize_audio_parallel(file_path)
            transcriptions = process_and_transcribe(file_path, speaker_segments)
            mom = generate_mom(transcriptions, is_audio=True)
        else:
            with open(file_path, 'r') as f:
                mom = generate_mom([(None, f.read())], is_audio=False)

        total_time = time.time() - start_time
        print(f"Total request processing time: {total_time:.2f} seconds")

        return jsonify({"mom": mom}), 200
    except Exception as e:
        return jsonify({"error": f"Processing error: {str(e)}"}), 500

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    multiprocessing.set_start_method('spawn', force=True)
    app.run(host="0.0.0.0", port=8785, debug=True, use_reloader=False)






































