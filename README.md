# Audio Assistant

A simplified AI-powered audio assistant that provides contextual help during conversations using audio analysis only.

## Features

- **Audio-Only Processing**: Focuses solely on audio input for AI assistance
- **Manual Control**: Use Ctrl+Shift+A (Cmd+Shift+A on Mac) to capture and send audio
- **Instant Responses**: Get complete AI responses immediately instead of streaming
- **Multiple Profiles**: Interview, Sales Call, Business Meeting, Presentation, Negotiation, Exam Assistant
- **Transparent Overlay**: Always-on-top window that can be positioned anywhere
- **Cross-platform**: Works on macOS, Windows, and Linux

## Setup

1. **Get a Gemini API Key**: Visit [Google AI Studio](https://aistudio.google.com/apikey)
2. **Install Dependencies**: `npm install`
3. **Run the App**: `npm start`

## Usage

1. Enter your Gemini API key
2. Choose your AI profile
3. Click "Start Session"
4. Use **Ctrl+Shift+A** (or **Cmd+Shift+A** on Mac) to capture 3 seconds of audio
5. Get instant AI assistance based on the audio content

## Keyboard Shortcuts

- **Audio Capture**: `Ctrl/Cmd + Shift + A` - Capture and send audio to AI
- **Window Movement**: `Ctrl/Cmd + Arrow Keys` - Move window
- **Click-through**: `Ctrl/Cmd + M` - Toggle mouse events
- **Hide/Show**: `Ctrl/Cmd + \` - Toggle window visibility
- **Start Session**: `Ctrl/Cmd + Enter` - Start new session

## Requirements

- Electron-compatible OS (macOS, Windows, Linux)
- Gemini API key
- Microphone permissions