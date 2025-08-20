# Audio Assistant - Simplified

This is a streamlined version of the original cheating-daddy project, focused exclusively on audio processing capabilities.

## Architecture

The application consists of:

- **Main Process** (`src/index.js`) - Electron main process
- **Renderer Process** (`src/components/app/AudioAssistantApp.js`) - Single-page UI
- **Audio Processing** (`src/utils/renderer.js`) - Audio capture and processing
- **AI Integration** (`src/utils/gemini.js`) - Gemini API integration
- **Window Management** (`src/utils/window.js`) - Window controls and shortcuts

## Key Features

1. **Manual Audio Capture**: Ctrl+Shift+A captures 3 seconds of audio
2. **Instant Responses**: Complete AI responses instead of streaming
3. **Profile-Based**: Different AI behaviors for different scenarios
4. **Minimal UI**: Simple, focused interface

## Development

```bash
npm install
npm start
```

## Code Standards

- Keep files focused and under 200 lines
- Use modern JavaScript/ES6+
- Maintain clear separation of concerns
- Follow existing code style and patterns

## Removed Features

- Automatic screenshot capture
- Live streaming responses
- Complex UI components (onboarding, history, advanced settings)
- Multiple view navigation
- Conversation history storage
- Rate limiting and token tracking
- Stealth features and process randomization