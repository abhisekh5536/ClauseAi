// src/components/app/AudioAssistantApp.js

import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AudioAssistantApp extends LitElement {
    static styles = css`
        * {
            box-sizing: border-box;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            margin: 0;
            padding: 0;
            cursor: default;
            user-select: none;
        }

        :host {
            display: block;
            width: 100%;
            height: 100vh;
            background-color: transparent;
            color: var(--text-color);
        }

        .window-container {
            height: 100vh;
            border-radius: 7px;
            overflow: hidden;
        }

        .container {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .header {
            -webkit-app-region: drag;
            display: flex;
            align-items: center;
            padding: 10px 20px;
            border: 1px solid var(--border-color);
            background: var(--header-background);
            border-radius: 10px;
        }

        .header-title {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            -webkit-app-region: drag;
        }

        .header-actions {
            display: flex;
            gap: 12px;
            align-items: center;
            -webkit-app-region: no-drag;
        }

        .header-actions span {
            font-size: 13px;
            color: rgba(255, 255, 255, 0.6);
        }

        .button {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .button:hover {
            background: var(--hover-background);
        }

        .icon-button {
            background: none;
            color: var(--text-color);
            border: none;
            padding: 8px;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            opacity: 0.6;
        }

        .icon-button:hover {
            background: var(--hover-background);
            opacity: 1;
        }

        .icon-button svg {
            width: 24px;
            height: 24px;
        }

        .main-content {
            flex: 1;
            padding: 20px;
            overflow-y: auto;
            margin-top: 10px;
            border-radius: 10px;
            background: var(--main-content-background);
            border: 1px solid var(--border-color);
        }

        .main-view {
            display: flex;
            flex-direction: column;
            height: 100%;
            max-width: 500px;
        }

        .welcome {
            font-size: 24px;
            margin-bottom: 8px;
            font-weight: 600;
        }

        .input-group {
            display: flex;
            gap: 12px;
            margin-bottom: 20px;
        }

        .input-group input {
            flex: 1;
        }

        input {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 10px 14px;
            width: 100%;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s ease;
        }

        input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 3px var(--focus-box-shadow);
            background: var(--input-focus-background);
        }

        input::placeholder {
            color: var(--placeholder-color);
        }

        .start-button {
            background: var(--start-button-background);
            color: var(--start-button-color);
            border: 1px solid var(--start-button-background);
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 500;
            white-space: nowrap;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .start-button:hover {
            background: rgba(255, 255, 255, 0.8);
        }

        .start-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }

        .description {
            color: var(--description-color);
            font-size: 14px;
            margin-bottom: 24px;
            line-height: 1.5;
        }

        .link {
            color: var(--link-color);
            text-decoration: underline;
            cursor: pointer;
        }

        .assistant-view {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .response-container {
            flex: 1;
            overflow-y: auto;
            border-radius: 10px;
            font-size: 18px;
            line-height: 1.6;
            background: var(--main-content-background);
            padding: 16px;
            margin-bottom: 16px;
            border: 1px solid var(--border-color);
            user-select: text;
            cursor: text;
            white-space: pre-wrap;
        }

        .audio-controls {
            display: flex;
            gap: 12px;
            align-items: center;
            padding: 12px;
            background: var(--input-background);
            border: 1px solid var(--button-border);
            border-radius: 8px;
        }

        .audio-button {
            background: var(--button-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 10px 16px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .audio-button:hover {
            background: var(--hover-background);
        }

        .audio-button.recording {
            background: #dc2626;
            border-color: #dc2626;
            color: white;
        }

        .audio-button.processing {
            background: #f59e0b;
            border-color: #f59e0b;
            color: white;
            opacity: 0.8;
        }

        .audio-status {
            flex: 1;
            font-size: 12px;
            color: var(--description-color);
            text-align: center;
        }

        .key {
            background: rgba(255, 255, 255, 0.1);
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            margin: 0 2px;
            font-family: 'SF Mono', 'Monaco', monospace;
        }

        .profile-selector {
            margin-bottom: 16px;
        }

        .profile-selector select {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            cursor: pointer;
            width: 100%;
        }

        .profile-selector label {
            display: block;
            margin-bottom: 6px;
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color);
        }

        .error-message {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            margin-bottom: 16px;
        }

        .success-message {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
            padding: 12px;
            border-radius: 6px;
            font-size: 12px;
            margin-bottom: 16px;
        }
    `;

    static properties = {
        currentView: { type: String },
        statusText: { type: String },
        sessionActive: { type: Boolean },
        selectedProfile: { type: String },
        response: { type: String },
        isRecording: { type: Boolean },
        isProcessing: { type: Boolean }, // Reflects if an audio message is being sent/processed by the AI
        errorMessage: { type: String },
        successMessage: { type: String },
        // NEW: Properties to manage the list of audio devices and the user's selection.
        audioDevices: { type: Array },
        selectedAudioDevice: { type: String },
    };

    constructor() {
        super();
        this.currentView = 'main';
        this.statusText = '';
        this.sessionActive = false;
        this.selectedProfile = localStorage.getItem('selectedProfile') || 'interview';
        this.response = '';
        this.isRecording = false;
        // CHANGED: Initialize isProcessing to false
        this.isProcessing = false;
        this.errorMessage = '';
        this.successMessage = '';
        this.audioChunks = [];
        this.mediaRecorder = null;
        this.chunkInterval = null; // NEW: To hold the interval ID
        // NEW: Initialize the new properties. We get the last selected device from localStorage.
        this.audioDevices = [];
        this.selectedAudioDevice = localStorage.getItem('selectedAudioDevice') || 'default';
    }

    connectedCallback() {
        super.connectedCallback();

        // Set up IPC listeners
        if (window.require) {
            const { ipcRenderer } = window.require('electron');

            ipcRenderer.on('update-response', (_, response) => {
                this.response = response;
                // CHANGED: Set isProcessing to false when a response is received
                this.isProcessing = false;
            });

            ipcRenderer.on('update-status', (_, status) => {
                this.statusText = status;

                if (status.toLowerCase().includes('processing')) {
                    this.isProcessing = true;
                } else if (status === '' || status.toLowerCase().includes('ready') || status.toLowerCase().includes('error')) {
                }
            });
        }

        // Set up keyboard shortcut listener
        document.addEventListener('keydown', this.handleKeydown.bind(this));

        // NEW: When the app starts, we immediately load the list of available microphones.
        this.loadAudioDevices();
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        document.removeEventListener('keydown', this.handleKeydown.bind(this));

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.removeAllListeners('update-response');
            ipcRenderer.removeAllListeners('update-status');
        }
    }

    handleKeydown(e) {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const shortcutKey = isMac ? e.metaKey : e.ctrlKey;

        if (shortcutKey && e.shiftKey && e.key.toLowerCase() === 'a' && this.sessionActive) {
            e.preventDefault();
            // CHANGED: The shortcut now toggles recording on and off.
            this.toggleRecording();
        }

        if (shortcutKey && e.key === 'Enter' && this.currentView === 'main') {
            e.preventDefault();
            this.handleStart();
        }
    }

    async handleStart() {
        const apiKey = localStorage.getItem('apiKey')?.trim();
        if (!apiKey) {
            this.errorMessage = 'Please enter your Gemini API key';
            this.successMessage = '';
            return;
        }

        try {
            this.errorMessage = '';
            this.successMessage = '';

            // Initialize Gemini session
            const success = await window.audioHelper.initializeGemini(apiKey, this.selectedProfile);

            if (success) {
                this.sessionActive = true;
                this.currentView = 'assistant';
                // CHANGED: Update initial response text
                this.response = `Audio Assistant is ready. Press ${navigator.platform.toUpperCase().indexOf('MAC') >= 0 ? 'Cmd+Shift+A' : 'Ctrl+Shift+A'} to start/stop listening.`;
                this.successMessage = 'Session started successfully';
                // CHANGED: Ensure status is cleared
                this.statusText = '';
                // CHANGED: Ensure processing state is reset
                this.isProcessing = false;
            } else {
                this.errorMessage = 'Failed to initialize AI session. Please check your API key.';
            }
        } catch (error) {
            console.error('Error starting session:', error);
            this.errorMessage = 'Error starting session: ' + error.message;
        }
    }

    async handleClose() {
        if (this.currentView === 'assistant') {
            // Stop any ongoing recording
            this.stopRecording(); // Make sure to stop recording before closing

            // Close the session
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('close-session');
            }

            this.sessionActive = false;
            this.currentView = 'main';
            this.response = '';
            this.statusText = '';
            // CHANGED: Reset processing state on close
            this.isProcessing = false;
        } else {
            // Quit the application
            if (window.require) {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('quit-application');
            }
        }
    }

    async handleHideToggle() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('toggle-window-visibility');
        }
    }

    handleProfileChange(e) {
        this.selectedProfile = e.target.value;
        localStorage.setItem('selectedProfile', this.selectedProfile);
    }

    handleApiKeyInput(e) {
        localStorage.setItem('apiKey', e.target.value);
        if (this.errorMessage) {
            this.errorMessage = '';
        }
    }

    async handleAPIKeyHelp() {
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            await ipcRenderer.invoke('open-external', 'https://aistudio.google.com/apikey'); // Updated URL
        }
    }

    // NEW: Function to get a list of all available audio input devices (microphones).
    async loadAudioDevices() {
        try {
            // We must request permission first to get the device names.
            await navigator.mediaDevices.getUserMedia({ audio: true });
            const devices = await navigator.mediaDevices.enumerateDevices();
            this.audioDevices = devices.filter(device => device.kind === 'audioinput');
        } catch (err) {
            this.errorMessage = "Could not access microphone. Please grant permission in your system settings.";
            console.error("Error enumerating audio devices:", err);
        }
    }

    // NEW: Handler for when the user changes the selection in the dropdown.
    handleAudioDeviceChange(e) {
        this.selectedAudioDevice = e.target.value;
        localStorage.setItem('selectedAudioDevice', this.selectedAudioDevice);
    }

    // CHANGED: The main audio capture function is now a simple toggle.
    toggleRecording() {
        if (this.isRecording) {
            this.stopRecording();
        } else {
            this.startRecording();
        }
    }

    async startRecording() {
        // CHANGED: Prevent starting recording if already processing a previous request
        if (this.isProcessing) {
            console.log("Cannot start recording while processing previous audio.");
            // Optionally, provide user feedback
            // this.errorMessage = "Please wait for the current response.";
            return;
        }

        try {
            this.isRecording = true;
            this.errorMessage = '';
            this.audioChunks = [];

            // CHANGED: We now build a constraint object using the selected deviceId.
            const constraints = {
                audio: {
                    deviceId: this.selectedAudioDevice === 'default' ? undefined : { exact: this.selectedAudioDevice },
                    // These settings improve quality for voice
                    sampleRate: 48000,
                    channelCount: 1,
                    echoCancellation: true,
                    noiseSuppression: true,
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' });

            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) this.audioChunks.push(event.data);
            };

            this.mediaRecorder.onstop = () => {
                stream.getTracks().forEach(track => track.stop());
                this.processAudioChunks(); // Process final chunks when stopped.
            };

            this.mediaRecorder.start();

            // NEW: We will now process audio in chunks every 5 seconds.
            this.chunkInterval = setInterval(() => {
                if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                    // This requests the data captured so far and triggers 'ondataavailable'
                    this.mediaRecorder.requestData();
                }
            }, 5000); // Process audio in 5-second chunks.

        } catch (error) {
            console.error('Error starting recording:', error);
            this.errorMessage = 'Failed to access the selected audio device. Please check permissions or try another device.';
            this.isRecording = false;
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
            this.mediaRecorder.stop();
        }
        if (this.chunkInterval) {
            clearInterval(this.chunkInterval);
            this.chunkInterval = null; // Clear the reference
        }
        this.isRecording = false;
    }

    // This is the old `handleAudioCapture` logic, now split into multiple functions
    async processAudioChunks() {
        if (this.audioChunks.length === 0) {
            // CHANGED: Ensure processing state is reset if no chunks
            this.isProcessing = false;
            return;
        }

        // Process the current chunks and clear the array for the next interval
        const chunksToProcess = [...this.audioChunks];
        this.audioChunks = [];

        // CHANGED: Set isProcessing to true immediately when chunks are sent
        this.isProcessing = true;
        // CHANGED: Clear any previous error message related to processing
        if (this.errorMessage && this.errorMessage.startsWith('Error processing audio')) {
             this.errorMessage = '';
        }

        try {
            const audioBlob = new Blob(chunksToProcess, { type: 'audio/webm;codecs=opus' });
            const reader = new FileReader();

            reader.onloadend = async () => {
                const base64Data = reader.result.split(',')[1];
                if (window.require) {
                    const { ipcRenderer } = window.require('electron');
                    // Note: We don't await this. We let it run in the background.
                    // This allows the UI to remain responsive.
                    // The response or error will come back via IPC events.
                    ipcRenderer.invoke('process-audio-message', {
                        data: base64Data,
                        mimeType: 'audio/webm;codecs=opus'
                    });
                }
            };

            reader.readAsDataURL(audioBlob);

        } catch (error) {
            console.error('Error processing audio chunks:', error);
            this.errorMessage = 'Error processing audio: ' + error.message;
            // CHANGED: Reset processing state on local processing error
            this.isProcessing = false;
        }
    }

    getProfiles() {
        return [
            { value: 'interview', name: 'Job Interview' },
            { value: 'sales', name: 'Sales Call' },
            { value: 'meeting', name: 'Business Meeting' },
            { value: 'presentation', name: 'Presentation' },
            { value: 'negotiation', name: 'Negotiation' },
            { value: 'exam', name: 'Exam Assistant' },
        ];
    }

    // CHANGED: The Main View now includes the audio device dropdown selector.
    renderMainView() {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;

        return html`
            <div class="main-view">
                <div class="welcome">Audio Assistant</div>

                ${this.errorMessage ? html`<div class="error-message">${this.errorMessage}</div>` : ''}
                ${this.successMessage ? html`<div class="success-message">${this.successMessage}</div>` : ''}

                <!-- NEW: Audio Input Selector Dropdown -->
                <div class="profile-selector">
                    <label>Audio Input Device:</label>
                    <select .value=${this.selectedAudioDevice} @change=${this.handleAudioDeviceChange}>
                        <option value="default">Default Device</option>
                        ${this.audioDevices.map(device => html`
                            <option value=${device.deviceId}>${device.label || device.deviceId}</option>
                        `)}
                    </select>
                </div>

                <div class="profile-selector">
                    <label>AI Profile:</label>
                    <select .value=${this.selectedProfile} @change=${this.handleProfileChange}>
                        ${this.getProfiles().map(profile => html`
                            <option value=${profile.value}>${profile.name}</option>
                        `)}
                    </select>
                </div>

                <div class="input-group">
                    <input
                        type="password"
                        placeholder="Enter your Gemini API Key"
                        .value=${localStorage.getItem('apiKey') || ''}
                        @input=${this.handleApiKeyInput}
                    />
                    <button @click=${this.handleStart} class="start-button">
                        Start Session
                    </button>
                </div>

                <p class="description">
                    Don't have an API key?
                    <span @click=${this.handleAPIKeyHelp} class="link">Get one here</span>
                </p>

                <p class="description">
                    To capture meeting audio, use a tool like VB-CABLE, then select "CABLE Output" from the dropdown above.
                </p>

                <p class="description">
                    Once started, use <span class="key">${isMac ? 'Cmd' : 'Ctrl'}</span> +
                    <span class="key">Shift</span> + <span class="key">A</span> to start/stop listening
                </p>
            </div>
        `;
    }

    // CHANGED: The Assistant View reflects the processing state on the button and status text.
    renderAssistantView() {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const keyCombo = html`<span class="key">${isMac ? 'Cmd' : 'Ctrl'}</span> + <span class="key">Shift</span> + <span class="key">A</span>`;

        // Determine button class based on state
        let buttonClass = 'audio-button';
        if (this.isRecording) {
            buttonClass += ' recording';
        } else if (this.isProcessing) {
            buttonClass += ' processing';
        }

        // Determine button text based on state
        let buttonText = '🎤 Start Listening';
        if (this.isRecording) {
            buttonText = '🔴 Stop Listening';
        } else if (this.isProcessing) {
            buttonText = '⏳ Processing...';
        }

        // Determine status text based on state
        let statusText = `Press button or ${keyCombo} to start.`;
        if (this.isRecording) {
            statusText = this.statusText || 'Listening...';
        } else if (this.isProcessing) {
            statusText = this.statusText || 'Processing audio...';
        }

        return html`
            <div class="assistant-view">
                <div class="response-container">
                    ${this.response || 'Ready to listen...'}
                </div>

                <div class="audio-controls">
                    <button
                        class=${buttonClass}
                        @click=${this.toggleRecording}
                        ?disabled=${this.isProcessing} <!-- Disable button while processing -->
                    >
                        ${buttonText}
                    </button>

                    <div class="audio-status">
                        ${statusText}
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const isAssistantView = this.currentView === 'assistant';

        return html`
            <div class="window-container">
                <div class="container">
                    <div class="header">
                        <div class="header-title">
                            ${isAssistantView ? 'Audio Assistant - Active' : 'Audio Assistant'}
                        </div>
                        <div class="header-actions">
                            ${isAssistantView ? html`
                                <span>${this.statusText}</span>
                                <button @click=${this.handleHideToggle} class="button">Hide</button>
                            ` : ''}
                            <button @click=${this.handleClose} class="icon-button">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <path d="M6 18L18 6M6 6l12 12"></path>
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div class="main-content">
                        ${isAssistantView ? this.renderAssistantView() : this.renderMainView()}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('audio-assistant-app', AudioAssistantApp);