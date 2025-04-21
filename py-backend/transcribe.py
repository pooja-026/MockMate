#!/usr/bin/env python3
import sys
import os
import torch
from transformers import WhisperProcessor, WhisperForConditionalGeneration
import numpy as np
import subprocess
import tempfile
import wave
import soundfile as sf

def convert_audio(input_file, output_file=None):
    """
    Convert the input audio file to the format required by Whisper (16kHz, mono, WAV)
    Uses FFmpeg (if available) or falls back to a more robust method
    """
    if output_file is None:
        output_file = os.path.splitext(input_file)[0] + '_converted.wav'
    
    try:
        print(f"Converting {input_file} to format required by Whisper", file=sys.stderr)
        

        try:

            subprocess.run([
                'ffmpeg', 
                '-i', input_file,
                '-ar', '16000',
                '-ac', '1', 
                '-y',  
                output_file
            ], check=True, capture_output=True)
            print(f"Successfully converted using FFmpeg to {output_file}", file=sys.stderr)
            return output_file
        except (subprocess.SubprocessError, FileNotFoundError) as e:
            print(f"FFmpeg conversion failed: {str(e)}, trying alternate method", file=sys.stderr)
            
            
            try:
                
                data, samplerate = sf.read(input_file)
                
                
                if len(data.shape) > 1 and data.shape[1] > 1:
                    data = data[:, 0]
                
                
                if samplerate != 16000:
                    
                    target_length = int(len(data) * 16000 / samplerate)
                    indices = np.linspace(0, len(data) - 1, target_length)
                    data = data[indices.astype(int)]
                
                
                sf.write(output_file, data, 16000)
                
                print(f"Successfully converted using soundfile to {output_file}", file=sys.stderr)
                return output_file
            except Exception as sf_error:
                print(f"Soundfile conversion failed: {str(sf_error)}", file=sys.stderr)
                
                
                try:
                    
                    with tempfile.NamedTemporaryFile(suffix='.pcm', delete=False) as temp_pcm:
                        temp_pcm_path = temp_pcm.name
                    
                    
                    subprocess.run([
                        'ffmpeg',
                        '-i', input_file,
                        '-ar', '16000',
                        '-ac', '1',
                        '-f', 's16le',
                        '-y',
                        temp_pcm_path
                    ], check=True, capture_output=True)
                    
                    
                    with open(temp_pcm_path, 'rb') as pcm_file:
                        pcm_data = pcm_file.read()
                    
                    
                    with wave.open(output_file, 'wb') as wav_file:
                        wav_file.setnchannels(1)
                        wav_file.setsampwidth(2)  # 16-bit
                        wav_file.setframerate(16000)
                        wav_file.writeframes(pcm_data)
                    
                    
                    os.remove(temp_pcm_path)
                    
                    print(f"Successfully converted using wave module to {output_file}", file=sys.stderr)
                    return output_file
                except Exception as wave_error:
                    print(f"Wave module conversion failed: {str(wave_error)}", file=sys.stderr)
                    raise Exception("All conversion methods failed. Please install FFmpeg.")
    except Exception as e:
        print(f"Error converting audio: {str(e)}", file=sys.stderr)
        raise

def transcribe_audio(audio_file):
    """
    Transcribe the audio file using Whisper base model
    """
    try:
        print("Loading Whisper model...", file=sys.stderr)
        
       
        device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {device}", file=sys.stderr)
        
        
        processor = WhisperProcessor.from_pretrained("openai/whisper-base")
        model = WhisperForConditionalGeneration.from_pretrained("openai/whisper-base").to(device)
        
        print("Model loaded successfully", file=sys.stderr)
        
        
        with wave.open(audio_file, 'rb') as wav_file:
            
            framerate = wav_file.getframerate()
            nframes = wav_file.getnframes()
            
            
            audio_bytes = wav_file.readframes(nframes)
            
            
            audio_np = np.frombuffer(audio_bytes, dtype=np.int16).astype(np.float32)
            
            
            audio_np = audio_np / 32768.0
        
        print(f"Audio loaded successfully: {len(audio_np)} samples at {framerate}Hz", file=sys.stderr)
        
        
        input_features = processor(
            audio_np, 
            sampling_rate=16000, 
            return_tensors="pt"
        ).input_features.to(device)
        
        
        predicted_ids = model.generate(input_features)
        
        
        transcription = processor.batch_decode(
            predicted_ids, 
            skip_special_tokens=True
        )[0]
        
        print("Transcription completed successfully", file=sys.stderr)
        return transcription
    except Exception as e:
        print(f"Error during transcription: {str(e)}", file=sys.stderr)
        raise

def main():
    """
    Main function to handle the transcription process
    """
    if len(sys.argv) < 2:
        print("Usage: python transcribe.py <audio_file_path>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    try:
        
        if not os.path.exists(input_file):
            print(f"Error: File {input_file} does not exist", file=sys.stderr)
            sys.exit(1)
        
        print(f"Processing file: {input_file}", file=sys.stderr)
        
        
        file_size = os.path.getsize(input_file) / (1024 * 1024)  # Convert to MB
        file_ext = os.path.splitext(input_file)[1]
        print(f"File size: {file_size:.2f} MB, Format: {file_ext}", file=sys.stderr)
        
        
        converted_file = convert_audio(input_file)
        
        
        transcription = transcribe_audio(converted_file)
        
        
        print(transcription)
        
        
        if converted_file != input_file and os.path.exists(converted_file):
            os.remove(converted_file)
            
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()