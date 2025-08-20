// src/utils/gemini.js

const { GoogleGenerativeAI } = require('@google/generative-ai');
const { BrowserWindow, ipcMain } = require('electron');
const { getSystemPrompt } = require('./prompts');

// Simple session management
// currentSession will now hold the chatSession object
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
        // Consider sending an update to the renderer here if needed
        return false;
    }

    isInitializingSession = true;
    sendToRenderer('update-status', 'Initializing...');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);

        const systemPrompt = getSystemPrompt(profile, customPrompt, true);

        // Get the generative model instance
        const model = genAI.getGenerativeModel({
            model: 'gemini-1.5-flash', // Using a known stable model. 'gemini-2.0-flash-exp' might not be available.
            systemInstruction: systemPrompt
        });

        // --- CHANGED: Start Chat Session ---
        // Create a chat session using startChat. This object manages conversation history.
        const chatSession = model.startChat({
            // history: [] // Optional: You can initialize with an empty history or loaded history if needed later.
            // For now, it starts fresh each time initializeGeminiSession is called.
        });
        // --- END CHANGED ---

        // Store the chat session and other relevant data
        currentSession = {
            // model: model, // Not strictly necessary if you only use chatSession, but keep if needed elsewhere
            chatSession: chatSession, // Store the chat session object
            profile: profile,
            language: language
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

// --- CHANGED: Updated processAudioMessage to use chatSession.sendMessage ---
async function processAudioMessage(audioData, mimeType) {
    // Check if a chat session exists
    if (!currentSession || !currentSession.chatSession) {
        console.error('No active chat session');
        sendToRenderer('update-status', 'Error: No active chat session');
        return { success: false, error: 'No active chat session' };
    }

    try {
        sendToRenderer('update-status', 'Processing audio...');

        // --- CHANGED: Use chatSession.sendMessage instead of model.generateContent ---
        // The chatSession automatically incorporates previous messages into the context.
        const result = await currentSession.chatSession.sendMessage([
            {
                inlineData: {
                    data: audioData, // Note: property name is 'data' based on your original code
                    mimeType: mimeType
                }
            }
            // Note: The systemInstruction set during startChat handles the general prompt.
            // You usually don't need to add a generic instruction like
            // "Please analyze this audio..." here for every message.
            // If you need specific per-message instructions, you can add them as text parts,
            // but systemInstruction is generally better for consistent behavior.
        ]);
        // --- END CHANGED ---

        // Get the text response
        // --- IMPORTANT: Use await result.response.text() ---
        const response = await result.response.text(); // Await the text() promise

        sendToRenderer('update-response', response);
        sendToRenderer('update-status', 'Ready');

        // --- NO CHANGE NEEDED HERE FOR PERSISTENCE ---
        // The chatSession internally manages the history for the current session.
        // --- END NO CHANGE ---

        return { success: true, response: response };
    } catch (error) {
        console.error('Error processing audio message:', error);
        // Provide more specific error details if possible
        const errorMessage = error.message || 'Unknown error during audio processing';
        sendToRenderer('update-status', 'Error processing audio: ' + errorMessage);
        return { success: false, error: errorMessage };
    }
}
// --- END CHANGED ---

function setupGeminiIpcHandlers() {
    ipcMain.handle('initialize-gemini', async (event, apiKey, customPrompt, profile, language) => {
        return await initializeGeminiSession(apiKey, customPrompt, profile, language);
    });

    ipcMain.handle('process-audio-message', async (event, { data, mimeType }) => {
        // Pass the data and mimeType correctly
        return await processAudioMessage(data, mimeType);
    });

    ipcMain.handle('close-session', async (event) => {
        try {
            // --- NO CHANGE NEEDED HERE FOR PERSISTENCE ---
            // Clear the session object. The chat history within the session is lost.
            currentSession = null;
            sendToRenderer('update-status', 'Session closed');
            console.log('Gemini session closed.');
            return { success: true };
            // --- END NO CHANGE ---
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