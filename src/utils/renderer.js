// Audio-focused renderer utilities
const { ipcRenderer } = require('electron');

// Audio processing utilities
function convertFloat32ToInt16(float32Array) {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
        const s = Math.max(-1, Math.min(1, float32Array[i]));
        int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16Array;
}

function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

// Initialize Gemini session
async function initializeGemini(apiKey, profile = 'interview') {
    try {
        const success = await ipcRenderer.invoke('initialize-gemini', apiKey, '', profile, 'en-US');
        return success;
    } catch (error) {
        console.error('Error initializing Gemini:', error);
        return false;
    }
}

// Send audio message to Gemini and get complete response
async function sendAudioMessage(audioData, mimeType) {
    try {
        const result = await ipcRenderer.invoke('process-audio-message', {
            data: audioData,
            mimeType: mimeType
        });
        return result;
    } catch (error) {
        console.error('Error sending audio message:', error);
        return { success: false, error: error.message };
    }
}

// Global audio helper object
window.audioHelper = {
    initializeGemini,
    sendAudioMessage,
    convertFloat32ToInt16,
    arrayBufferToBase64,
};