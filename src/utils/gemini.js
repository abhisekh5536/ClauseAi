// src/utils/gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { BrowserWindow, ipcMain } = require('electron');
const { getSystemPrompt } = require('./prompts');

let currentSession = null;
let isInitializingSession = false;

function sendToRenderer(channel, data) {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
        windows[0].webContents.send(channel, data);
    }
}

async function initializeGeminiSession(apiKey, customPrompt = '', profile = 'interview', language = 'en-US') {
    if (isInitializingSession) {
        console.log('Session initialization already in progress');
        return false;
    }

    isInitializingSession = true;
    sendToRenderer('update-status', 'Initializing...');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const systemPrompt = getSystemPrompt(profile, customPrompt, true);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            systemInstruction: systemPrompt,
        });
        const chatSession = model.startChat({});
        currentSession = {
            chatSession: chatSession,
            profile: profile,
            language: language,
        };
        isInitializingSession = false;
        sendToRenderer('update-status', 'Ready');
        console.log('Gemini session initialized with chat session.');
        return true;
    } catch (error) {
        console.error('Failed to initialize Gemini session:', error);
        isInitializingSession = false;
        sendToRenderer('update-status', 'Error: ' + error.message);
        return false;
    }
}

// --- CHANGED: Updated processAudioMessage to stream the response ---
async function processAudioMessage(audioData, mimeType) {
    if (!currentSession || !currentSession.chatSession) {
        console.error('No active chat session');
        const errorMsg = 'No active chat session';
        sendToRenderer('update-status', 'Error: ' + errorMsg);
        return { success: false, error: errorMsg };
    }

    try {
        sendToRenderer('update-status', 'Processing audio...');

        const audioPart = {
            inlineData: {
                data: audioData,
                mimeType: mimeType,
            },
        };

        // Use sendMessageStream to get a streaming response
        const result = await currentSession.chatSession.sendMessageStream([audioPart]);

        // Let the frontend know that the stream is starting.
        // This is the signal to clear the previous response text.
        sendToRenderer('stream-response-start');

        let fullResponse = '';
        // Iterate through the stream and send chunks to the renderer
        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            if (chunkText) {
                fullResponse += chunkText;
                sendToRenderer('stream-response-chunk', chunkText);
            }
        }

        // Let the frontend know the stream has ended to reset the UI state
        sendToRenderer('stream-response-end');
        sendToRenderer('update-status', 'Ready');

        console.log('Streaming finished.');
        return { success: true, response: fullResponse };
    } catch (error) {
        console.error('Error processing audio message:', error);
        const errorMessage = error.message || 'Unknown error during audio processing';
        sendToRenderer('update-status', 'Error: ' + errorMessage);
        // Also send an end signal on error to reset the UI
        sendToRenderer('stream-response-end');
        return { success: false, error: errorMessage };
    }
}
// --- END CHANGED ---

function setupGeminiIpcHandlers() {
    ipcMain.handle('initialize-gemini', async (event, apiKey, customPrompt, profile, language) => {
        return await initializeGeminiSession(apiKey, customPrompt, profile, language);
    });

    ipcMain.handle('process-audio-message', async (event, { data, mimeType }) => {
        return await processAudioMessage(data, mimeType);
    });

    ipcMain.handle('close-session', async (event) => {
        try {
            currentSession = null;
            sendToRenderer('update-status', 'Session closed');
            console.log('Gemini session closed.');
            return { success: true };
        } catch (error) {
            console.error('Error closing session:', error);
            sendToRenderer('update-status', 'Error closing session');
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    initializeGeminiSession,
    processAudioMessage,
    sendToRenderer,
    setupGeminiIpcHandlers,
};